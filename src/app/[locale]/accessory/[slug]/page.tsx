import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function AccessoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('catalog');
  const tNav = await getTranslations('nav');
  const supabase = await createClient();
  const { data: accessory, error } = await supabase
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
      suppliers ( id, company_name, description, country )
    `)
    .eq('slug', slug)
    .eq('is_available', true)
    .single();

  if (error || !accessory) notFound();

  const supplier = Array.isArray(accessory.suppliers) ? accessory.suppliers[0] : accessory.suppliers;
  const mainPhoto = accessory.photos?.[0];

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
              alt={accessory.name}
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
            {accessory.name}
          </h1>
          <p className="font-inter text-white/60 text-sm uppercase tracking-wider mt-2">
            {getCategoryLabel(accessory.category)}
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {accessory.description && (
              <p className="font-inter text-white/80 font-light whitespace-pre-wrap">
                {accessory.description}
              </p>
            )}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-inter text-white/80">
              <dt className="text-white/60 uppercase text-xs tracking-wider">{t('category')}</dt>
              <dd>{getCategoryLabel(accessory.category)}</dd>
              
              {accessory.stock_quantity > 0 ? (
                <>
                  <dt className="text-white/60 uppercase text-xs tracking-wider">Stock</dt>
                  <dd>{accessory.stock_quantity} available</dd>
                </>
              ) : (
                <>
                  <dt className="text-white/60 uppercase text-xs tracking-wider">{t('productionDays')}</dt>
                  <dd>{accessory.production_days_min}–{accessory.production_days_max} days</dd>
                </>
              )}
              
              {supplier && (
                <>
                  <dt className="text-white/60 uppercase text-xs tracking-wider">{t('supplierLabel')}</dt>
                  <dd>{(supplier as { company_name: string }).company_name}</dd>
                </>
              )}
            </dl>
            <div>
              <p className="font-garamond text-white text-2xl mb-6">
                {accessory.price_usd && `$${accessory.price_usd}`}
                {accessory.price_kzt && (
                  <span className="text-lg text-white/70 ml-4">
                    {accessory.price_kzt.toLocaleString()} ₸
                  </span>
                )}
              </p>
              <Link
                href={`/${locale}/order/accessory/${accessory.id}`}
                className="inline-block border border-white text-white py-3 px-8 uppercase font-inter font-medium tracking-[0.1em] hover:bg-white hover:text-black transition-colors duration-200"
              >
                {tNav('bookNow')}
              </Link>
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
