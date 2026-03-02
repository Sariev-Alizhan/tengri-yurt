import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { AddYurtForm } from './AddYurtForm';

export default async function NewYurtPage() {
  const t = await getTranslations('supplier');
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/supplier/login`);
  }
  const { data: supplier } = await supabase
    .from('suppliers')
    .select('id')
    .eq('user_id', user.id)
    .single();
  if (!supplier) {
    redirect(`/${locale}/supplier/register`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-garamond text-3xl text-white mb-8">{t('addYurt')}</h1>
      <AddYurtForm
        supplierId={(supplier as { id: string }).id}
        translations={{
          yurtName: t('yurtName'),
          yurtDescription: t('yurtDescription'),
          priceUsd: t('priceUsd'),
          diameter: t('diameter'),
          kanat: t('kanat'),
          capacityMin: t('capacityMin'),
          capacityMax: t('capacityMax'),
          productionDaysMin: t('productionDaysMin'),
          productionDaysMax: t('productionDaysMax'),
          photos: t('photos'),
          features: t('features'),
          isAvailable: t('isAvailable'),
          save: t('save'),
        }}
      />
    </div>
  );
}
