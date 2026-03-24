'use client'

import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import Navbar from '@/components/Navbar'
import { CartProvider } from '@/components/CartContext'
import { ExchangeRateProvider } from '@/components/ExchangeRateContext'
import { CookieConsent } from '@/components/CookieConsent'
import { BackgroundEffects } from '@/components/BackgroundEffects'
import { MusicPlayer } from '@/components/MusicPlayer'
import { SiteMain } from '@/components/SiteMain'

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
          <BackgroundEffects />
          <div className="relative flex min-h-[100dvh] flex-col">
            <Navbar />
            <SiteMain>{children}</SiteMain>
          </div>
          <MusicPlayer />
          <CookieConsent />
        </NextIntlClientProvider>
      </ExchangeRateProvider>
    </CartProvider>
  )
}
