import type { Metadata } from 'next'
import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import { FooterSection } from '@/components/FooterSection'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'About Tengri Yurt — Our Story Since 2010',
  description:
    'Born in Almaty in 2010, Tengri Yurt became the first Kazakh company to export UNESCO-listed nomadic heritage to every continent. 42 countries. 200+ yurts. 40+ master artisans.',
}

const TIMELINE_YEARS = ['2010', '2014', '2018', '2021', '2022', '2024']

const MATERIALS_KAZ = ['Түндік', 'Кереге', 'Уық', 'Киіз']

const STATS_NUMS = ['2010', '42', '200+', '40+', '6', '#1']

export default async function AboutPage() {
  const locale = await getLocale()
  const tFooter = await getTranslations('footer')
  const t = await getTranslations('aboutPage')

  const timeline = TIMELINE_YEARS.map((year, i) => ({
    year,
    title: t(`timeline.${i}.title`),
    body: t(`timeline.${i}.body`),
  }))

  const materials = MATERIALS_KAZ.map((kaz, i) => ({
    kaz,
    name: t(`materials.${i}.name`),
    desc: t(`materials.${i}.desc`),
  }))

  const statsLabelsRaw = t.raw('statsLabels') as string[]
  const stats = STATS_NUMS.map((n, i) => ({ n, label: statsLabelsRaw[i] ?? '' }))

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#1a1510' }}>

        {/* Hero */}
        <section style={{
          position: 'relative',
          minHeight: '80vh',
          display: 'flex', alignItems: 'flex-end',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/images/picture/yurt_kazakhstan.jpeg)',
            backgroundSize: 'cover', backgroundPosition: 'center 40%',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, rgba(10,8,6,0.2) 0%, rgba(10,8,6,0.88) 100%)',
          }} />

          <div style={{
            position: 'relative', zIndex: 2,
            padding: 'clamp(60px, 10vw, 120px) clamp(24px, 6vw, 80px)',
            maxWidth: '860px',
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
              fontWeight: 400, lineHeight: 1.08, margin: '0 0 28px',
            }}>
              {t('heroTitle').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(14px, 2vw, 18px)',
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.8,
              fontWeight: 300, maxWidth: '560px',
            }}>
              {t('heroSubtitle')}
            </p>
          </div>
        </section>

        {/* Stats bar */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '32px clamp(24px, 6vw, 80px)',
          display: 'flex', flexWrap: 'wrap',
          gap: '40px', justifyContent: 'center',
        }}>
          {stats.map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 'clamp(28px, 5vw, 44px)',
                color: 'rgba(201,168,110,0.95)', margin: 0, lineHeight: 1,
              }}>
                {s.n}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '10px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)', margin: '6px 0 0',
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mission statement */}
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 48px)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(22px, 4vw, 34px)',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 400, lineHeight: 1.5,
            fontStyle: 'italic',
          }}>
            &ldquo;{t('quote')}&rdquo;
          </p>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'rgba(201,168,110,0.6)', marginTop: '24px',
          }}>
            {t('quoteAuthor')}
          </p>
        </div>

        {/* Timeline */}
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '0 clamp(24px, 6vw, 48px) clamp(64px, 10vw, 120px)',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(201,168,110,0.7)', marginBottom: '48px',
          }}>
            {t('timelineEyebrow')}
          </p>

          <div style={{ position: 'relative' }}>
            {/* vertical line */}
            <div style={{
              position: 'absolute', left: '68px', top: '8px', bottom: '8px',
              width: '1px', background: 'rgba(255,255,255,0.08)',
            }} className="timeline-line" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {timeline.map((item, i) => (
                <div key={item.year} style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr',
                  gap: '32px',
                  paddingBottom: '48px',
                  position: 'relative',
                }}>
                  {/* Year */}
                  <div style={{ paddingTop: '2px' }}>
                    <p style={{
                      fontFamily: 'EB Garamond, serif',
                      fontSize: '22px',
                      color: i === timeline.length - 1
                        ? 'rgba(201,168,110,0.95)'
                        : 'rgba(255,255,255,0.5)',
                      margin: 0, lineHeight: 1,
                      textAlign: 'right', paddingRight: '20px',
                    }}>
                      {item.year}
                    </p>
                    {/* dot */}
                    <div style={{
                      position: 'absolute', left: '62px', top: '6px',
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: i === timeline.length - 1
                        ? 'rgba(201,168,110,0.9)'
                        : 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }} className="timeline-dot" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 style={{
                      fontFamily: 'EB Garamond, serif', fontSize: '22px',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 400, margin: '0 0 10px',
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '14px',
                      color: 'rgba(255,255,255,0.5)', lineHeight: 1.8,
                      fontWeight: 300, margin: 0,
                    }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Photo break */}
        <div style={{
          position: 'relative', height: '50vh', minHeight: '320px', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/images/picture/skelet_yurt.jpeg)',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, #1a1510 0%, transparent 15%, transparent 85%, #1a1510 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(18px, 3vw, 26px)',
              color: 'rgba(255,255,255,0.75)',
              fontStyle: 'italic', letterSpacing: '0.02em',
              textAlign: 'center', padding: '0 24px',
              textShadow: '0 2px 20px rgba(0,0,0,0.6)',
            }}>
              {t('photoBreakText')}
            </p>
          </div>
        </div>

        {/* Materials / anatomy */}
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 48px)',
        }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(201,168,110,0.7)', marginBottom: '16px',
            }}>
              {t('anatomyEyebrow')}
            </p>
            <h2 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(28px, 5vw, 48px)',
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 400, lineHeight: 1.2, margin: 0,
            }}>
              {t('anatomyTitle')}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
            gap: '2px',
          }}>
            {materials.map(m => (
              <div key={m.name} style={{
                padding: '32px 28px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontFamily: 'EB Garamond, serif', fontSize: '13px',
                  color: 'rgba(201,168,110,0.5)', letterSpacing: '0.1em',
                  margin: '0 0 8px',
                }}>
                  {m.kaz}
                </p>
                <h3 style={{
                  fontFamily: 'EB Garamond, serif', fontSize: '20px',
                  color: 'rgba(255,255,255,0.9)', fontWeight: 400,
                  margin: '0 0 14px', lineHeight: 1.3,
                }}>
                  {m.name}
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)', lineHeight: 1.8,
                  fontWeight: 300, margin: 0,
                }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Artisans / UNESCO */}
        <div style={{
          background: 'rgba(201,168,110,0.04)',
          borderTop: '1px solid rgba(201,168,110,0.1)',
          borderBottom: '1px solid rgba(201,168,110,0.1)',
          padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 80px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px', alignItems: 'center',
        }}
          className="about-artisan-grid"
        >
          <div>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(201,168,110,0.7)', marginBottom: '20px',
            }}>
              {t('artisanEyebrow')}
            </p>
            <h2 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 400, lineHeight: 1.25, margin: '0 0 24px',
            }}>
              {t('artisanTitle').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '14px',
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.85,
              fontWeight: 300, margin: '0 0 20px',
            }}>
              {t('artisanP1')}
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '14px',
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.85,
              fontWeight: 300,
            }}>
              {t('artisanP2')}
            </p>
          </div>

          <div style={{
            position: 'relative',
            borderRadius: '2px', overflow: 'hidden',
            aspectRatio: '4/3',
          }}>
            <Image
              src="/images/picture/in_the_yurt.jpeg"
              alt="Tengri Yurt artisans at work"
              fill
              style={{ objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px',
              padding: '6px 12px',
              background: 'rgba(10,8,6,0.7)', backdropFilter: 'blur(8px)',
              borderRadius: '3px',
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '10px',
                color: 'rgba(201,168,110,0.8)', letterSpacing: '0.1em',
                margin: 0, textTransform: 'uppercase',
              }}>
                UNESCO Heritage · 2018
              </p>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '16px',
          justifyContent: 'center', alignItems: 'center',
          padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 48px)',
          textAlign: 'center',
        }}>
          <div style={{ width: '100%', marginBottom: '8px' }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)', marginBottom: '20px',
            }}>
              {t('ctaEyebrow')}
            </p>
            <h2 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(28px, 5vw, 52px)',
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 400, margin: '0 0 40px',
            }}>
              {t('ctaTitle')}
            </h2>
          </div>
          <Link
            href={`/${locale}/catalog`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 36px',
              background: 'rgba(201,168,110,0.1)',
              border: '1px solid rgba(201,168,110,0.5)',
              color: 'rgba(201,168,110,0.95)',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none', borderRadius: '4px',
            }}
          >
            {t('ctaExplore')}
          </Link>
          <Link
            href={`/${locale}/news`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 36px',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              textDecoration: 'none', borderRadius: '4px',
            }}
          >
            {t('ctaPress')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 36px',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              textDecoration: 'none', borderRadius: '4px',
            }}
          >
            {t('ctaContact')}
          </Link>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .about-artisan-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
            .timeline-line, .timeline-dot { display: none; }
          }
          @media (max-width: 500px) {
            .about-artisan-grid > div:first-child > div:last-child {
              grid-template-columns: 1fr !important;
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
