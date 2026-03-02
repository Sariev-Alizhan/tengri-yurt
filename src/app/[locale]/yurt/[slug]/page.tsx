import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { PriceUsdKzt } from '@/components/PriceUsdKzt';
import { YurtDetailAddToCart } from '@/components/YurtDetailAddToCart';
import { DEFAULT_YURTS } from '@/lib/defaultCatalog';

export default async function YurtDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('catalog');
  const tNav = await getTranslations('nav');
  const tOrder = await getTranslations('order');
  const supabase = await createClient();
  const { data: dbYurt, error } = await supabase
    .from('yurts')
    .select(`
      id,
      name,
      slug,
      description,
      price_usd,
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
  const mainPhoto = yurt.photos?.[0];
  const knownYurtSlugs = ['intimate', 'cozy', 'classic', 'spacious', 'grand', 'monumental'] as const;
  const displayName = knownYurtSlugs.includes(yurt.slug as typeof knownYurtSlugs[number]) ? t(`yurtNames.${yurt.slug}`) : yurt.name;

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
        </div>
      </section>

      {/* Description & History */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {yurt.description && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 md:p-8">
                <h2 className="font-garamond text-white text-xl md:text-2xl mb-4 uppercase tracking-wider text-white/90">
                  {t('descriptionTitle')}
                </h2>
                <p className="font-inter text-white/80 font-light leading-relaxed whitespace-pre-wrap">
                  {yurt.description}
                </p>
              </div>
            )}
            {(yurt as { history?: string | null }).history && (
              <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-6 md:p-8">
                <h2 className="font-garamond text-white text-xl md:text-2xl mb-4 uppercase tracking-wider text-amber-200/90">
                  {t('historyTitle')}
                </h2>
                <p className="font-inter text-white/75 font-light leading-relaxed">
                  {(yurt as { history?: string }).history}
                </p>
              </div>
            )}
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="font-garamond text-white text-xl md:text-2xl mb-4 uppercase tracking-wider text-white/90">
                {t('installationTitle')}
              </h2>
              <p className="font-inter text-white/80 font-light leading-relaxed">
                {t('installationNote')}
              </p>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-inter text-white/80">
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
              <dd>{yurt.production_days_min}–{yurt.production_days_max} days</dd>
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
            <div className="space-y-4">
              <p className="font-garamond text-white text-2xl">
                <PriceUsdKzt usd={yurt.price_usd} fromPrefix />
              </p>
              <YurtDetailAddToCart
                yurtId={yurt.id}
                name={displayName}
                slug={yurt.slug}
                price_usd={yurt.price_usd}
                supplier_id={yurt.supplier_id ?? 'default'}
                photo={mainPhoto ?? null}
                addToCartLabel={t('addToCart')}
                quantityLabel={tOrder('quantity')}
              />
              {!yurt.id.startsWith('default-') && (
                <Link
                  href={`/${locale}/order/${yurt.id}`}
                  className="inline-block border border-white/50 text-white/90 py-3 px-8 font-inter text-sm uppercase tracking-[0.1em] hover:bg-white/10 transition-colors duration-200"
                >
                  {tNav('bookNow')}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Gallery grid */}
        {yurt.photos && yurt.photos.length > 1 && (
          <div className="mt-20 pt-20 border-t border-white/10">
            <h2 className="font-garamond text-white text-2xl mb-8">{t('galleryLabel')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {yurt.photos.map((url: string, i: number) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={url}
                    alt={`${yurt.name} ${i + 1}`}
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
