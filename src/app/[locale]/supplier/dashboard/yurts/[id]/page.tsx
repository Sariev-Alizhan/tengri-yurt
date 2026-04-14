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
    <div style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sp-text-3)', marginBottom: '6px' }}>Catalogue</p>
        <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(26px, 4vw, 36px)', color: 'var(--sp-text-1)', fontWeight: 400, margin: 0 }}>{t('editYurt')}</h1>
      </div>
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
