import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { PriceUsdKzt } from '@/components/PriceUsdKzt';
import { AccessoryDetailAddToCart } from '@/components/AccessoryDetailAddToCart';
import { DEFAULT_ACCESSORIES } from '@/lib/defaultCatalog';

export default async function AccessoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('catalog');
  const tNav = await getTranslations('nav');
  const tOrder = await getTranslations('order');
  const supabase = await createClient();
  const defaultAcc = DEFAULT_ACCESSORIES.find((a) => a.slug === slug);
  const { data: dbAccessory, error } = await supabase
    .from('accessories')
    .select(`
      id,
      name,
      slug,
      description,
      category,
      price_usd,
      price_kzt,
      stock_quantity,
      production_days_min,
      production_days_max,
      photos,
      supplier_id,
      name_i18n,
      description_i18n,
      history_i18n,
      suppliers ( id, company_name, description, country )
    `)
    .eq('slug', slug)
    .eq('is_available', true)
    .single();

  let accessory: NonNullable<typeof dbAccessory>;
  if (error || !dbAccessory) {
    if (!defaultAcc) notFound();
    accessory = {
      id: defaultAcc.id,
      name: defaultAcc.name,
      slug: defaultAcc.slug,
      description: defaultAcc.description,
      category: defaultAcc.category,
      price_usd: defaultAcc.price_usd,
      price_kzt: defaultAcc.price_kzt,
      stock_quantity: defaultAcc.stock_quantity ?? 0,
      production_days_min: 14,
      production_days_max: 21,
      photos: defaultAcc.photos ?? [],
      supplier_id: defaultAcc.supplier_id ?? '',
      name_i18n: defaultAcc.name_i18n,
      description_i18n: null,
      history_i18n: null,
      suppliers: null,
    } as NonNullable<typeof dbAccessory>;
  } else {
    accessory = dbAccessory;
  }

  const supplier = Array.isArray(accessory.suppliers) ? accessory.suppliers[0] : accessory.suppliers;
  const mainPhoto = accessory.photos?.[0];
  const nameI18n = (accessory as { name_i18n?: Record<string, string> }).name_i18n;
  const descI18n = (accessory as { description_i18n?: Record<string, string> }).description_i18n;
  const historyI18n = (accessory as { history_i18n?: Record<string, string> }).history_i18n;
  const displayName = (nameI18n && nameI18n[locale]) || accessory.name;
  const displayDesc = (descI18n && descI18n[locale]) || accessory.description;
  const displayHistory = (historyI18n && historyI18n[locale]) || (accessory.id.startsWith('default-') && defaultAcc ? (defaultAcc as { history?: string }).history : null);

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
    <div className="bg-beige min-h-screen">
      {/* Hero: full-screen image with overlay */}
      <section className="relative h-[70vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 z-0">
          {mainPhoto ? (
            <Image
              src={mainPhoto}
              alt={displayName}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-white/10" />
          )}
          <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(0,0,0,0.25)' }} />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <h1 className="font-garamond text-white text-4xl md:text-6xl">
            {displayName}
          </h1>
          <p className="font-inter text-white/60 text-sm uppercase tracking-wider mt-2">
            {getCategoryLabel(accessory.category)}
          </p>
        </div>
      </section>

      {/* Description & History */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {displayDesc && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 md:p-8">
                <h2 className="font-garamond text-white text-xl md:text-2xl mb-4 uppercase tracking-wider text-white/90">
                  {t('descriptionTitle')}
                </h2>
                <p className="font-inter text-white/80 font-light leading-relaxed whitespace-pre-wrap">
                  {displayDesc}
                </p>
              </div>
            )}
            {displayHistory && (
              <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-6 md:p-8">
                <h2 className="font-garamond text-white text-xl md:text-2xl mb-4 uppercase tracking-wider text-amber-200/90">
                  {t('historyTitle')}
                </h2>
                <p className="font-inter text-white/75 font-light leading-relaxed">
                  {displayHistory}
                </p>
              </div>
            )}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-inter text-white/80">
              <dt className="text-white/60 uppercase text-xs tracking-wider">{t('category')}</dt>
              <dd>{getCategoryLabel(accessory.category)}</dd>
              
              {accessory.stock_quantity > 0 ? (
                <>
                  <dt className="text-white/60 uppercase text-xs tracking-wider">{t('stockLabel')}</dt>
                  <dd>{accessory.stock_quantity} {t('inStock')}</dd>
                </>
              ) : (
                <>
                  <dt className="text-white/60 uppercase text-xs tracking-wider">{t('productionDays')}</dt>
                  <dd>{accessory.production_days_min}–{accessory.production_days_max} {t('days')}</dd>
                </>
              )}
              
              <dt className="text-white/60 uppercase text-xs tracking-wider">{t('supplierLabel')}</dt>
              <dd>{(supplier && (supplier as { company_name: string }).company_name) || t('defaultSupplier')}</dd>
            </dl>
            <div className="space-y-4">
              <p className="font-garamond text-white text-2xl">
                {accessory.price_usd != null && accessory.price_usd > 0 ? (
                  <PriceUsdKzt
                    usd={accessory.price_usd}
                    kzt={accessory.price_kzt}
                    compact={false}
                  />
                ) : accessory.price_kzt != null ? (
                  <span>{accessory.price_kzt.toLocaleString('ru-RU')} ₸</span>
                ) : null}
              </p>
              <AccessoryDetailAddToCart
                accessoryId={accessory.id}
                name={displayName}
                slug={accessory.slug}
                price_usd={accessory.price_usd}
                price_kzt={accessory.price_kzt}
                supplier_id={accessory.supplier_id ?? 'default'}
                photo={mainPhoto ?? null}
                addToCartLabel={t('addToCart')}
                quantityLabel={tOrder('quantity')}
              />
              {!accessory.id.startsWith('default-') && (
                <Link
                  href={`/${locale}/order/accessory/${accessory.id}`}
                  className="inline-block border border-white/50 text-white/90 py-3 px-8 font-inter text-sm uppercase tracking-[0.1em] hover:bg-white/10 transition-colors duration-200"
                >
                  {tNav('bookNow')}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Gallery grid */}
        {accessory.photos && accessory.photos.length > 1 && (
          <div className="mt-20 pt-20 border-t border-white/10">
            <h2 className="font-garamond text-white text-2xl mb-8">{t('galleryLabel')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessory.photos.map((url: string, i: number) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={url}
                    alt={`${accessory.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
