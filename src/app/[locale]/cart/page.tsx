import { getTranslations } from 'next-intl/server'
import { CartPageClient } from './CartPageClient'

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('cartPage')
  return <CartPageClient locale={locale} translations={{ title: t('title'), empty: t('empty'), total: t('total'), checkout: t('checkout'), continueShopping: t('continueShopping'), remove: t('remove'), qty: t('qty'), yurt: t('yurt'), accessory: t('accessory'), noImage: t('noImage'), decreaseQty: t('decreaseQty'), increaseQty: t('increaseQty') }} />
}
