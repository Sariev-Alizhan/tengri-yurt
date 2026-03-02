'use client'

import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import Navbar from '@/components/Navbar'
import { CartProvider } from '@/components/CartContext'
import { ExchangeRateProvider } from '@/components/ExchangeRateContext'
import { CookieConsent } from '@/components/CookieConsent'

export function CartLayout({
  locale,
  messages,
  children,
}: {
  locale: string
  messages: AbstractIntlMessages
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <ExchangeRateProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main className="min-h-screen overflow-x-hidden">
            {children}
          </main>
          <CookieConsent />
        </NextIntlClientProvider>
      </ExchangeRateProvider>
    </CartProvider>
  )
}
