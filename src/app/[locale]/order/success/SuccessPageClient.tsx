'use client';

import Link from 'next/link';

interface SuccessPageClientProps {
  orderNumbers: string[];
  locale: string;
  translations: {
    title: string;
    subtitle: string;
    backToCatalog: string;
    orderPlaced?: string;
    orderPlacedSub?: string;
  };
}

export function SuccessPageClient({
  orderNumbers,
  locale,
  translations,
}: SuccessPageClientProps) {
  const fromCart = orderNumbers.length > 0 && (translations.orderPlaced ?? '');
  const title = fromCart ? (translations.orderPlaced ?? translations.title) : translations.title;
  const subtitle = fromCart ? (translations.orderPlacedSub ?? translations.subtitle) : translations.subtitle;

  return (
    <div
      className="bg-beige min-h-screen pt-28 pb-24 overflow-x-hidden"
      style={{ paddingTop: 'clamp(120px, 20vw, 160px)', paddingBottom: 'clamp(60px, 10vw, 100px)' }}
    >
      <div
        className="max-w-xl mx-auto px-4 sm:px-6 text-center"
        style={{ animation: 'fadeInUp 0.6s ease-out' }}
      >
        <h1 className="font-garamond text-white text-3xl md:text-4xl mb-4 break-words">
          {title}
        </h1>
        {orderNumbers.length > 0 && (
          <p className="font-inter text-white/80 mb-2 break-words">
            {orderNumbers.length === 1 ? `Order #${orderNumbers[0]}` : `Orders: ${orderNumbers.map((n) => `#${n}`).join(', ')}`}
          </p>
        )}
        <p className="font-inter text-white/70 font-light mb-12">
          {subtitle}
        </p>
        <Link
          href={`/${locale}/catalog`}
          className="inline-block border border-white text-white py-3 px-8 uppercase font-inter font-medium tracking-[0.1em] hover:bg-white hover:text-beige-deep transition-all duration-300 min-h-[44px] flex items-center justify-center mx-auto touch-manipulation"
        >
          {translations.backToCatalog}
        </Link>
      </div>
    </div>
  );
}
