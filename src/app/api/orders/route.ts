import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { getNextOrderNumber } from '@/lib/orders';
import { sendOrderInquiryConfirmation, sendNewOrderToSupplier } from '@/lib/resend';
import { getEstimatedDeliveryDays } from '@/lib/delivery';
import type { Database } from '@/types/database';

type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tengri-camp.kz';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      yurtId,
      buyerName,
      buyerEmail,
      buyerPhone,
      deliveryCountry,
      deliveryCity,
      deliveryAddress,
      quantity = 1,
      message,
      orderOptions,
      shippingMethod = 'air',
      locale = 'en',
      selectedAccessories = [],
    } = body;

    if (!yurtId || !buyerName || !buyerEmail || !buyerPhone || !deliveryCountry || !deliveryCity) {
      return NextResponse.json(
        { error: 'Missing required fields: yurtId, buyerName, buyerEmail, buyerPhone, deliveryCountry, deliveryCity' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data, error: yurtError } = await supabase
      .from('yurts')
      .select('id, name, supplier_id, price_usd, production_days_min, production_days_max')
      .eq('id', yurtId)
      .single();

    if (yurtError || !data) {
      return NextResponse.json({ error: 'Yurt not found' }, { status: 404 });
    }
    
    const yurt = data as any;
    const orderNumber = await getNextOrderNumber();
    const unitPrice = yurt.price_usd;
    const totalPrice = unitPrice * (quantity || 1);
    const estimatedProductionDays =
      (yurt.production_days_min + yurt.production_days_max) / 2;
    const estimatedDeliveryDays = await getEstimatedDeliveryDays(
      yurt.supplier_id,
      deliveryCountry
    );
    
    const logisticsDaysMin = shippingMethod === 'air' ? 3 : 30;
    const logisticsDaysMax = shippingMethod === 'air' ? 10 : 60;
    const totalDays = Math.round(estimatedProductionDays + estimatedDeliveryDays);

    const insertPayload: Record<string, unknown> = {
      order_number: orderNumber,
      yurt_id: yurtId,
      supplier_id: yurt.supplier_id,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone ?? null,
      delivery_country: deliveryCountry,
      delivery_city: deliveryCity ?? null,
      delivery_address: deliveryAddress ?? null,
      quantity: quantity || 1,
      message: message ?? null,
      unit_price_usd: unitPrice,
      total_price_usd: totalPrice,
      payment_status: 'awaiting_invoice',
      status: 'pending',
      estimated_production_days: Math.round(estimatedProductionDays),
      estimated_delivery_days: estimatedDeliveryDays,
      shipping_method: shippingMethod,
      estimated_logistics_days_min: logisticsDaysMin,
      estimated_logistics_days_max: logisticsDaysMax,
    };
    if (orderOptions != null && typeof orderOptions === 'object') {
      insertPayload.order_options = orderOptions;
    }
    const { data: order, error: insertError } = await (supabase as any)
      .from('orders')
      .insert(insertPayload)
      .select('id')
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Insert order items for the yurt
    const yurtOrderItem: OrderItemInsert = {
      order_id: order.id,
      item_type: 'yurt',
      yurt_id: yurtId,
      accessory_id: null,
      quantity: quantity || 1,
      unit_price_usd: unitPrice,
      total_price_usd: totalPrice,
    };

    const { error: yurtItemError } = await (supabase as any)
      .from('order_items')
      .insert(yurtOrderItem);

    if (yurtItemError) {
      console.error('Error inserting yurt order item:', yurtItemError);
    }

    // Insert order items for accessories if any were selected
    if (selectedAccessories && selectedAccessories.length > 0) {
      const { data: accessories, error: accessoriesError } = await supabase
        .from('accessories')
        .select('id, slug, price_usd')
        .in('slug', selectedAccessories);

      if (!accessoriesError && accessories) {
        const accessoryItems: OrderItemInsert[] = (accessories as any[]).map((acc) => ({
          order_id: order.id,
          item_type: 'accessory' as const,
          yurt_id: null,
          accessory_id: acc.id,
          quantity: 1,
          unit_price_usd: acc.price_usd || 0,
          total_price_usd: acc.price_usd || 0,
        }));

        const { error: accessoryItemsError } = await (supabase as any)
          .from('order_items')
          .insert(accessoryItems);

        if (accessoryItemsError) {
          console.error('Error inserting accessory order items:', accessoryItemsError);
        }
      }
    }

    sendOrderInquiryConfirmation(buyerEmail, {
      order_number: orderNumber,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      yurt_name: yurt.name,
      supplier_name: 'Tengri Yurt',
      quantity: quantity || 1,
      production_days_min: yurt.production_days_min,
      production_days_max: yurt.production_days_max,
      delivery_country: deliveryCountry,
      estimated_delivery_days: estimatedDeliveryDays,
      total_days: totalDays,
    }).catch(() => {});

    const { data: supplier } = await supabase
      .from('suppliers')
      .select('id, user_id')
      .eq('id', yurt.supplier_id)
      .single();
    const supplierUserId = (supplier as any)?.user_id;
    const { data: profile } = supplierUserId ? await supabase
      .from('profiles')
      .select('email')
      .eq('id', supplierUserId)
      .maybeSingle() : { data: null };
    const supplierEmail = (profile as { email?: string } | null)?.email;
    if (supplierEmail) {
      sendNewOrderToSupplier(supplierEmail, {
        order_number: orderNumber,
        yurt_name: yurt.name,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone ?? null,
        delivery_city: deliveryCity ?? null,
        delivery_country: deliveryCountry,
        quantity: quantity || 1,
        message: message ?? null,
        dashboard_url: `${BASE_URL}/${locale}/supplier/dashboard/orders`,
      }).catch(() => {});
    }

    return NextResponse.json({
      orderId: order?.id,
      orderNumber,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
