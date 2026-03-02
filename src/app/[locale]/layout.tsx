import { getMessages } from 'next-intl/server'
import { CartLayout } from '@/components/CartLayout'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <CartLayout locale={locale} messages={messages}>
      {children}
    </CartLayout>
  )
}
