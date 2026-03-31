import { getTranslations } from 'next-intl/server';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { EditAccessoryForm } from './EditAccessoryForm';

export default async function EditAccessoryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('supplier');
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

  const { data: accessory } = await supabase
    .from('accessories')
    .select('*')
    .eq('id', id)
    .eq('supplier_id', (supplier as { id: string }).id)
    .single();

  if (!accessory) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-garamond text-3xl text-white mb-8">{t('editAccessory')}</h1>
      <EditAccessoryForm
        accessory={accessory}
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
          delete: t('deleteAccessory'),
          confirmDelete: t('confirmDeleteAccessory'),
        }}
      />
    </div>
  );
}
