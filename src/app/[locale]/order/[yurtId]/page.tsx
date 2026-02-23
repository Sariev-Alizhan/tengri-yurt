import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { OrderForm } from './OrderForm';

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string; yurtId: string }>;
}) {
  const { yurtId } = await params;
  const t = await getTranslations('order');
  const supabase = await createClient();
  const { data: yurt, error } = await supabase
    .from('yurts')
    .select('id, name, price_usd')
    .eq('id', yurtId)
    .eq('is_available', true)
    .single();

  if (error || !yurt) notFound();

  return (
    <div className="bg-beige-deep min-h-screen pt-24 md:pt-28 pb-16 md:pb-24 px-6 md:px-10">
      <div className="max-w-2xl mx-auto py-6 lg:py-8">
        <h1 className="font-garamond text-white text-4xl mb-2">
          {t('title')}
        </h1>
        <p className="font-inter text-white/70 mb-2">{yurt.name}</p>
        <p className="font-inter text-white/50 text-sm mb-12">
          {t('pricingNote', { price: yurt.price_usd })}
        </p>
        <OrderForm
          yurtId={yurt.id}
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
            interiorTitle: t('interiorTitle'),
            floorWalls: t('floorWalls'),
            feltOption: t('feltOption'),
            carpolanOption: t('carpolanOption'),
            furniture: t('furniture'),
            furnitureInStock: t('furnitureInStock'),
            exclusiveCustom: t('exclusiveCustom'),
            assemblyNote: t('assemblyNote'),
            coverOption: t('coverOption'),
            coverPrice: t('coverPrice'),
          }}
        />
      </div>
    </div>
  );
}
