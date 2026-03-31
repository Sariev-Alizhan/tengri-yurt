'use client';

import { Link } from '@/i18n/navigation';

interface SuccessPageClientProps {
  orderNumbers: string[];
  translations: {
    title: string;
    subtitle: string;
    thankYou?: string;
    downloadPdf?: string;
    backToCatalog: string;
    orderPlaced?: string;
    orderPlacedSub?: string;
  };
}

export function SuccessPageClient({
  orderNumbers,
  translations,
}: SuccessPageClientProps) {
  const fromCart = orderNumbers.length > 0 && (translations.orderPlaced ?? '');
  const title = fromCart ? (translations.orderPlaced ?? translations.title) : translations.title;
  const subtitle = fromCart ? (translations.orderPlacedSub ?? translations.subtitle) : translations.subtitle;
  const thankYou = translations.thankYou ?? 'Thank you for your purchase!';
  const downloadPdf = translations.downloadPdf ?? 'Download PDF';

  return (
    <div
      className="bg-beige min-h-screen pt-28 pb-24 overflow-x-hidden"
      style={{ paddingTop: 'clamp(120px, 20vw, 160px)', paddingBottom: 'clamp(60px, 10vw, 100px)' }}
    >
      <div
        className="max-w-xl mx-auto px-4 sm:px-6 text-center"
        style={{ animation: 'fadeInUp 0.6s ease-out' }}
      >
        {/* Checkmark + Thank you */}
        <div className="flex justify-center mb-4">
          <span
            className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-white/60 bg-white/10 text-white"
            aria-hidden
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </div>
        <h1 className="font-garamond text-white text-3xl md:text-4xl mb-2 break-words">
          {thankYou}
        </h1>
        <p className="font-inter text-white/90 text-lg mb-1 break-words">
          {title}
        </p>
        {orderNumbers.length > 0 && (
          <p className="font-inter text-white/80 mb-2 break-words">
            {orderNumbers.length === 1 ? `Order #${orderNumbers[0]}` : `Orders: ${orderNumbers.map((n) => `#${n}`).join(', ')}`}
          </p>
        )}
        <p className="font-inter text-white/70 font-light mb-8">
          {subtitle}
        </p>

        {/* Download PDF per order */}
        {orderNumbers.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {orderNumbers.map((num) => (
              <a
                key={num}
                href={`/api/orders/pdf?orderNumber=${encodeURIComponent(num)}&type=client`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/70 text-white py-2.5 px-5 font-inter text-sm uppercase tracking-[0.1em] hover:bg-white/15 transition-all duration-300"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {downloadPdf} #{num}
              </a>
            ))}
          </div>
        )}

        <Link
          href="/catalog"
          className="inline-block border border-white text-white py-3 px-8 uppercase font-inter font-medium tracking-[0.1em] hover:bg-white hover:text-beige-deep transition-all duration-300 min-h-[44px] flex items-center justify-center mx-auto touch-manipulation"
        >
          {translations.backToCatalog}
        </Link>
      </div>
    </div>
  );
}
