import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { PriceUsdKzt } from '@/components/PriceUsdKzt';
import { AccessoryDetailAddToCart } from '@/components/AccessoryDetailAddToCart';
import { AccessoryPhotoCarousel } from '@/components/AccessoryPhotoCarousel';
import { DEFAULT_ACCESSORIES } from '@/lib/defaultCatalog';

export default async function AccessoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('catalog');
  const tOrder = await getTranslations('order');
  const supabase = await createClient();
  const defaultAcc = DEFAULT_ACCESSORIES.find((a) => a.slug === slug);
  const { data: dbAccessory, error } = await supabase
    .from('accessories')
    .select(`
      id, name, slug, description, category,
      price_usd, price_kzt, stock_quantity,
      production_days_min, production_days_max,
      photos, supplier_id,
      name_i18n, description_i18n, history_i18n,
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
  const photos: string[] = (accessory.photos ?? []).filter(Boolean);
  const mainPhoto = photos[0];
  const nameI18n = (accessory as { name_i18n?: Record<string, string> }).name_i18n;
  const descI18n = (accessory as { description_i18n?: Record<string, string> }).description_i18n;
  const historyI18n = (accessory as { history_i18n?: Record<string, string> }).history_i18n;
  const displayName = (nameI18n && nameI18n[locale]) || accessory.name;
  const displayDesc = (descI18n && descI18n[locale]) || accessory.description;
  const displayHistory = (historyI18n && historyI18n[locale]) || (accessory.id.startsWith('default-') && defaultAcc ? (defaultAcc as { history?: string }).history : null);

  const categoryLabels: Record<string, string> = {
    carpet: t('categoryCarpet'),
    furniture: t('categoryFurniture'),
    cover: t('categoryCover'),
    other: t('categoryOther'),
  };
  const categoryLabel = categoryLabels[accessory.category] || accessory.category;

  return (
    <div className="bg-beige min-h-screen">

      {/* ── HERO ── */}
      <section className="relative h-[75vh] min-h-[480px] overflow-hidden">
        {photos.length > 0
          ? <AccessoryPhotoCarousel photos={photos} name={displayName} />
          : <div className="absolute inset-0 bg-[#1a1714]" />
        }
        {/* Name overlay — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none
          max-w-5xl mx-auto px-6 sm:px-10"
          style={{ paddingBottom: photos.length > 1 ? '2.5rem' : '3rem' }}>
          <p className="font-inter text-white/40 text-[9px] uppercase tracking-[0.3em] mb-3">
            {categoryLabel}
          </p>
          <h1 className="font-garamond text-white font-normal"
            style={{ fontSize: 'clamp(32px, 6vw, 64px)', lineHeight: 1.05 }}>
            {displayName}
          </h1>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">

          {/* Left: text content */}
          <div className="lg:col-span-3 space-y-12">

            {displayDesc && (
              <div>
                <p className="font-inter text-white/30 text-[9px] uppercase tracking-[0.25em] mb-5">
                  {t('descriptionTitle')}
                </p>
                <p className="font-inter text-white/75 font-light leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                  {displayDesc}
                </p>
              </div>
            )}

            {displayHistory && (
              <>
                <div className="h-px bg-white/8" />
                <div>
                  <p className="font-inter text-white/30 text-[9px] uppercase tracking-[0.25em] mb-5">
                    {t('historyTitle')}
                  </p>
                  <p className="font-inter text-white/70 font-light leading-relaxed text-sm sm:text-base">
                    {displayHistory}
                  </p>
                </div>
              </>
            )}

            {/* Specs */}
            <div className="h-px bg-white/8" />
            <dl className="space-y-4">
              {[
                [t('category'), categoryLabel],
                accessory.stock_quantity > 0
                  ? [t('stockLabel'), `${accessory.stock_quantity} ${t('inStock')}`]
                  : [t('productionDays'), `${accessory.production_days_min}–${accessory.production_days_max} ${t('days')}`],
                [t('supplierLabel'), (supplier && (supplier as { company_name: string }).company_name) || t('defaultSupplier')],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-baseline gap-8 border-b border-white/6 pb-4">
                  <dt className="font-inter text-white/35 text-[9px] uppercase tracking-[0.2em] shrink-0">{label}</dt>
                  <dd className="font-inter text-white/70 text-sm text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: price + CTA */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28 space-y-8">
              {accessory.price_usd != null && accessory.price_usd > 0 && (
                <div>
                  <p className="font-inter text-white/30 text-[9px] uppercase tracking-[0.25em] mb-2">
                    Price
                  </p>
                  <p className="font-garamond text-white text-4xl font-normal">
                    <PriceUsdKzt usd={accessory.price_usd} />
                  </p>
                </div>
              )}

              <div className="h-px bg-white/10" />

              <div className="space-y-3">
                <AccessoryDetailAddToCart
                  accessoryId={accessory.id}
                  name={displayName}
                  slug={accessory.slug}
                  price_usd={accessory.price_usd}
                  supplier_id={accessory.supplier_id ?? 'default'}
                  photo={mainPhoto ?? null}
                  addToCartLabel={t('addToCart')}
                  quantityLabel={tOrder('quantity')}
                />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
