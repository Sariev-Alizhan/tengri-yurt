import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { AddAccessoryForm } from './AddAccessoryForm';

export default async function NewAccessoryPage() {
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
      <h1 className="font-garamond text-3xl text-white mb-8">{t('addAccessory')}</h1>
      <AddAccessoryForm
        supplierId={(supplier as { id: string }).id}
        translations={{
          accessoryName: t('accessoryName'),
          accessoryDescription: t('accessoryDescription'),
          category: t('category'),
          categoryCarpet: t('categoryCarpet'),
          categoryFurniture: t('categoryFurniture'),
          categoryCover: t('categoryCover'),
          categoryOther: t('categoryOther'),
          priceUsd: t('priceUsd'),
          priceKzt: t('priceKzt'),
          stockQuantity: t('stockQuantity'),
          productionDaysMin: t('productionDaysMin'),
          productionDaysMax: t('productionDaysMax'),
          photos: t('photos'),
          isAvailable: t('isAvailable'),
          save: t('save'),
        }}
      />
    </div>
  );
}
