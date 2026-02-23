import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { AccessoryOrderForm } from './AccessoryOrderForm';

export default async function AccessoryOrderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('order');
  const tCatalog = await getTranslations('catalog');
  const supabase = await createClient();
  const { data: accessory, error } = await supabase
    .from('accessories')
    .select('id, name, category, price_usd, price_kzt, stock_quantity')
    .eq('id', id)
    .eq('is_available', true)
    .single();

  if (error || !accessory) notFound();

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      carpet: tCatalog('categoryCarpet'),
      furniture: tCatalog('categoryFurniture'),
      cover: tCatalog('categoryCover'),
      other: tCatalog('categoryOther'),
    };
    return labels[category] || category;
  };

  return (
    <div className="bg-beige-deep min-h-screen pt-24 md:pt-28 pb-16 md:pb-24 px-6 md:px-10">
      <div className="max-w-2xl mx-auto py-6 lg:py-8">
        <h1 className="font-garamond text-white text-4xl mb-2">
          {t('title')}
        </h1>
        <p className="font-inter text-white/70 mb-2">{accessory.name}</p>
        <p className="font-inter text-white/50 text-xs uppercase tracking-wider mb-2">
          {getCategoryLabel(accessory.category)}
        </p>
        <p className="font-inter text-white/50 text-sm mb-12">
          {accessory.price_usd && `$${accessory.price_usd}`}
          {accessory.price_kzt && ` / ${accessory.price_kzt.toLocaleString()} ₸`}
          {accessory.stock_quantity > 0 && ` · ${accessory.stock_quantity} in stock`}
        </p>
        <AccessoryOrderForm
          accessoryId={accessory.id}
          translations={{
            name: t('name'),
            email: t('email'),
            phone: t('phone'),
            country: t('country'),
            city: t('city'),
            address: t('address'),
            quantity: t('quantity'),
            message: t('message'),
            submitInquiry: t('submitInquiry'),
          }}
        />
      </div>
    </div>
  );
}
