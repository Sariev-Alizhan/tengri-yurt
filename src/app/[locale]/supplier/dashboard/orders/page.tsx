import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { OrdersList, type Order } from './OrdersList';

export default async function SupplierOrdersPage() {
  const t = await getTranslations('supplier');
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/supplier/login`);
  }
  const { data: supplier } = await supabase
    .from('suppliers')
    .select('id')
    .eq('user_id', user.id)
    .single();
  if (!supplier) {
    redirect(`/${locale}/supplier/register`);
  }
  const { data: ordersRaw } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      buyer_name,
      buyer_email,
      buyer_phone,
      delivery_country,
      delivery_city,
      delivery_address,
      quantity,
      message,
      order_options,
      total_price_usd,
      payment_status,
      status,
      created_at,
      yurts ( name )
    `)
    .eq('supplier_id', (supplier as { id: string }).id)
    .order('created_at', { ascending: false });

  // Fetch order items with accessories for each order
  const orderIds = ordersRaw?.map((o: any) => o.id) || [];
  const { data: orderItems } = orderIds.length > 0 ? await supabase
    .from('order_items')
    .select(`
      id,
      order_id,
      item_type,
      quantity,
      unit_price_usd,
      total_price_usd,
      accessories ( 
        id, 
        name, 
        slug, 
        name_i18n,
        price_usd,
        price_kzt,
        photos
      )
    `)
    .in('order_id', orderIds)
    .eq('item_type', 'accessory') : { data: [] };

  // Group order items by order_id
  const orderItemsMap = new Map();
  (orderItems || []).forEach((item: any) => {
    if (!orderItemsMap.has(item.order_id)) {
      orderItemsMap.set(item.order_id, []);
    }
    orderItemsMap.get(item.order_id).push(item);
  });

  type YurtRel = { name: string } | { name: string }[] | null;
  const orders: Order[] = (ordersRaw ?? []).map((o: Record<string, unknown> & { yurts?: YurtRel }) => ({
    ...o,
    yurts: Array.isArray(o.yurts) ? (o.yurts[0] ?? null) : (o.yurts ?? null),
    orderItems: orderItemsMap.get(o.id) || [],
  })) as Order[];

  const statusLabels: Record<string, string> = {
    pending: t('statusPending'),
    confirmed: t('statusConfirmed'),
    in_production: t('statusInProduction'),
    ready: t('statusReady'),
    shipped: t('statusShipped'),
    delivered: t('statusDelivered'),
    cancelled: t('statusCancelled'),
  };

  return (
    <div className="max-w-6xl">
      <h1 className="font-garamond text-3xl text-white mb-8">{t('orders')}</h1>
      <OrdersList
        orders={orders ?? []}
        statusLabels={statusLabels}
        updateStatusLabel={t('updateStatus')}
        downloadPdfLabel={t('downloadPdf')}
        noOrdersLabel={t('noOrders')}
        messageLabel={t('messageLabel')}
        accessoriesLabel={t('accessoriesLabel') || 'Accessories'}
      />
    </div>
  );
}
