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
    <div style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sp-text-3)', marginBottom: '6px' }}>Catalogue</p>
        <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(26px, 4vw, 36px)', color: 'var(--sp-text-1)', fontWeight: 400, margin: 0 }}>{t('addAccessory')}</h1>
      </div>
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
