import { getTranslations, getLocale } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';

export default async function SupplierAccessoriesPage() {
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
  const { data: accessories } = await supabase
    .from('accessories')
    .select('id, name, slug, category, price_usd, price_kzt, is_available, photos, stock_quantity')
    .eq('supplier_id', (supplier as { id: string }).id)
    .order('created_at', { ascending: false });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      carpet: t('categoryCarpet'),
      furniture: t('categoryFurniture'),
      cover: t('categoryCover'),
      other: t('categoryOther'),
    };
    return labels[category] || category;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-garamond text-3xl text-white">{t('accessories')}</h1>
        <Link
          href={`/supplier/dashboard/accessories/new`}
          className="border border-white text-white py-2 px-6 uppercase font-inter font-medium tracking-wider hover:bg-white hover:text-black transition-colors duration-200"
        >
          {t('addAccessory')}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(accessories ?? []).map((acc) => (
          <div
            key={acc.id}
            className="border border-white/15 p-6 flex flex-col"
          >
            {acc.photos?.[0] ? (
              <div className="aspect-[4/3] bg-white/10 mb-4 overflow-hidden">
                <img src={acc.photos[0]} alt={acc.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-white/10 mb-4 flex items-center justify-center text-white/40 font-inter text-sm">
                {t('noImage')}
              </div>
            )}
            <h2 className="font-garamond text-xl text-white">{acc.name}</h2>
            <p className="font-inter text-xs text-white/50 uppercase tracking-wider mt-1">
              {getCategoryLabel(acc.category)}
            </p>
            <div className="font-inter text-white/80 mt-2">
              {acc.price_usd && <p>${acc.price_usd}</p>}
              {acc.price_kzt && <p className="text-sm text-white/60">{acc.price_kzt.toLocaleString()} ₸</p>}
            </div>
            <p className="font-inter text-sm text-white/60 mt-1">
              {t('stock')}: {acc.stock_quantity}
            </p>
            <p className="font-inter text-sm text-white/60 mt-1">
              {acc.is_available ? t('isAvailable') : t('unavailable')}
            </p>
            <Link
              href={`/supplier/dashboard/accessories/${acc.id}`}
              className="mt-4 text-sm uppercase tracking-wider text-white/70 hover:text-white font-inter"
            >
              {t('edit')} →
            </Link>
          </div>
        ))}
      </div>
      {(!accessories || accessories.length === 0) && (
        <div className="border border-white/15 p-12 text-center">
          <p className="font-inter text-white/50 mb-4">{t('noAccessoriesYet')}</p>
          <Link
            href={`/supplier/dashboard/accessories/new`}
            className="inline-block border border-white text-white py-2 px-6 uppercase font-inter font-medium tracking-wider hover:bg-white hover:text-black transition-colors duration-200"
          >
            {t('addAccessory')}
          </Link>
        </div>
      )}
    </div>
  );
}
