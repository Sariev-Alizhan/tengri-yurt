import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations('success');

  return (
    <div className="bg-beige min-h-screen pt-28 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="font-garamond text-white text-4xl mb-4">
          {t('title')}
        </h1>
        {orderNumber && (
          <p className="font-inter text-white/80 mb-2">Order #{orderNumber}</p>
        )}
        <p className="font-inter text-white/70 font-light mb-12">
          {t('subtitle')}
        </p>
        <Link
          href={`/${locale}/catalog`}
          className="inline-block border border-white text-white py-3 px-8 uppercase font-inter font-medium tracking-[0.1em] hover:bg-white hover:text-beige-deep transition-colors duration-200"
        >
          {t('backToCatalog')}
        </Link>
      </div>
    </div>
  );
}
