import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/utils/supabase/server';
import { PriceUsdKzt } from '@/components/PriceUsdKzt';
import { YurtPhotoCarousel } from '@/components/YurtPhotoCarousel';
import { YurtRentButton } from '@/components/YurtRentButton';
import { DEFAULT_YURTS } from '@/lib/defaultCatalog';
import { ProductSchema } from '@/components/StructuredData';
import Navbar from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { getLocale } from 'next-intl/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tengri-camp.kz'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('yurts')
    .select('name, description, price_usd, photos')
    .eq('slug', slug)
    .eq('is_available', true)
    .single()

  const name = data?.name ?? slug
  const price = data?.price_usd ? `From $${data.price_usd.toLocaleString()}` : ''
  const desc = data?.description ?? 'Traditional Kazakh yurt handcrafted for the modern world'
  const photo = Array.isArray(data?.photos) ? data.photos[0] : null

  const ogUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(name)}&sub=${encodeURIComponent(desc.slice(0, 80))}&price=${encodeURIComponent(price)}`

  return {
    title: `${name} — Tengri Yurt`,
    description: desc,
    openGraph: {
      title: `${name} — Tengri Yurt`,
      description: desc,
      images: [photo ? { url: photo, width: 1200, height: 630 } : { url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} — Tengri Yurt`,
      images: [photo ?? ogUrl],
    },
  }
}

export default async function YurtDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('catalog');
  const td = await getTranslations('yurtDescriptions');
  const tFooter = await getTranslations('footer');
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

  const specs = [
    { label: t('diameter'), value: `${yurt.diameter_m} m` },
    { label: t('kanat'), value: String(yurt.kanat) },
    { label: t('filterCapacity'), value: `${yurt.capacity_min ?? '?'}–${yurt.capacity_max ?? '?'} ${t('people')}` },
    { label: t('productionDays'), value: `${yurt.production_days_min}–${yurt.production_days_max} ${t('days')}` },
    { label: t('supplierLabel'), value: (supplier && (supplier as { company_name: string }).company_name) || t('defaultSupplier') },
  ]

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>

        {/* Hero — full-bleed carousel */}
        <section style={{
          position: 'relative',
          height: '80vh',
          minHeight: '480px',
          overflow: 'hidden',
        }}>
          {photos.length > 0 ? (
            <YurtPhotoCarousel photos={photos} name={displayName} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#1a1510' }} />
          )}

          {/* bottom fade */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '50%',
            background: 'linear-gradient(to bottom, transparent, var(--bg-main))',
            pointerEvents: 'none',
            zIndex: 10,
          }} />

          {/* Back link */}
          <Link
            href="/catalog"
            style={{
              position: 'absolute', top: '88px', left: 'clamp(16px, 4vw, 48px)',
              zIndex: 20,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              padding: '8px 14px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '4px',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            ← {t('back')}
          </Link>

          {/* Yurt name overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            zIndex: 20,
            padding: 'clamp(32px, 6vw, 64px) clamp(16px, 4vw, 64px)',
            pointerEvents: 'none',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(201,168,110,0.8)', marginBottom: '12px',
            }}>
              {yurt.kanat}-Kanat · {yurt.diameter_m}m
            </p>
            <h1 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(36px, 7vw, 72px)',
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 400, lineHeight: 1.1, margin: 0,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}>
              {displayName}
            </h1>
          </div>
        </section>

        {/* Quick specs strip */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.03)',
          padding: '20px clamp(16px, 4vw, 64px)',
          display: 'flex', flexWrap: 'wrap', gap: '32px',
          justifyContent: 'center',
        }}>
          {specs.slice(0, 4).map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 'clamp(22px, 3vw, 28px)',
                color: 'rgba(201,168,110,0.95)',
                margin: 0, lineHeight: 1,
              }}>
                {s.value}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '10px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)', margin: '4px 0 0',
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: 'clamp(48px, 8vw, 96px) clamp(16px, 4vw, 48px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 360px',
          gap: '48px',
        }}
          className="yurt-detail-grid"
        >

          {/* Left: description + specs */}
          <div>
            {yurt.description && (
              <div style={{ marginBottom: '40px' }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: 'rgba(201,168,110,0.7)', marginBottom: '16px',
                }}>
                  {t('descriptionTitle')}
                </p>
                <p style={{
                  fontFamily: 'EB Garamond, serif', fontSize: 'clamp(18px, 2.5vw, 22px)',
                  color: 'rgba(255,255,255,0.85)', lineHeight: 1.75,
                  fontWeight: 400, whiteSpace: 'pre-wrap',
                }}>
                  {td.has(slug) ? td(slug) : yurt.description}
                </p>
              </div>
            )}

            {(yurt as { history?: string | null }).history && (
              <div style={{
                borderLeft: '2px solid rgba(201,168,110,0.3)',
                paddingLeft: '24px', marginBottom: '40px',
              }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: 'rgba(201,168,110,0.7)', marginBottom: '12px',
                }}>
                  {t('historyTitle')}
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '14px',
                  color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, fontWeight: 300,
                }}>
                  {td.has(`${slug}History`) ? td(`${slug}History`) : (yurt as { history?: string }).history}
                </p>
              </div>
            )}

            {/* Specs table */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '40px',
            }}>
              {specs.map((s, i) => (
                <div key={s.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px',
                  borderBottom: i < specs.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '11px',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.45)',
                  }}>
                    {s.label}
                  </span>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '14px',
                    color: 'rgba(255,255,255,0.85)', fontWeight: 500,
                  }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Installation note */}
            <div style={{
              background: 'rgba(201,168,110,0.05)',
              border: '1px solid rgba(201,168,110,0.15)',
              borderRadius: '8px', padding: '20px 24px',
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(201,168,110,0.7)', marginBottom: '8px',
              }}>
                {t('installationTitle')}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '13px',
                color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300,
              }}>
                {t('installationNote')}
              </p>
            </div>
          </div>

          {/* Right: sticky order card */}
          <div>
            <div style={{
              position: 'sticky', top: '100px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              {/* Price */}
              <div style={{
                padding: '28px 28px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '10px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)', marginBottom: '8px',
                }}>
                  {t('customPricing')}
                </p>
                <p style={{
                  fontFamily: 'EB Garamond, serif',
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  color: 'rgba(201,168,110,0.95)', margin: 0,
                }}>
                  <PriceUsdKzt usd={yurt.price_usd} usdMax={(yurt as any).price_usd_max} fromPrefix />
                </p>
              </div>

              {/* CTAs */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  href={`/order/${yurt.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '14px 24px',
                    background: 'rgba(201,168,110,0.15)',
                    border: '1px solid rgba(201,168,110,0.5)',
                    color: 'rgba(201,168,110,0.95)',
                    fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    textDecoration: 'none', borderRadius: '6px',
                    transition: 'background 0.2s',
                  }}
                >
                  {t('configureOrder')}
                </Link>

                <a
                  href={`https://wa.me/77477777888?text=${encodeURIComponent(`Hi, I'm interested in the ${displayName} yurt`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '13px 24px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    textDecoration: 'none', borderRadius: '6px',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('orWhatsApp')}
                </a>

                <YurtRentButton
                  yurtId={yurt.id}
                  yurtSlug={yurt.slug}
                  yurtName={displayName}
                  rentalPrice={(yurt as any).rental_price_usd}
                  supplierId={yurt.supplier_id ?? ''}
                  photo={photos[0] ?? null}
                  locale={locale}
                />
              </div>

              {/* Trust signals */}
              <div style={{
                padding: '16px 28px 24px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', flexDirection: 'column', gap: '8px',
              }}>
                {[
                  '✦ Worldwide delivery',
                  '✦ 2–4 day assembly included',
                  '✦ 14-year warranty',
                ].map(s => (
                  <p key={s} style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)', margin: 0,
                  }}>
                    {s}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .yurt-detail-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </main>

      <ProductSchema
        name={displayName}
        description={td.has(slug) ? td(slug) : yurt.description}
        priceLow={yurt.price_usd}
        priceHigh={(yurt as { price_usd_max?: number }).price_usd_max || yurt.price_usd}
        slug={slug}
      />

      <FooterSection
        locale={locale}
        tagline={tFooter('tagline')}
        contactLabel={tFooter('contact')}
        followLabel={tFooter('follow')}
        address={tFooter('address')}
        copyright={tFooter('copyright')}
      />
    </>
  );
}
