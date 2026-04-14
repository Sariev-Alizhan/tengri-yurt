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

export const revalidate = 3600 // Rebuild page at most once per hour

const TAG_COLORS: Record<string, string> = {
  Milestone: 'rgba(100,200,120,0.15)',
  Event: 'rgba(100,150,255,0.15)',
  Launch: 'rgba(201,168,110,0.2)',
  Story: 'rgba(200,120,200,0.15)',
  Project: 'rgba(255,150,80,0.15)',
  Culture: 'rgba(255,80,120,0.15)',
  Update: 'rgba(201,168,110,0.15)',
}
const TAG_TEXT: Record<string, string> = {
  Milestone: 'rgba(100,220,130,0.9)',
  Event: 'rgba(130,180,255,0.9)',
  Launch: 'rgba(201,168,110,0.95)',
  Story: 'rgba(210,140,210,0.9)',
  Project: 'rgba(255,165,90,0.9)',
  Culture: 'rgba(255,100,140,0.9)',
  Update: 'rgba(201,168,110,0.85)',
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('news fetch failed')
    const data = await res.json()
    return data.items as NewsItem[]
  } catch {
    // Inline static fallback so the page always renders
    return [
      { date: '2024-11', category: 'Global', title: 'Tengri Yurt delivers first yurt to New Zealand', body: 'A 12-kanat traditional yurt now sits on the South Island — the first Kazakh yurt ever installed in New Zealand. The project marks our 42nd country.', image: '/images/picture/yurt_lovebern.jpeg', tag: 'Milestone', source: 'static' },
      { date: '2024-08', category: 'Events', title: 'Burning Man 2024 — Tengri Camp at Black Rock', body: 'Three Tengri yurts formed the centerpiece of the Tengri Camp installation at Burning Man, welcoming thousands of visitors to experience nomadic culture in the Nevada desert.', image: '/images/picture/yurt_blackrock.jpeg', tag: 'Event', source: 'static' },
      { date: '2024-05', category: 'Product', title: "Introducing the Yurt Hammam — world's first nomadic spa", body: "We launched the world's first steam bath inside a traditional Kazakh yurt. Hot and cold plunge pools under the open sky. Three thousand years of wellness wisdom.", image: '/images/hammam/hot-tub-night.png', tag: 'Launch', source: 'static' },
      { date: '2023-11', category: 'Heritage', title: 'Preserving the art of Kazakh yurt-making', body: 'Our master artisans carry centuries of craft. Tengri Yurt is the first company to export this UNESCO-recognized intangible heritage to every continent.', image: '/images/picture/yurt_shanyraq.jpeg', tag: 'Story', source: 'static' },
      { date: '2023-07', category: 'Destinations', title: 'From the steppe to Dubai: a 16-kanat yurt in the desert', body: 'A luxury resort in the UAE commissioned our largest yurt for a unique desert glamping experience. Assembly took two days; the result — breathtaking.', image: '/images/picture/yurt_dubai.jpeg', tag: 'Project', source: 'static' },
      { date: '2022-09', category: 'Culture', title: 'Miami Art Week — Kazakh nomadic art arrives in the Americas', body: 'Tengri Yurt partnered with the Miami Art Fair to bring an 8-kanat yurt as a cultural pavilion. Over 3,000 visitors experienced Kazakh interior craft firsthand.', image: '/images/picture/yurt_maiyami.jpeg', tag: 'Culture', source: 'static' },
    ]
  }
}

export default async function NewsPage() {
  const locale = await getLocale()
  const tFooter = await getTranslations('footer')
  const newsItems = await getNews()

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#1a1510' }}>

        {/* Hero */}
        <div style={{
          position: 'relative',
          height: '60vh', minHeight: '420px',
          overflow: 'hidden',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/images/background.jpg)',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(15,10,5,0.2) 0%, rgba(15,10,5,0.85) 100%)',
          }} />
          <div style={{
            position: 'relative', zIndex: 2,
            padding: 'clamp(40px, 8vw, 80px) clamp(24px, 6vw, 80px)',
            maxWidth: '900px',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(201,168,110,0.75)', marginBottom: '16px',
            }}>
              Press & Stories
            </p>
            <h1 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(36px, 7vw, 72px)',
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 400, lineHeight: 1.1, margin: 0,
            }}>
              The nomads who went global
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(14px, 2vw, 17px)',
              color: 'rgba(255,255,255,0.55)', marginTop: '20px',
              maxWidth: '560px', lineHeight: 1.7, fontWeight: 300,
            }}>
              First from Kazakhstan to bring nomadic culture to every continent.
              42 countries. 200+ yurts. One mission.
            </p>
          </div>
        </div>

        {/* Stats banner */}
        <div style={{
          background: 'rgba(0,0,0,0.15)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '28px clamp(24px, 6vw, 80px)',
          display: 'flex', flexWrap: 'wrap',
          gap: '32px', justifyContent: 'center',
        }}>
          {[
            { n: '42', label: 'Countries reached' },
            { n: '200+', label: 'Yurts delivered' },
            { n: '2010', label: 'Founded in Almaty' },
            { n: '#1', label: 'Kazakh yurt exporter' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(28px, 5vw, 44px)', color: 'rgba(201,168,110,0.95)', margin: 0, lineHeight: 1 }}>
                {s.n}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: '6px 0 0' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* News grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) clamp(24px, 6vw, 48px)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
            gap: '24px',
          }}>
            {newsItems.map((item, i) => {
              const cardContent = (
                <article style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                  height: '100%',
                }}>
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      loading={i < 3 ? 'eager' : 'lazy'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      padding: '4px 10px', borderRadius: '999px',
                      background: TAG_COLORS[item.tag] ?? 'rgba(201,168,110,0.15)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      fontFamily: 'Inter, sans-serif', fontSize: '10px',
                      fontWeight: 600, letterSpacing: '0.08em',
                      color: TAG_TEXT[item.tag] ?? 'rgba(201,168,110,0.95)',
                      textTransform: 'uppercase',
                    }}>
                      {item.tag}
                    </div>
                    {item.source === 'scraped' && (
                      <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        padding: '3px 8px', borderRadius: '999px',
                        background: 'rgba(100,220,130,0.12)',
                        border: '1px solid rgba(100,220,130,0.25)',
                        fontFamily: 'Inter, sans-serif', fontSize: '9px',
                        fontWeight: 600, letterSpacing: '0.08em',
                        color: 'rgba(100,220,130,0.8)',
                        textTransform: 'uppercase',
                      }}>
                        Live
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', margin: 0 }}>
                      {item.date.replace('-', ' / ')} · {item.category}
                    </p>
                    <h2 style={{
                      fontFamily: 'EB Garamond, serif', fontSize: 'clamp(18px, 2.5vw, 22px)',
                      color: 'rgba(255,255,255,0.92)', fontWeight: 400, lineHeight: 1.3, margin: 0,
                    }}>
                      {item.title}
                    </h2>
                    <p style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.55)', margin: 0, flex: 1,
                    }}>
                      {item.body}
                    </p>
                    {item.url && (
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(201,168,110,0.6)', margin: 0, letterSpacing: '0.05em' }}>
                        tengri-camp.kz →
                      </p>
                    )}
                  </div>
                </article>
              )

              return item.url ? (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                >
                  {cardContent}
                </a>
              ) : (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  {cardContent}
                </div>
              )
            })}
          </div>

          {/* Instagram CTA */}
          <div style={{
            marginTop: '48px',
            padding: '28px 32px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '22px', color: 'rgba(255,255,255,0.9)', margin: '0 0 6px', fontWeight: 400 }}>
                Follow the journey
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0, fontWeight: 300 }}>
                Daily updates, installations, and behind-the-scenes craft
              </p>
            </div>
            <a
              href="https://www.instagram.com/tengri_camp/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 22px',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
                borderRadius: '4px',
                transition: 'border-color 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              @tengri_camp
            </a>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          padding: 'clamp(48px, 8vw, 96px) 24px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
            Be part of the story
          </p>
          <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(28px, 5vw, 52px)', color: 'rgba(255,255,255,0.92)', fontWeight: 400, margin: '0 0 32px' }}>
            Own a piece of nomadic heritage
          </h2>
          <Link
            href="/catalog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 36px',
              border: '1px solid rgba(255,255,255,0.5)',
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
            }}
          >
            Explore the collection
          </Link>
        </div>
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
