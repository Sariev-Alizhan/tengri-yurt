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
      yurtId,
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

    if (!yurtId || !buyerName || !buyerEmail || !buyerPhone || !deliveryCountry || !deliveryCity) {
      return NextResponse.json(
        { error: 'Missing required fields: yurtId, buyerName, buyerEmail, buyerPhone, deliveryCountry, deliveryCity' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data: yurt, error: yurtError } = await supabase
      .from('yurts')
      .select('id, name, supplier_id, price_usd, production_days_min, production_days_max')
      .eq('id', yurtId)
      .single();

    if (yurtError || !yurt) {
      return NextResponse.json({ error: 'Yurt not found' }, { status: 404 });
    }

    const orderNumber = await getNextOrderNumber();
    const unitPrice = yurt.price_usd;
    const totalPrice = unitPrice * (quantity || 1);
    const estimatedProductionDays =
      (yurt.production_days_min + yurt.production_days_max) / 2;
    const estimatedDeliveryDays = await getEstimatedDeliveryDays(
      yurt.supplier_id,
      deliveryCountry
    );
    const totalDays = Math.round(estimatedProductionDays + estimatedDeliveryDays);

    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert({
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', (supplier as { user_id?: string })?.user_id)
      .maybeSingle();
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
