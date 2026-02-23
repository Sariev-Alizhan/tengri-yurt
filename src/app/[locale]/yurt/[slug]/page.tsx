import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { formatPrice } from '@/utils/formatPrice';

export default async function YurtDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('catalog');
  const tNav = await getTranslations('nav');
  const supabase = await createClient();
  const { data: yurt, error } = await supabase
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

  if (error || !yurt) notFound();

  const supplier = Array.isArray(yurt.suppliers) ? yurt.suppliers[0] : yurt.suppliers;
  const mainPhoto = yurt.photos?.[0];

  return (
    <div className="bg-beige min-h-screen">
      {/* Hero: full-screen image with overlay */}
      <section className="relative h-[70vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 z-0">
          {mainPhoto ? (
            <Image
              src={mainPhoto}
              alt={yurt.name}
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
            {yurt.name}
          </h1>
        </div>
      </section>

      {/* Details */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {yurt.description && (
              <p className="font-inter text-white/80 font-light whitespace-pre-wrap">
                {yurt.description}
              </p>
            )}
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
              {supplier && (
                <>
                  <dt className="text-white/60 uppercase text-xs tracking-wider">{t('supplierLabel')}</dt>
                  <dd>{(supplier as { company_name: string }).company_name}</dd>
                </>
              )}
            </dl>
            {yurt.features?.length > 0 && (
              <ul className="font-inter text-white/70 font-light space-y-2">
                {yurt.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            )}
            <div>
              <p className="font-garamond text-white text-2xl mb-6">
                from ${formatPrice(yurt.price_usd)}
              </p>
              <Link
                href={`/${locale}/order/${yurt.id}`}
                className="inline-block border border-white text-white py-3 px-8 uppercase font-inter font-medium tracking-[0.1em] hover:bg-white hover:text-black transition-colors duration-200"
              >
                {tNav('bookNow')}
              </Link>
            </div>
          </div>
        </div>

        {/* Gallery grid */}
        {yurt.photos && yurt.photos.length > 1 && (
          <div className="mt-20 pt-20 border-t border-white/10">
            <h2 className="font-garamond text-white text-2xl mb-8">{t('galleryLabel')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {yurt.photos.map((url, i) => (
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
