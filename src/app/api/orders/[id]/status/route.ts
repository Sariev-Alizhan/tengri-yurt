import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import { sendOrderStatusUpdate } from '@/lib/resend';
import type { OrderStatus, Database } from '@/types/database';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tengri-camp.kz';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status: newStatus } = body as { status: OrderStatus };
  if (!newStatus) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 });
  }
  const valid: OrderStatus[] = [
    'pending', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled',
  ];
  if (!valid.includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const supabase = createServiceRoleClient();
  const { data, error } = await (supabase as any)
    .from('orders')
    .update({ status: newStatus })
    .eq('id', id)
    .select('id, order_number, buyer_email, buyer_name, status')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Order not found' }, { status: 404 });
  }
  
  const order = data as any;
  const oldStatus = order.status as OrderStatus;
  const orderTrackingUrl = `${BASE_URL}/account/orders`;
  let deliveryDate: string | undefined;
  if (newStatus === 'shipped') {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    deliveryDate = d.toLocaleDateString();
  }

  sendOrderStatusUpdate(order.buyer_email, {
    order_number: order.order_number,
    buyer_name: order.buyer_name,
    old_status: oldStatus,
    new_status: newStatus,
    order_tracking_url: orderTrackingUrl,
    delivery_date: deliveryDate,
  }).catch(() => {});

  return NextResponse.json({ order_id: order.id, status: newStatus });
}
