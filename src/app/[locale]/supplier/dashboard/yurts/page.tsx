import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function SupplierYurtsPage() {
  const t = await getTranslations('supplier');
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/supplier/login`);
    return null;
  }
  const { data: supplier } = await supabase
    .from('suppliers')
    .select('id')
    .eq('user_id', user.id)
    .single();
  if (!supplier) {
    redirect(`/${locale}/supplier/register`);
    return null;
  }
  const { data: yurts } = await supabase
    .from('yurts')
    .select('id, name, slug, price_usd, is_available, photos')
    .eq('supplier_id', (supplier as { id: string }).id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-garamond text-3xl text-white">{t('yurts')}</h1>
        <Link
          href={`/${locale}/supplier/dashboard/yurts/new`}
          className="border border-white text-white py-2 px-6 uppercase font-inter font-medium tracking-wider hover:bg-white hover:text-black transition-colors duration-200"
        >
          {t('addYurt')}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(yurts ?? []).map((y) => (
          <div
            key={y.id}
            className="border border-white/15 p-6 flex flex-col"
          >
            {y.photos?.[0] ? (
              <div className="aspect-[4/3] bg-white/10 mb-4 overflow-hidden">
                <img src={y.photos[0]} alt={y.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-white/10 mb-4 flex items-center justify-center text-white/40 font-inter text-sm">
                {t('noImage')}
              </div>
            )}
            <h2 className="font-garamond text-xl text-white">{y.name}</h2>
            <p className="font-inter text-white/80">${y.price_usd}</p>
            <p className="font-inter text-sm text-white/60 mt-1">
              {y.is_available ? t('isAvailable') : t('unavailable')}
            </p>
            <Link
              href={`/${locale}/supplier/dashboard/yurts/${y.id}`}
              className="mt-4 text-sm uppercase tracking-wider text-white/70 hover:text-white font-inter"
            >
              {t('editYurt')} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
