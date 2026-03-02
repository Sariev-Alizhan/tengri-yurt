import { getTranslations, getLocale } from 'next-intl/server';
import { SuccessPageClient } from './SuccessPageClient';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; orders?: string }>;
}) {
  const { order: orderNumber, orders: ordersParam } = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations('success');
  const tCheckout = await getTranslations('checkout');

  const orderNumbers = ordersParam
    ? ordersParam.split(',').map((s) => s.trim()).filter(Boolean)
    : orderNumber
      ? [orderNumber]
      : [];

  return (
    <SuccessPageClient
      orderNumbers={orderNumbers}
      locale={locale}
      translations={{
        title: t('title'),
        subtitle: t('subtitle'),
        backToCatalog: t('backToCatalog'),
        orderPlaced: tCheckout('orderPlaced'),
        orderPlacedSub: tCheckout('orderPlacedSub'),
      }}
    />
  );
}
