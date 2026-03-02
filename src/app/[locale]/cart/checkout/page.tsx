import { getTranslations } from 'next-intl/server'
import { CartCheckoutClient } from './CartCheckoutClient'

export default async function CartCheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('checkout')
  const tCart = await getTranslations('cartPage')
  return (
    <CartCheckoutClient
      locale={locale}
      translations={{
        title: t('title'),
        submit: t('submit'),
        orderPlaced: t('orderPlaced'),
        orderPlacedSub: t('orderPlacedSub'),
        errorRequired: t('errorRequired'),
        errorSubmit: t('errorSubmit'),
        errorAgreement: t('errorAgreement'),
        agreement: t('agreement'),
        name: t('name'),
        email: t('email'),
        phone: t('phone'),
        country: t('country'),
        city: t('city'),
        address: t('address'),
        postalCode: t('postalCode'),
        deliveryNotes: t('deliveryNotes'),
        message: t('message'),
        backToCart: t('backToCart'),
        emptyCart: t('emptyCart'),
        deliveryMapTitle: t('deliveryMapTitle'),
        mapHint: t('mapHint'),
        useMyLocation: t('useMyLocation'),
        loadingMap: t('loadingMap'),
      }}
    />
  )
}
