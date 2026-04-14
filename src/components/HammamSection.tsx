'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const HAMMAM_GALLERY = [
  { src: '/images/hammam/kolsay-lake.jpg', alt: 'Yurt Hammam on Kolsay Lake' },
  { src: '/images/hammam/charyn-canyon.jpg', alt: 'Yurt Hammam at Charyn Canyon' },
  { src: '/images/hammam/interior-steam.jpg', alt: 'Steam rising through shanyrak' },
  { src: '/images/hammam/benches.jpg', alt: 'Handcrafted interior benches' },
  { src: '/images/hammam/hot-cold-tubs.jpg', alt: 'Hot and cold plunge tubs' },
]

export default function HammamSection() {
  return (
    <section className="relative">
      {/* Full-bleed hero */}
      <div className="relative overflow-hidden" style={{ height: '75dvh', minHeight: '500px' }}>
        <Image
          src="/images/hammam/hot-tub-night.png"
          alt="Yurt Hammam in the mountains at night"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        <div className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 w-full px-6 md:px-16 max-w-6xl text-center">
          <p
            className="text-[11px] tracking-[0.3em] uppercase mb-4"
            style={{ color: 'rgba(168,149,120,0.7)' }}
          >
            World First · Nomadic Wellness
          </p>
          <h2
            className="font-garamond text-4xl md:text-6xl font-normal leading-[1.1] mb-5"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
            The world&apos;s first
            <br />
            <span className="italic">nomadic spa</span>
          </h2>
          <p
            className="max-w-md text-base md:text-lg leading-relaxed font-light"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            A traditional steam bath inside an authentic yurt.
            Hot and cold plunge pools under the open sky.
            Three thousand years of wellness wisdom.
          </p>
        </div>
      </div>

      {/* Gallery strip */}
      <div className="py-16 md:py-24" style={{ background: 'var(--bg-alt)' }}>
        <div className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 pb-4 scrollbar-hide">
          {HAMMAM_GALLERY.map((photo, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[65vw] md:w-[30vw] aspect-[4/3] snap-center overflow-hidden"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 65vw, 30vw"
              />
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto px-6 md:px-16 mt-14">
          <div className="space-y-10 mb-14 max-w-2xl mx-auto">
            {[
              { num: '01', title: 'Steam Chamber', text: 'Natural stone heater inside the yurt. Felt insulation maintains a 15°C gradient from floor to ceiling — vs 40°C in rectangular saunas.' },
              { num: '02', title: 'Plunge Pools', text: 'Hot tub at 40°C and cold plunge at 4°C. Outdoor cedar and thermo-ash construction. Complete hydrotherapy under the stars.' },
              { num: '03', title: 'Shanyrak Ventilation', text: 'The dome creates natural spiral air circulation — the Loyly effect. Steam rises through the shanyrak, pulling fresh air from below.' },
            ].map((f) => (
              <div key={f.num} className="flex gap-6 items-start">
                <span
                  className="text-2xl font-garamond font-light shrink-0 w-10"
                  style={{ color: 'rgba(168,149,120,0.5)' }}
                >
                  {f.num}
                </span>
                <div>
                  <h3
                    className="font-garamond text-lg mb-1"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {f.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/hammam"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 28px',
                background: 'rgba(201,168,110,0.1)',
                border: '1px solid rgba(201,168,110,0.45)',
                color: 'rgba(201,168,110,0.95)',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: '3px',
              }}
            >
              Full Hammam page →
            </Link>
            <a
              href="https://wa.me/77477777888?text=Hello%2C%20I%27m%20interested%20in%20the%20Yurt%20Hammam"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 28px',
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: '3px',
              }}
            >
              Inquire via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
