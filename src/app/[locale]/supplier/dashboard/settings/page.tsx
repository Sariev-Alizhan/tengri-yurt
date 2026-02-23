import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function SupplierSettingsPage() {
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
      <h1 className="font-garamond text-3xl text-white mb-4">{t('settings')}</h1>
      <p className="font-inter text-white/70">
        {t('settingsComingSoon')}
      </p>
    </div>
  );
}
