import { getTranslations } from 'next-intl/server';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { EditYurtForm } from './EditYurtForm';

export default async function EditYurtPage({
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

  const { data: yurt } = await supabase
    .from('yurts')
    .select('*')
    .eq('id', id)
    .eq('supplier_id', (supplier as { id: string }).id)
    .single();

  if (!yurt) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-garamond text-3xl text-white mb-8">{t('editYurt')}</h1>
      <EditYurtForm
        yurt={yurt}
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
          delete: t('deleteYurt'),
          confirmDelete: t('confirmDelete'),
        }}
      />
    </div>
  );
}
