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
      locale = 'en',
    } = body;

    if (!accessoryId || !buyerName || !buyerEmail || !buyerPhone || !deliveryCountry || !deliveryCity) {
      return NextResponse.json(
        { error: 'Missing required fields: accessoryId, buyerName, buyerEmail, buyerPhone, deliveryCountry, deliveryCity' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data: accessory, error: accessoryError } = await supabase
      .from('accessories')
      .select('id, name, supplier_id, price_usd, price_kzt, production_days_min, production_days_max')
      .eq('id', accessoryId)
      .single();

    if (accessoryError || !accessory) {
      return NextResponse.json({ error: 'Accessory not found' }, { status: 404 });
    }

    const orderNumber = await getNextOrderNumber();
    const unitPrice = accessory.price_usd || 0;
    const totalPrice = unitPrice * (quantity || 1);
    const estimatedProductionDays =
      (accessory.production_days_min + accessory.production_days_max) / 2;
    const estimatedDeliveryDays = await getEstimatedDeliveryDays(
      accessory.supplier_id,
      deliveryCountry
    );

    const { data: order, error: insertError } = await supabase
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
        message: message ? `[Accessory: ${accessory.name}]\n${message}` : `[Accessory: ${accessory.name}]`,
        unit_price_usd: unitPrice,
        total_price_usd: totalPrice,
        payment_status: 'awaiting_invoice',
        status: 'pending',
        estimated_production_days: Math.round(estimatedProductionDays),
        estimated_delivery_days: estimatedDeliveryDays,
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', (supplier as { user_id?: string })?.user_id)
      .maybeSingle();
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
