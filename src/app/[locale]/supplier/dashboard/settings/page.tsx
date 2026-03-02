import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { ProfileForm } from './ProfileForm';

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
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (!supplier) {
    redirect(`/${locale}/supplier/register`);
  }

  type Supplier = {
    id: string;
    company_name: string;
    description: string | null;
  };

  const supplierData = supplier as Supplier;

  return (
    <ProfileForm
      initialData={{
        company_name: supplierData.company_name,
        description: supplierData.description,
      }}
      userEmail={user.email || ''}
      labels={{
        companyName: t('companyName') || 'Company Name',
        email: t('email'),
        description: t('description') || 'About',
        edit: t('edit') || 'Edit',
        save: t('save') || 'Save',
        cancel: t('cancel') || 'Cancel',
        saving: t('saving') || 'Saving...',
      }}
    />
  );
}
