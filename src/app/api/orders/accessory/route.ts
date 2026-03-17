import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { getNextOrderNumber } from '@/lib/orders';
import { sendOrderInquiryConfirmation, sendNewOrderToSupplier } from '@/lib/resend';
import { getEstimatedDeliveryDays } from '@/lib/delivery';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tengri-camp.kz';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      accessoryId,
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
    } = body;

    if (!accessoryId || !buyerName || !buyerEmail || !buyerPhone || !deliveryCountry || !deliveryCity) {
      return NextResponse.json(
        { error: 'Missing required fields: accessoryId, buyerName, buyerEmail, buyerPhone, deliveryCountry, deliveryCity' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data, error: accessoryError } = await supabase
      .from('accessories')
      .select('id, name, supplier_id, price_usd, price_kzt, production_days_min, production_days_max')
      .eq('id', accessoryId)
      .single();

    if (accessoryError || !data) {
      return NextResponse.json({ error: 'Accessory not found' }, { status: 404 });
    }
    
    const accessory = data as any;
    const orderNumber = await getNextOrderNumber();
    const unitPrice = accessory.price_usd || 0;
    const totalPrice = unitPrice * (quantity || 1);
    const estimatedProductionDays =
      (accessory.production_days_min + accessory.production_days_max) / 2;
    const estimatedDeliveryDays = await getEstimatedDeliveryDays(
      accessory.supplier_id,
      deliveryCountry
    );
    
    const logisticsDaysMin = shippingMethod === 'air' ? 3 : 30;
    const logisticsDaysMax = shippingMethod === 'air' ? 10 : 60;

    const resolvedOptions = (orderOptions != null && typeof orderOptions === 'object')
      ? orderOptions
      : { logistics: { method: shippingMethod } };

    const { data: order, error: insertError } = await (supabase as any)
      .from('orders')
      .insert({
        order_number: orderNumber,
        yurt_id: null,
        supplier_id: accessory.supplier_id,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone ?? null,
        delivery_country: deliveryCountry,
        delivery_city: deliveryCity ?? null,
        delivery_address: deliveryAddress ?? null,
        quantity: quantity || 1,
        message: message || null,
        order_options: resolvedOptions,
        unit_price_usd: unitPrice,
        total_price_usd: totalPrice,
        payment_status: 'awaiting_invoice',
        status: 'pending',
        estimated_production_days: Math.round(estimatedProductionDays),
        estimated_delivery_days: estimatedDeliveryDays,
        shipping_method: shippingMethod,
        estimated_logistics_days_min: logisticsDaysMin,
        estimated_logistics_days_max: logisticsDaysMax,
      })
      .select('id')
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    sendOrderInquiryConfirmation(buyerEmail, {
      order_number: orderNumber,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      yurt_name: accessory.name,
      supplier_name: 'Tengri Yurt',
      quantity: quantity || 1,
      production_days_min: accessory.production_days_min,
      production_days_max: accessory.production_days_max,
      delivery_country: deliveryCountry,
      estimated_delivery_days: estimatedDeliveryDays,
      total_days: Math.round(estimatedProductionDays + estimatedDeliveryDays),
    }).catch(() => {});

    const { data: supplier } = await supabase
      .from('suppliers')
      .select('id, user_id')
      .eq('id', accessory.supplier_id)
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
        yurt_name: accessory.name,
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
