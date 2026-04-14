import type { Metadata } from 'next'
import { FooterSection } from '@/components/FooterSection'
import { getTranslations, getLocale } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import { Link } from '@/i18n/navigation'
import type { NewsItem } from '@/app/api/news/route'

export const metadata: Metadata = {
  title: 'Press & Stories — Tengri Yurt',
  description: 'Tengri Yurt in the world press. The first Kazakh company bringing nomadic heritage to every continent.',
}

export const revalidate = 3600

const TAG_META: Record<string, { bg: string; color: string }> = {
  Milestone: { bg: 'rgba(100,220,130,0.12)', color: 'rgba(100,220,130,0.9)' },
  Event:     { bg: 'rgba(100,150,255,0.12)', color: 'rgba(130,180,255,0.9)' },
  Launch:    { bg: 'rgba(201,168,110,0.18)', color: 'rgba(201,168,110,0.95)' },
  Story:     { bg: 'rgba(200,120,200,0.12)', color: 'rgba(210,140,210,0.9)' },
  Project:   { bg: 'rgba(255,150,80,0.12)',  color: 'rgba(255,165,90,0.9)' },
  Culture:   { bg: 'rgba(255,80,120,0.12)',  color: 'rgba(255,100,140,0.9)' },
  Update:    { bg: 'rgba(201,168,110,0.12)', color: 'rgba(201,168,110,0.8)' },
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/news`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('news fetch failed')
    const data = await res.json()
    return data.items as NewsItem[]
  } catch {
    return [
      { date: '2024-11', category: 'Global',      title: 'Tengri Yurt delivers first yurt to New Zealand',               body: 'A 12-kanat traditional yurt now sits on the South Island — the first Kazakh yurt ever installed in New Zealand. The project marks our 42nd country.',                                                                                             image: '/images/picture/yurt_lovebern.jpeg',   tag: 'Milestone', source: 'static' },
      { date: '2024-08', category: 'Events',       title: 'Burning Man 2024 — Tengri Camp at Black Rock',                 body: 'Three Tengri yurts formed the centerpiece of the Tengri Camp installation at Burning Man, welcoming thousands of visitors to experience nomadic culture in the Nevada desert.',                                                     image: '/images/picture/yurt_blackrock.jpeg',  tag: 'Event',     source: 'static' },
      { date: '2024-05', category: 'Product',      title: "Introducing the Yurt Hammam — world's first nomadic spa",      body: "We launched the world's first steam bath inside a traditional Kazakh yurt. Hot and cold plunge pools under the open sky. Three thousand years of wellness wisdom.",                                                                   image: '/images/hammam/hot-tub-night.png',     tag: 'Launch',    source: 'static' },
      { date: '2023-11', category: 'Heritage',     title: 'Preserving the art of Kazakh yurt-making',                     body: 'Our master artisans carry centuries of craft. Tengri Yurt is the first company to export this UNESCO-recognized intangible heritage to every continent.',                                                                           image: '/images/picture/yurt_shanyraq.jpeg',   tag: 'Story',     source: 'static' },
      { date: '2023-07', category: 'Destinations', title: 'From the steppe to Dubai: a 16-kanat yurt in the desert',      body: 'A luxury resort in the UAE commissioned our largest yurt for a unique desert glamping experience. Assembly took two days; the result — breathtaking.',                                                                                image: '/images/picture/yurt_dubai.jpeg',      tag: 'Project',   source: 'static' },
      { date: '2022-09', category: 'Culture',      title: 'Miami Art Week — Kazakh nomadic art arrives in the Americas',  body: 'Tengri Yurt partnered with the Miami Art Fair to bring an 8-kanat yurt as a cultural pavilion. Over 3,000 visitors experienced Kazakh interior craft firsthand.',                                                                  image: '/images/picture/yurt_maiyami.jpeg',    tag: 'Culture',   source: 'static' },
    ]
  }
}

export default async function NewsPage() {
  const locale = await getLocale()
  const tFooter = await getTranslations('footer')
  const newsItems = await getNews()

  const [featured, ...rest] = newsItems
  const featuredTag = TAG_META[featured?.tag ?? ''] ?? TAG_META.Update

  return (
    <>
      <Navbar />

      <main style={{ minHeight: '100vh', background: '#0d0b08' }}>

        {/* ── HERO ──────────────────────────────────── */}
        <section style={{
          position: 'relative',
          minHeight: 'clamp(420px, 60vh, 640px)',
          overflow: 'hidden',
          display: 'flex', alignItems: 'flex-end',
        }}>
          {/* BG */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/images/background.jpg)',
            backgroundSize: 'cover', backgroundPosition: 'center 40%',
          }} />
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(8,6,4,0.35) 0%, rgba(8,6,4,0.5) 50%, rgba(8,6,4,0.97) 100%)',
          }} />
          {/* Corner */}
          <div style={{ position: 'absolute', top: 28, right: 28, width: 28, height: 28, borderTop: '1px solid rgba(201,168,110,0.25)', borderRight: '1px solid rgba(201,168,110,0.25)' }} />

          <div style={{
            position: 'relative', zIndex: 2,
            padding: 'clamp(48px, 8vw, 88px) clamp(24px, 6vw, 80px) clamp(40px, 7vh, 72px)',
            maxWidth: '860px', width: '100%',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500,
              letterSpacing: '0.38em', textTransform: 'uppercase',
              color: 'rgba(201,168,110,0.7)', marginBottom: '20px',
            }}>
              Press & Stories
            </p>
            <h1 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(36px, 7vw, 76px)',
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 400, lineHeight: 1.05, margin: '0 0 20px',
            }}>
              The nomads<br />who went global
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(13px, 1.8vw, 17px)',
              color: 'rgba(255,255,255,0.45)',
              maxWidth: '520px', lineHeight: 1.75, fontWeight: 300, margin: 0,
            }}>
              First from Kazakhstan to bring nomadic culture to every continent.
            </p>
          </div>
        </section>

        {/* ── STATS STRIP ───────────────────────────── */}
        <div style={{
          borderBottom: '1px solid rgba(201,168,110,0.1)',
          padding: 'clamp(20px, 4vh, 32px) clamp(24px, 6vw, 80px)',
          display: 'flex', flexWrap: 'wrap',
          gap: 'clamp(20px, 4vw, 0px)',
          justifyContent: 'space-around',
          background: 'rgba(201,168,110,0.02)',
        }}>
          {[
            { n: '42',   l: 'Countries' },
            { n: '200+', l: 'Yurts' },
            { n: '2010', l: 'Founded' },
            { n: 'UNESCO', l: '2018 Heritage' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center', padding: '0 clamp(12px, 2vw, 24px)' }}>
              <div style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(24px, 4vw, 40px)', color: 'rgba(201,168,110,0.9)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── CONTENT ───────────────────────────────── */}
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: 'clamp(40px, 7vh, 80px) clamp(20px, 5vw, 48px)',
        }}>

          {/* ── FEATURED CARD ── */}
          {featured && (
            <div style={{ marginBottom: 'clamp(32px, 6vh, 64px)' }}>
              <p style={{ fontFamily: 'Inter', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,110,0.4)', marginBottom: '16px' }}>
                Featured story
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
                border: '1px solid rgba(201,168,110,0.15)',
                overflow: 'hidden',
                background: 'rgba(201,168,110,0.025)',
                transition: 'border-color 0.3s',
              }}>
                {/* Image */}
                <div style={{ position: 'relative', minHeight: 'clamp(240px, 35vw, 440px)', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image}
                    alt={featured.title}
                    loading="eager"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,6,4,0.2) 0%, transparent 60%)' }} />
                  <div style={{
                    position: 'absolute', top: 16, left: 16,
                    padding: '4px 12px',
                    background: featuredTag.bg,
                    fontFamily: 'Inter', fontSize: '9px', fontWeight: 600,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: featuredTag.color,
                    border: `1px solid ${featuredTag.color.replace('0.9', '0.3').replace('0.95', '0.3')}`,
                  }}>
                    {featured.tag}
                  </div>
                </div>
                {/* Text */}
                <div style={{
                  padding: 'clamp(28px, 5vh, 52px) clamp(24px, 4vw, 48px)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(12px, 2vh, 20px)',
                }}>
                  <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', margin: 0 }}>
                    {featured.date.replace('-', ' / ')} · {featured.category}
                  </p>
                  <h2 style={{
                    fontFamily: 'EB Garamond, serif',
                    fontSize: 'clamp(24px, 3.5vw, 40px)',
                    color: 'rgba(255,255,255,0.93)', fontWeight: 400, lineHeight: 1.15, margin: 0,
                  }}>
                    {featured.title}
                  </h2>
                  <div style={{ width: '48px', height: '1px', background: 'rgba(201,168,110,0.3)' }} />
                  <p style={{
                    fontFamily: 'Inter', fontSize: 'clamp(13px, 1.4vw, 15px)', lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.5)', margin: 0, fontWeight: 300,
                  }}>
                    {featured.body}
                  </p>
                  {featured.url && (
                    <a href={featured.url} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      fontFamily: 'Inter', fontSize: '10px', letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: 'rgba(201,168,110,0.7)', textDecoration: 'none',
                    }}>
                      Read more
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── GRID ── */}
          {rest.length > 0 && (
            <>
              <p style={{ fontFamily: 'Inter', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,110,0.4)', marginBottom: '20px' }}>
                More stories
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
                gap: 'clamp(12px, 1.5vw, 20px)',
              }}>
                {rest.map((item, i) => {
                  const tag = TAG_META[item.tag ?? ''] ?? TAG_META.Update
                  const inner = (
                    <article style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      overflow: 'hidden',
                      display: 'flex', flexDirection: 'column',
                      height: '100%',
                      transition: 'border-color 0.25s, background 0.25s',
                    }}>
                      <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                        />
                        <div style={{
                          position: 'absolute', top: 12, left: 12,
                          padding: '3px 10px',
                          background: tag.bg,
                          fontFamily: 'Inter', fontSize: '9px', fontWeight: 600,
                          letterSpacing: '0.15em', textTransform: 'uppercase', color: tag.color,
                          border: `1px solid ${tag.color.replace('0.9', '0.25').replace('0.95', '0.25')}`,
                        }}>
                          {item.tag}
                        </div>
                      </div>
                      <div style={{ padding: 'clamp(18px, 3vh, 24px) clamp(16px, 2.5vw, 22px)', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <p style={{ fontFamily: 'Inter', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', margin: 0 }}>
                          {item.date.replace('-', ' / ')} · {item.category}
                        </p>
                        <h3 style={{
                          fontFamily: 'EB Garamond, serif', fontSize: 'clamp(17px, 2vw, 21px)',
                          color: 'rgba(255,255,255,0.88)', fontWeight: 400, lineHeight: 1.25, margin: 0,
                        }}>
                          {item.title}
                        </h3>
                        <p style={{
                          fontFamily: 'Inter', fontSize: '12px', lineHeight: 1.7,
                          color: 'rgba(255,255,255,0.4)', margin: 0, flex: 1, fontWeight: 300,
                        }}>
                          {item.body}
                        </p>
                        {item.url && (
                          <p style={{ fontFamily: 'Inter', fontSize: '10px', color: 'rgba(201,168,110,0.5)', margin: 0, letterSpacing: '0.05em' }}>
                            Read more →
                          </p>
                        )}
                      </div>
                    </article>
                  )
                  return item.url ? (
                    <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                      {inner}
                    </a>
                  ) : (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>{inner}</div>
                  )
                })}
              </div>
            </>
          )}

          {/* ── INSTAGRAM ── */}
          <div style={{
            marginTop: 'clamp(40px, 7vh, 72px)',
            padding: 'clamp(24px, 4vh, 40px) clamp(24px, 4vw, 40px)',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(201,168,110,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '20px',
          }}>
            <div>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(18px, 2.5vw, 24px)', color: 'rgba(255,255,255,0.85)', margin: '0 0 6px', fontWeight: 400 }}>
                Follow the journey
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'rgba(255,255,255,0.35)', margin: 0, fontWeight: 300 }}>
                Daily updates, installations, and behind-the-scenes craft
              </p>
            </div>
            <a href="https://www.instagram.com/tengri_camp/" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px',
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.65)',
                fontFamily: 'Inter', fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              @tengri_camp
            </a>
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <div style={{
          textAlign: 'center',
          padding: 'clamp(56px, 10vh, 96px) clamp(24px, 6vw, 48px)',
          borderTop: '1px solid rgba(201,168,110,0.08)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,110,0.05) 0%, transparent 70%)',
          }} />
          <p style={{ fontFamily: 'Inter', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,110,0.4)', marginBottom: '20px', position: 'relative' }}>
            Be part of the story
          </p>
          <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(28px, 5vw, 56px)', color: 'rgba(255,255,255,0.9)', fontWeight: 400, margin: '0 0 clamp(24px, 5vh, 40px)', position: 'relative' }}>
            Own a piece of nomadic heritage
          </h2>
          <Link href="/catalog" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: 'clamp(12px, 2vh, 16px) clamp(32px, 5vw, 52px)',
            border: '1px solid rgba(255,255,255,0.45)',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'Inter', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none',
            position: 'relative',
          }}>
            Explore the collection
          </Link>
        </div>

      </main>

      <FooterSection
        locale={locale}
        tagline={tFooter('tagline')}
        contactLabel={tFooter('contactLabel')}
        followLabel={tFooter('followLabel')}
        address={tFooter('address')}
        copyright={tFooter('copyright')}
        contactWhatsApp={tFooter('contactWhatsApp')}
        trustBadges={tFooter('trustBadges')}
        quizLink={tFooter('quizLink')}
      />
    </>
  )
}
