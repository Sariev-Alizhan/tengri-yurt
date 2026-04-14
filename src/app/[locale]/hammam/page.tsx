import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import { FooterSection } from '@/components/FooterSection'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'Yurt Hammam — World\'s First Nomadic Spa | Tengri Yurt',
  description: 'The world\'s first traditional Kazakh yurt steam bath. Hot & cold plunge pools, ancient wellness ritual under the open sky.',
}

const GALLERY_SRCS = [
  '/images/hammam/hot-tub-night.png',
  '/images/hammam/interior-steam.jpg',
  '/images/hammam/hot-cold-tubs.jpg',
  '/images/hammam/benches.jpg',
  '/images/hammam/hero-mountains.jpg',
  '/images/hammam/charyn-canyon.jpg',
]

const SPECS_VALUES = [
  '6 m (8-kanat)',
  '80–100 °C',
  '38–42 °C',
  '8–14 °C',
  '6–10 people',
  '3–4 days',
  '380V / 20 kW',
  '45–60 days',
]

const FEATURE_ICONS = ['◎', '◈', '◉', '◇']

const RITUAL_NUMS = ['01', '02', '03', '04']

export default async function HammamPage() {
  const locale = await getLocale()
  const tFooter = await getTranslations('footer')
  const t = await getTranslations('hammamPage')

  const specsLabelsRaw = t.raw('specsLabels') as string[]
  const specs = SPECS_VALUES.map((value, i) => ({ label: specsLabelsRaw[i] ?? '', value }))

  const featuresRaw = t.raw('features') as { title: string; body: string }[]
  const features = featuresRaw.map((f, i) => ({ ...f, icon: FEATURE_ICONS[i] ?? '' }))

  const galleryCaptionsRaw = t.raw('galleryCaptions') as string[]
  const gallery = GALLERY_SRCS.map((src, i) => ({ src, caption: galleryCaptionsRaw[i] ?? '' }))

  const ritualStepsRaw = t.raw('ritualSteps') as { title: string; body: string }[]
  const ritualSteps = ritualStepsRaw.map((s, i) => ({ ...s, n: RITUAL_NUMS[i] ?? '' }))

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#1a1510' }}>

        {/* Hero */}
        <section style={{
          position: 'relative',
          height: '90vh', minHeight: '560px',
          overflow: 'hidden',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/images/hammam/hot-tub-night.png)',
            backgroundSize: 'cover', backgroundPosition: 'center 60%',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(10,8,6,0.3) 0%, rgba(10,8,6,0.9) 100%)',
          }} />

          <div style={{
            position: 'relative', zIndex: 2,
            padding: 'clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px)',
            maxWidth: '800px',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(201,168,110,0.75)', marginBottom: '20px',
            }}>
              {t('heroEyebrow')}
            </p>
            <h1 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(40px, 8vw, 80px)',
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 400, lineHeight: 1.05, margin: '0 0 24px',
            }}>
              Yurt Hammam
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(14px, 2vw, 18px)',
              color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
              fontWeight: 300, maxWidth: '520px', marginBottom: '40px',
            }}>
              {t('heroSubtitle')}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/77477777888?text=${encodeURIComponent('Hi, I\'d like to learn more about the Yurt Hammam')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 32px',
                  background: 'rgba(201,168,110,0.15)',
                  border: '1px solid rgba(201,168,110,0.6)',
                  color: 'rgba(201,168,110,0.95)',
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  textDecoration: 'none', borderRadius: '4px',
                }}
              >
                {t('heroInquire')}
              </a>
              <Link
                href={`/${locale}/catalog`}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '14px 32px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  textDecoration: 'none', borderRadius: '4px',
                }}
              >
                {t('heroAllYurts')}
              </Link>
            </div>
          </div>
        </section>

        {/* Specs strip */}
        <div style={{
          background: 'rgba(201,168,110,0.04)',
          borderTop: '1px solid rgba(201,168,110,0.12)',
          borderBottom: '1px solid rgba(201,168,110,0.12)',
          padding: '28px clamp(24px, 6vw, 80px)',
          display: 'flex', flexWrap: 'wrap', gap: '0',
          justifyContent: 'center',
          overflowX: 'auto',
        }}>
          {specs.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center',
              padding: '12px 28px',
              borderRight: i < specs.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <p style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.2,
              }}>
                {s.value}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '10px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)', margin: '5px 0 0',
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Feature pillars */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 48px)',
        }}>
          <div style={{ marginBottom: '64px', maxWidth: '600px' }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(201,168,110,0.7)', marginBottom: '16px',
            }}>
              {t('experienceEyebrow')}
            </p>
            <h2 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(28px, 5vw, 48px)',
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 400, lineHeight: 1.2, margin: 0,
            }}>
              {t('experienceTitle')}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
            gap: '2px',
          }}>
            {features.map(f => (
              <div key={f.title} style={{
                padding: '36px 32px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontFamily: 'EB Garamond, serif', fontSize: '28px',
                  color: 'rgba(201,168,110,0.6)', margin: '0 0 20px',
                }}>
                  {f.icon}
                </p>
                <h3 style={{
                  fontFamily: 'EB Garamond, serif', fontSize: '20px',
                  color: 'rgba(255,255,255,0.9)', fontWeight: 400,
                  margin: '0 0 12px',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)', lineHeight: 1.8,
                  fontWeight: 300, margin: 0,
                }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 clamp(24px, 6vw, 48px) clamp(64px, 10vw, 120px)',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(201,168,110,0.7)', marginBottom: '32px',
          }}>
            {t('galleryEyebrow')}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'auto auto',
            gap: '4px',
          }}
            className="hammam-gallery"
          >
            {gallery.map((img, i) => (
              <div key={i} style={{
                position: 'relative',
                aspectRatio: i === 0 ? '16/9' : '4/3',
                overflow: 'hidden',
                gridColumn: i === 0 ? 'span 2' : undefined,
              }}>
                <img
                  src={img.src}
                  alt={img.caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '24px 16px 12px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                }}>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '10px',
                    color: 'rgba(255,255,255,0.5)', margin: 0,
                    letterSpacing: '0.05em',
                  }}>
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ritual section */}
        <div style={{
          background: 'rgba(201,168,110,0.04)',
          borderTop: '1px solid rgba(201,168,110,0.1)',
          borderBottom: '1px solid rgba(201,168,110,0.1)',
          padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 80px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px', alignItems: 'center',
        }}
          className="hammam-ritual-grid"
        >
          <div>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(201,168,110,0.7)', marginBottom: '20px',
            }}>
              {t('ritualEyebrow')}
            </p>
            <h2 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 400, lineHeight: 1.25, margin: '0 0 24px',
            }}>
              {t('ritualTitle')}
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '14px',
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.85,
              fontWeight: 300, margin: '0 0 20px',
            }}>
              {t('ritualP1')}
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '14px',
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.85,
              fontWeight: 300,
            }}>
              {t('ritualP2')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {ritualSteps.map(step => (
              <div key={step.n} style={{
                display: 'flex', gap: '20px',
                padding: '20px 24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                alignItems: 'flex-start',
              }}>
                <span style={{
                  fontFamily: 'EB Garamond, serif', fontSize: '24px',
                  color: 'rgba(201,168,110,0.5)', lineHeight: 1,
                  flexShrink: 0, marginTop: '2px',
                }}>
                  {step.n}
                </span>
                <div>
                  <p style={{
                    fontFamily: 'EB Garamond, serif', fontSize: '17px',
                    color: 'rgba(255,255,255,0.85)', margin: '0 0 6px',
                  }}>
                    {step.title}
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '12px',
                    color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
                    fontWeight: 300, margin: 0,
                  }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          padding: 'clamp(64px, 10vw, 120px) 24px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: '20px',
          }}>
            {t('ctaEyebrow')}
          </p>
          <h2 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(32px, 6vw, 60px)',
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 400, margin: '0 0 16px',
          }}>
            {t('ctaTitle')}
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '15px',
            color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
            fontWeight: 300, maxWidth: '480px', margin: '0 auto 40px',
          }}>
            {t('ctaSubtitle')}
          </p>
          <a
            href={`https://wa.me/77477777888?text=${encodeURIComponent('Hi, I\'d like to commission a Yurt Hammam')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 44px',
              background: 'rgba(201,168,110,0.12)',
              border: '1px solid rgba(201,168,110,0.5)',
              color: 'rgba(201,168,110,0.95)',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none', borderRadius: '4px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('ctaButton')}
          </a>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hammam-gallery {
              grid-template-columns: 1fr !important;
            }
            .hammam-gallery > div {
              grid-column: span 1 !important;
              aspect-ratio: 4/3 !important;
            }
            .hammam-ritual-grid {
              grid-template-columns: 1fr !important;
              gap: 48px !important;
            }
          }
          @media (max-width: 900px) {
            .hammam-gallery {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .hammam-gallery > div:first-child {
              grid-column: span 2 !important;
            }
          }
        `}</style>
      </main>

      <FooterSection
        locale={locale}
        tagline={tFooter('tagline')}
        contactLabel={tFooter('contact')}
        followLabel={tFooter('follow')}
        address={tFooter('address')}
        copyright={tFooter('copyright')}
      />
    </>
  )
}
