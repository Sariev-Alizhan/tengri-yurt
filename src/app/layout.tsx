import type { Metadata, Viewport } from 'next';
import { Inter, EB_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import type { AbstractIntlMessages } from 'next-intl';
import { NavigationProgress } from '@/components/NavigationProgress';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter' });
const ebGaramond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--font-garamond' });

export const metadata: Metadata = {
  title: 'Tengri Yurt | Traditional Yurts Marketplace',
  description: 'Tengri Camp — traditional yurt production. Browse, order, and receive worldwide.',
  icons: {
    icon: [
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/images/logo_white.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/icon-192.png',
    apple: '/icon-512.png',
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Tengri Yurt',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let locale = 'en';
  let messages: AbstractIntlMessages = {};
  try {
    locale = (await getLocale()) || 'en';
    messages = (await getMessages()) || {};
  } catch {
    // fallback when locale/messages not available (e.g. root "/" before redirect)
  }
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`antialiased ${inter.variable} ${ebGaramond.variable}`}>
      <body className="font-inter bg-beige min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <NavigationProgress />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
