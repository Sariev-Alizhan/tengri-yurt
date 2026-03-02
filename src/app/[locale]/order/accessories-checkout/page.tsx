import { getTranslations, getLocale } from 'next-intl/server';
import { AccessoriesCheckoutForm } from './AccessoriesCheckoutForm';
import { TRADITIONAL_ACCESSORIES } from '@/data/accessories';
import { notFound } from 'next/navigation';

export default async function AccessoriesCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ accessories?: string; order?: string }>;
}) {
  const { accessories: accessoryIds, order: orderNumber } = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations('order');

  if (!accessoryIds) {
    notFound();
  }

  const selectedIds = accessoryIds.split(',').filter(Boolean);
  const selectedAccessories = TRADITIONAL_ACCESSORIES.filter(acc =>
    selectedIds.includes(acc.id)
  );

  if (selectedAccessories.length === 0) {
    notFound();
  }

  const localeKey = locale as 'ru' | 'en' | 'kk';
  const totalKzt = selectedAccessories.reduce((sum, acc) => sum + acc.price_kzt, 0);
  const totalUsd = selectedAccessories.reduce((sum, acc) => sum + acc.price_usd, 0);

  return (
    <div className="bg-beige-deep min-h-screen pt-24 md:pt-28 pb-16 md:pb-24 px-6 md:px-10">
      <div className="max-w-4xl mx-auto py-6 lg:py-8">
        <h1 className="font-garamond text-white text-4xl mb-2">
          {locale === 'ru' ? 'Заказ аксессуаров' : locale === 'kk' ? 'Аксессуарлар тапсырысы' : 'Accessories Order'}
        </h1>
        {orderNumber && (
          <p className="font-inter text-white/70 mb-6 text-sm">
            {locale === 'ru' ? 'К заказу' : locale === 'kk' ? 'Тапсырысқа' : 'For order'} #{orderNumber}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-garamond text-white text-2xl mb-4">
              {locale === 'ru' ? 'Выбранные аксессуары' : locale === 'kk' ? 'Таңдалған аксессуарлар' : 'Selected Accessories'}
            </h2>
            <div className="space-y-3">
              {selectedAccessories.map((acc) => (
                <div
                  key={acc.id}
                  className="border border-white/20 rounded p-3 bg-white/5"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-inter text-white text-sm">
                      {acc.name[localeKey]}
                    </span>
                    <span className="font-inter text-white/80 text-sm whitespace-nowrap ml-4">
                      {acc.price_kzt.toLocaleString('ru-RU')} ₸
                    </span>
                  </div>
                  <p className="font-inter text-white/50 text-xs">
                    {acc.description[localeKey]}
                  </p>
                </div>
              ))}
              <div className="border-t border-white/40 pt-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-garamond text-white text-lg">
                    {locale === 'ru' ? 'Итого' : locale === 'kk' ? 'Барлығы' : 'Total'}:
                  </span>
                  <span className="font-garamond text-white text-xl">
                    {totalKzt.toLocaleString('ru-RU')} ₸ / ${totalUsd.toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-garamond text-white text-2xl mb-4">
              {locale === 'ru' ? 'Контактные данные' : locale === 'kk' ? 'Байланыс деректері' : 'Contact Information'}
            </h2>
            <AccessoriesCheckoutForm
              selectedAccessories={selectedAccessories}
              orderNumber={orderNumber}
              locale={locale}
              translations={{
                name: t('name'),
                email: t('email'),
                phone: t('phone'),
                country: t('country'),
                city: t('city'),
                address: t('address'),
                message: t('message'),
                submitInquiry: locale === 'ru' ? 'Отправить заявку на аксессуары' : locale === 'kk' ? 'Аксессуарларға өтінім жіберу' : 'Submit Accessories Inquiry',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
