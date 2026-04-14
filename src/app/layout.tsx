import type { Metadata, Viewport } from 'next';
import { Inter, EB_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import type { AbstractIntlMessages } from 'next-intl';
import { NavigationProgress } from '@/components/NavigationProgress';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { YurtChat } from '@/components/YurtChat';
import { ThemeProvider } from '@/components/ThemeProvider';
import { InstallPrompt } from '@/components/InstallPrompt';
import { ServiceWorker } from '@/components/ServiceWorker';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter' });
const ebGaramond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--font-garamond' });

export const metadata: Metadata = {
  title: {
    default: 'Tengri Yurt — Handcrafted Kazakh Yurts Since 2010',
    template: '%s | Tengri Yurt',
  },
  description: 'Handcrafted traditional Kazakh yurts delivered worldwide. 200+ yurts built, 10+ countries, 40+ master artisans. From $5,000.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://tengri-camp.kz'),
  openGraph: {
    type: 'website',
    siteName: 'Tengri Yurt',
    title: 'Tengri Yurt — Handcrafted Kazakh Yurts Since 2010',
    description: 'Traditional Kazakh yurts, handcrafted by master artisans. Worldwide delivery from Kazakhstan.',
    images: [
      {
        url: '/images/hero_bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Tengri Yurt — Traditional Kazakh Yurts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tengri Yurt — Handcrafted Kazakh Yurts',
    description: 'Traditional Kazakh yurts, handcrafted by master artisans. Worldwide delivery.',
    images: ['/images/hero_bg.jpeg'],
  },
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
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Tengri Yurt',
    'msapplication-TileColor': '#1a1510',
    'msapplication-TileImage': '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1a1510' },
    { media: '(prefers-color-scheme: light)', color: '#a89578' },
  ],
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
          <ThemeProvider>
            <NavigationProgress />
            {children}
            <FloatingWhatsApp />
            <YurtChat />
            <InstallPrompt />
            <ServiceWorker />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
