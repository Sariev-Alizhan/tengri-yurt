import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { PriceUsdKzt } from '@/components/PriceUsdKzt';
import { YurtDetailAddToCart } from '@/components/YurtDetailAddToCart';
import { YurtPhotoCarousel } from '@/components/YurtPhotoCarousel';
import { YurtRentButton } from '@/components/YurtRentButton';
import { DEFAULT_YURTS } from '@/lib/defaultCatalog';
import { BackButton } from '@/components/BackButton';

export default async function YurtDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('catalog');
  const supabase = await createClient();
  const { data: dbYurt, error } = await supabase
    .from('yurts')
    .select(`
      id,
      name,
      slug,
      description,
      price_usd,
      price_usd_max,
      rental_price_usd,
      diameter_m,
      kanat,
      capacity_min,
      capacity_max,
      production_days_min,
      production_days_max,
      photos,
      features,
      supplier_id,
      suppliers ( id, company_name, description, country )
    `)
    .eq('slug', slug)
    .eq('is_available', true)
    .single();

  let yurt: NonNullable<typeof dbYurt>;
  if (error || !dbYurt) {
    const defaultYurt = DEFAULT_YURTS.find((y) => y.slug === slug);
    if (!defaultYurt) notFound();
    yurt = {
      id: defaultYurt.id,
      name: defaultYurt.name,
      slug: defaultYurt.slug,
      description: defaultYurt.description,
      price_usd: defaultYurt.price_usd,
      price_usd_max: (defaultYurt as any).price_usd_max ?? null,
      rental_price_usd: (defaultYurt as any).rental_price_usd ?? null,
      diameter_m: defaultYurt.diameter_m,
      kanat: defaultYurt.kanat,
      capacity_min: defaultYurt.capacity_min,
      capacity_max: defaultYurt.capacity_max,
      production_days_min: defaultYurt.production_days_min,
      production_days_max: defaultYurt.production_days_max,
      photos: defaultYurt.photos ?? [],
      features: [],
      supplier_id: defaultYurt.supplier_id ?? '',
      suppliers: null,
      history: (defaultYurt as { history?: string }).history ?? null,
    } as NonNullable<typeof dbYurt> & { history?: string | null };
  } else {
    yurt = dbYurt;
  }

  const supplier = Array.isArray(yurt.suppliers) ? yurt.suppliers[0] : yurt.suppliers;
  const photos: string[] = (yurt.photos ?? []).filter(Boolean);
  const knownYurtSlugs = ['intimate', 'cozy', 'classic', 'spacious', 'grand', 'monumental'] as const;
  const displayName = knownYurtSlugs.includes(yurt.slug as typeof knownYurtSlugs[number]) ? t(`yurtNames.${yurt.slug}`) : yurt.name;

  return (
    <div className="bg-beige min-h-screen">
      <BackButton label={t('back')} />
      {/* Hero: photo carousel */}
      <section className="relative h-[60vh] min-h-[320px] sm:min-h-[380px] md:h-[70vh] flex flex-col overflow-hidden">
        {photos.length > 0 ? (
          <YurtPhotoCarousel photos={photos} name={displayName} />
        ) : (
          <div className="absolute inset-0 bg-[#1a1714]" />
        )}
        {/* Yurt name overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 md:pb-16 pointer-events-none"
          style={{ paddingBottom: photos.length > 1 ? '3.5rem' : undefined }}>
          <h1 className="font-garamond text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight drop-shadow-sm">
            {displayName}
          </h1>
        </div>
      </section>

      {/* Description & History */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {yurt.description && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8">
                <h2 className="font-garamond text-white text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 uppercase tracking-wider text-white/90 font-medium">
                  {t('descriptionTitle')}
                </h2>
                <p className="font-inter text-white/80 text-sm sm:text-base font-light leading-relaxed whitespace-pre-wrap">
                  {yurt.description}
                </p>
              </div>
            )}
            {(yurt as { history?: string | null }).history && (
              <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 p-5 sm:p-6 md:p-8">
                <h2 className="font-garamond text-white text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 uppercase tracking-wider text-amber-200/90 font-medium">
                  {t('historyTitle')}
                </h2>
                <p className="font-inter text-white/75 font-light leading-relaxed">
                  {(yurt as { history?: string }).history}
                </p>
              </div>
            )}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8">
              <h2 className="font-garamond text-white text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 uppercase tracking-wider text-white/90 font-medium">
                {t('installationTitle')}
              </h2>
              <p className="font-inter text-white/80 text-sm sm:text-base font-light leading-relaxed">
                {t('installationNote')}
              </p>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-inter text-white/80 text-sm sm:text-base">
              {yurt.diameter_m != null && (
                <>
                  <dt className="text-white/60 uppercase text-xs tracking-wider">{t('diameter')}</dt>
                  <dd>{yurt.diameter_m} m</dd>
                </>
              )}
              {yurt.kanat != null && (
                <>
                  <dt className="text-white/60 uppercase text-xs tracking-wider">{t('kanat')}</dt>
                  <dd>{yurt.kanat}</dd>
                </>
              )}
              {(yurt.capacity_min != null || yurt.capacity_max != null) && (
                <>
                  <dt className="text-white/60 uppercase text-xs tracking-wider">{t('filterCapacity')}</dt>
                  <dd>{yurt.capacity_min ?? '?'}–{yurt.capacity_max ?? '?'} {t('people')}</dd>
                </>
              )}
              <dt className="text-white/60 uppercase text-xs tracking-wider">{t('productionDays')}</dt>
              <dd>{yurt.production_days_min}–{yurt.production_days_max} {t('days')}</dd>
              <dt className="text-white/60 uppercase text-xs tracking-wider">{t('supplierLabel')}</dt>
              <dd>{(supplier && (supplier as { company_name: string }).company_name) || t('defaultSupplier')}</dd>
            </dl>
            {yurt.features?.length > 0 && (
              <ul className="font-inter text-white/70 font-light space-y-2">
                {yurt.features.map((f: string, i: number) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            )}
            <div className="mt-8 p-5 sm:p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <p className="font-garamond text-white text-xl sm:text-2xl font-medium">
                <PriceUsdKzt usd={yurt.price_usd} usdMax={(yurt as any).price_usd_max} fromPrefix />
              </p>
              {(yurt as any).rental_price_usd > 0 && (
                <p className="font-inter text-sm sm:text-base font-semibold text-[#1a1714] [text-shadow:none]">
                  {t('rent')}: from $ {((yurt as any).rental_price_usd as number).toLocaleString('en-US')}
                </p>
              )}
              <YurtDetailAddToCart
                locale={locale}
                yurtId={yurt.id}
                name={displayName}
                slug={yurt.slug}
                price_usd={yurt.price_usd}
                supplier_id={yurt.supplier_id ?? 'default'}
                photo={photos[0] ?? null}
                addToCartLabel={t('addToCart')}
              />
              <YurtRentButton
                yurtId={yurt.id}
                yurtSlug={yurt.slug}
                yurtName={displayName}
                rentalPrice={(yurt as any).rental_price_usd}
                supplierId={yurt.supplier_id ?? 'default'}
                photo={photos[0] ?? null}
                locale={locale}
              />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
