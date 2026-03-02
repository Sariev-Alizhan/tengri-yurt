import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { getNextOrderNumber } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      accessories,
      buyerName,
      buyerEmail,
      buyerPhone,
      deliveryCountry,
      deliveryCity,
      deliveryAddress,
      message,
      relatedOrderNumber,
      locale = 'en',
    } = body;

    if (!accessories || accessories.length === 0) {
      return NextResponse.json(
        { error: 'No accessories selected' },
        { status: 400 }
      );
    }

    if (!buyerName || !buyerEmail || !buyerPhone || !deliveryCountry || !deliveryCity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const orderNumber = await getNextOrderNumber();

    const totalKzt = accessories.reduce((sum: number, acc: any) => sum + acc.price_kzt, 0);
    const totalUsd = accessories.reduce((sum: number, acc: any) => sum + acc.price_usd, 0);

    const accessoryNames = accessories.map((acc: any) => {
      const localeKey = locale as 'ru' | 'en' | 'kk';
      return acc.name[localeKey] || acc.name.en;
    }).join(', ');

    let messageWithAccessories = `[Accessories Order]\n${accessoryNames}\n\nTotal: ${totalKzt.toLocaleString('ru-RU')} ₸ / $${totalUsd.toLocaleString('en-US')}`;
    
    if (relatedOrderNumber) {
      messageWithAccessories += `\n\nRelated to yurt order: #${relatedOrderNumber}`;
    }
    
    if (message) {
      messageWithAccessories += `\n\n${message}`;
    }

    const { data: order, error: insertError } = await (supabase as any)
      .from('orders')
      .insert({
        order_number: orderNumber,
        yurt_id: null,
        supplier_id: null,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone ?? null,
        delivery_country: deliveryCountry,
        delivery_city: deliveryCity ?? null,
        delivery_address: deliveryAddress ?? null,
        quantity: accessories.length,
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
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
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
