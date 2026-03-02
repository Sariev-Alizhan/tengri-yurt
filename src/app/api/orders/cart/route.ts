import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { getNextOrderNumber } from '@/lib/orders'
import { getEstimatedDeliveryDays } from '@/lib/delivery'
import { sendOrderInquiryConfirmation, sendNewOrderToSupplier } from '@/lib/resend'
import type { Database } from '@/types/database'
import type { CartItem } from '@/types/cart'

type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tengri-camp.kz'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      items,
      buyerName,
      buyerEmail,
      buyerPhone,
      deliveryCountry,
      deliveryCity,
      deliveryAddress,
      deliveryPostalCode,
      deliveryNotes,
      message,
      shippingMethod = 'air',
      locale = 'en',
    } = body as {
      items: CartItem[]
      buyerName: string
      buyerEmail: string
      buyerPhone: string
      deliveryCountry: string
      deliveryCity: string
      deliveryAddress?: string
      deliveryPostalCode?: string
      deliveryNotes?: string
      message?: string
      shippingMethod?: string
      locale?: string
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (!buyerName || !buyerEmail || !buyerPhone || !deliveryCountry || !deliveryCity) {
      return NextResponse.json(
        { error: 'Missing required fields: buyerName, buyerEmail, buyerPhone, deliveryCountry, deliveryCity' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()
    const orderNumbers: string[] = []

    const yurtItems = items.filter((i): i is Extract<CartItem, { type: 'yurt' }> => i.type === 'yurt')
    const accessoryItems = items.filter(
      (i): i is Extract<CartItem, { type: 'accessory' }> => i.type === 'accessory'
    )
    const usedAccessoryIds = new Set<string>()

    for (const yurtItem of yurtItems) {
      const { data: yurt, error: yurtError } = await supabase
        .from('yurts')
        .select('id, name, supplier_id, price_usd, production_days_min, production_days_max')
        .eq('id', yurtItem.id)
        .single()

      if (yurtError || !yurt) continue

      const yurtData = yurt as any
      const accessoriesForThisSupplier = accessoryItems.filter(
        (a) => a.supplier_id === yurtData.supplier_id
      )
      accessoriesForThisSupplier.forEach((a) => usedAccessoryIds.add(a.id))

      const addonsLine = accessoriesForThisSupplier
        .filter((a) => String(a.id).startsWith('addon-'))
        .map((a) => `${a.name} × ${a.quantity}`)
        .join(', ')
      const deliveryLine = [deliveryAddress, deliveryPostalCode, deliveryNotes].filter(Boolean).join(' · ')
      const messageWithAddons =
        (message ?? '') +
        (deliveryLine ? `\n[Delivery]\n${deliveryLine}` : '') +
        (addonsLine ? `\n[Add-ons]\n${addonsLine}` : '')

      const orderNumber = await getNextOrderNumber()
      const unitPrice = yurtData.price_usd
      const yurtTotal = unitPrice * yurtItem.quantity
      const accessoryTotal = accessoriesForThisSupplier.reduce(
        (sum, a) => sum + (a.price_usd ?? 0) * a.quantity,
        0
      )
      const totalPrice = yurtTotal + accessoryTotal
      const estimatedProductionDays =
        (yurtData.production_days_min + yurtData.production_days_max) / 2
      const estimatedDeliveryDays = await getEstimatedDeliveryDays(
        yurtData.supplier_id,
        deliveryCountry
      )
      const itemShipping = (yurtItem as { logistics?: 'air' | 'sea' }).logistics ?? shippingMethod
      const logisticsDaysMin = itemShipping === 'air' ? 3 : 30
      const logisticsDaysMax = itemShipping === 'air' ? 10 : 60

      const { data: order, error: insertError } = await (supabase as any)
        .from('orders')
        .insert({
          order_number: orderNumber,
          yurt_id: yurtItem.id,
          supplier_id: yurtData.supplier_id,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_phone: buyerPhone ?? null,
          delivery_country: deliveryCountry,
          delivery_city: deliveryCity ?? null,
          delivery_address: deliveryAddress ?? null,
          quantity: yurtItem.quantity,
          message: messageWithAddons || null,
          unit_price_usd: unitPrice,
          total_price_usd: totalPrice,
          payment_status: 'awaiting_invoice',
          status: 'pending',
          estimated_production_days: Math.round(estimatedProductionDays),
          estimated_delivery_days: estimatedDeliveryDays,
          shipping_method: itemShipping,
          estimated_logistics_days_min: logisticsDaysMin,
          estimated_logistics_days_max: logisticsDaysMax,
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('Cart order insert error:', insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      const yurtOrderItem: OrderItemInsert = {
        order_id: order.id,
        item_type: 'yurt',
        yurt_id: yurtItem.id,
        accessory_id: null,
        quantity: yurtItem.quantity,
        unit_price_usd: unitPrice,
        total_price_usd: yurtTotal,
      }
      await (supabase as any).from('order_items').insert(yurtOrderItem)

      if (accessoriesForThisSupplier.length > 0) {
        const { data: accs } = await supabase
          .from('accessories')
          .select('id, slug, price_usd')
          .in(
            'id',
            accessoriesForThisSupplier.map((a) => a.id)
          )
        if (accs) {
          const accessoryOrderItems: OrderItemInsert[] = (accs as any[]).map((acc) => {
            const cartAcc = accessoriesForThisSupplier.find((a) => a.id === acc.id)
            const qty = cartAcc?.quantity ?? 1
            const price = acc.price_usd || 0
            return {
              order_id: order.id,
              item_type: 'accessory' as const,
              yurt_id: null,
              accessory_id: acc.id,
              quantity: qty,
              unit_price_usd: price,
              total_price_usd: price * qty,
            }
          })
          await (supabase as any).from('order_items').insert(accessoryOrderItems)
        }
      }

      orderNumbers.push(orderNumber)
      const totalDays = Math.round(estimatedProductionDays + estimatedDeliveryDays)
      const selectedAccessories = accessoriesForThisSupplier.map((a) => a.slug)
      sendOrderInquiryConfirmation(
        buyerEmail,
        {
          order_number: orderNumber,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          yurt_name: yurtData.name,
          supplier_name: 'Tengri Yurt',
          quantity: yurtItem.quantity,
          production_days_min: yurtData.production_days_min,
          production_days_max: yurtData.production_days_max,
          delivery_country: deliveryCountry,
          estimated_delivery_days: estimatedDeliveryDays,
          total_days: totalDays,
        },
        locale
      ).catch(() => {})

      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id, user_id')
        .eq('id', yurtData.supplier_id)
        .single()
      const supplierUserId = (supplier as any)?.user_id
      const { data: profile } = supplierUserId
        ? await supabase.from('profiles').select('email').eq('id', supplierUserId).maybeSingle()
        : { data: null }
      const supplierEmail = (profile as { email?: string } | null)?.email
      if (supplierEmail) {
        sendNewOrderToSupplier(supplierEmail, {
          order_number: orderNumber,
          yurt_name: yurtData.name,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_phone: buyerPhone ?? null,
          delivery_city: deliveryCity ?? null,
          delivery_country: deliveryCountry,
          quantity: yurtItem.quantity,
          message: message ?? null,
          dashboard_url: `${BASE_URL}/${locale}/supplier/dashboard/orders`,
        }).catch(() => {})
      }
    }

    const remainingAccessories = accessoryItems.filter((a) => !usedAccessoryIds.has(a.id))
    if (remainingAccessories.length > 0) {
      const orderNumber = await getNextOrderNumber()
      const totalUsd = remainingAccessories.reduce(
        (s, a) => s + (a.price_usd ?? 0) * a.quantity,
        0
      )
      const firstSupplierId = remainingAccessories[0].supplier_id
      const accessoryNames = remainingAccessories.map((a) => a.name).join(', ')
      const messageWithAccessories = `[Accessories Order]\n${accessoryNames}\n\n${message || ''}`

      const { data: order, error: accOrderErr } = await (supabase as any)
        .from('orders')
        .insert({
          order_number: orderNumber,
          yurt_id: null,
          supplier_id: firstSupplierId,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_phone: buyerPhone ?? null,
          delivery_country: deliveryCountry,
          delivery_city: deliveryCity ?? null,
          delivery_address: deliveryAddress ?? null,
          quantity: remainingAccessories.reduce((s, a) => s + a.quantity, 0),
          message: messageWithAccessories,
          unit_price_usd: totalUsd,
          total_price_usd: totalUsd,
          payment_status: 'awaiting_invoice',
          status: 'pending',
          estimated_production_days: 30,
          estimated_delivery_days: 7,
          shipping_method: 'air',
          estimated_logistics_days_min: 3,
          estimated_logistics_days_max: 10,
        })
        .select('id')
        .single()

      if (!accOrderErr && order) {
        for (const a of remainingAccessories) {
          await (supabase as any).from('order_items').insert({
            order_id: order.id,
            item_type: 'accessory',
            yurt_id: null,
            accessory_id: a.id,
            quantity: a.quantity,
            unit_price_usd: a.price_usd ?? 0,
            total_price_usd: (a.price_usd ?? 0) * a.quantity,
          })
        }
        orderNumbers.push(orderNumber)
      }
    }

    return NextResponse.json({ orderNumbers })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
