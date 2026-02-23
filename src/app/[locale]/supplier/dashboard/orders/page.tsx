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
      total_price_usd,
      payment_status,
      status,
      created_at,
      yurts ( name )
    `)
    .eq('supplier_id', (supplier as { id: string }).id)
    .order('created_at', { ascending: false });

  type YurtRel = { name: string } | { name: string }[] | null;
  const orders: Order[] = (ordersRaw ?? []).map((o: Record<string, unknown> & { yurts?: YurtRel }) => ({
    ...o,
    yurts: Array.isArray(o.yurts) ? (o.yurts[0] ?? null) : (o.yurts ?? null),
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
        noOrdersLabel={t('noOrders')}
        messageLabel={t('messageLabel')}
      />
    </div>
  );
}
