'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function PresentationPage() {
  const [entered, setEntered] = useState(false)

  if (entered) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#080604', zIndex: 9999 }}>
        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '48px', zIndex: 10,
          background: 'linear-gradient(180deg, rgba(8,6,4,0.95) 0%, transparent 100%)',
          display: 'flex', alignItems: 'center',
          paddingLeft: 'clamp(16px, 4vw, 32px)',
          paddingRight: 'clamp(16px, 4vw, 32px)',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}>
          <Image
            src="/images/logo_white.png"
            alt="Tengri Yurt"
            width={90} height={30}
            style={{ height: '28px', width: 'auto', opacity: 0.5, pointerEvents: 'none' }}
          />
          <button
            onClick={() => setEntered(false)}
            style={{
              pointerEvents: 'all',
              background: 'none', border: '1px solid rgba(201,168,110,0.25)',
              color: 'rgba(201,168,110,0.7)',
              fontFamily: 'Inter, sans-serif', fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '6px 14px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ← Exit
          </button>
        </div>

        <iframe
          src="/tengri-presentation.html"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Tengri Yurt Presentation"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#080604',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(40px, 8vw, 80px) clamp(24px, 6vw, 60px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.045'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '200px', opacity: 0.45,
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,110,0.05) 0%, transparent 70%)',
      }} />

      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: 32, left: 32, width: 32, height: 32, borderTop: '1px solid rgba(201,168,110,0.25)', borderLeft: '1px solid rgba(201,168,110,0.25)', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: 32, right: 32, width: 32, height: 32, borderBottom: '1px solid rgba(201,168,110,0.25)', borderRight: '1px solid rgba(201,168,110,0.25)', zIndex: 1 }} />

      {/* Back link */}
      <Link href="/" style={{
        position: 'absolute', top: 28, left: 'clamp(24px, 5vw, 48px)',
        fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
        textDecoration: 'none', zIndex: 2,
        display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'color 0.2s',
      }}>
        ← tengri-camp.kz
      </Link>

      {/* Main content */}
      <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '700px', width: '100%' }}>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500,
          letterSpacing: '0.38em', textTransform: 'uppercase',
          color: 'rgba(201,168,110,0.6)', marginBottom: 'clamp(16px, 3vh, 28px)',
        }}>
          Tengri Camp · 2026
        </p>

        <h1 style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: 'clamp(40px, 8vw, 96px)',
          fontWeight: 400, lineHeight: 0.95,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(90deg, #8a6a3a 0%, #c9a86e 35%, #e8d4a8 52%, #c9a86e 68%, #8a6a3a 100%)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 5s linear infinite',
          marginBottom: 'clamp(8px, 1.5vh, 16px)',
        }}>
          Tengri Yurt
        </h1>

        <p style={{
          fontFamily: 'EB Garamond, serif', fontStyle: 'italic',
          fontSize: 'clamp(16px, 2.5vw, 24px)',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: 'clamp(24px, 5vh, 52px)',
        }}>
          Полная презентация платформы
        </p>

        {/* Divider */}
        <div style={{
          width: '100%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,110,0.3), transparent)',
          margin: '0 auto clamp(24px, 5vh, 48px)',
        }} />

        {/* Stats row */}
        <div style={{
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
          gap: 'clamp(20px, 4vw, 48px)',
          marginBottom: 'clamp(28px, 6vh, 56px)',
        }}>
          {[
            { n: '14', label: 'Слайдов' },
            { n: '42', label: 'Страны' },
            { n: '200+', label: 'Юрт' },
            { n: '5', label: 'Языков' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 44px)', color: 'rgba(201,168,110,0.85)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => setEntered(true)}
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(255,255,255,0.45)',
            background: 'transparent',
            padding: 'clamp(12px, 2vh, 16px) clamp(32px, 5vw, 52px)',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s, color 0.2s',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(201,168,110,0.7)'
            e.currentTarget.style.color = '#c9a86e'
            e.currentTarget.style.background = 'rgba(201,168,110,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          Открыть презентацию
        </button>

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '10px',
          color: 'rgba(255,255,255,0.15)', marginTop: '20px',
          letterSpacing: '0.08em',
        }}>
          ← → навигация · скролл · свайп
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 0 }
          100% { background-position: -100% 0 }
        }
      `}</style>
    </div>
  )
}
