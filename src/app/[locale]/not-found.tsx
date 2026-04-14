import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  let title = 'Page not found'
  let description = 'This page does not exist or has been moved.'
  let homeLabel = 'Back to home'
  let catalogLabel = 'Browse yurts'

  try {
    const t = await getTranslations('notFound')
    title = t('title')
    description = t('description')
    homeLabel = t('home')
    catalogLabel = t('catalog')
  } catch {
    // Fallback to English defaults if locale context unavailable
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-main, #1a1510)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background text */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'EB Garamond, serif',
        fontSize: 'clamp(180px, 40vw, 360px)',
        fontWeight: 400,
        color: 'rgba(255,255,255,0.025)',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}>
        404
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '480px' }}>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(201,168,110,0.7)', marginBottom: '20px',
        }}>
          Lost on the steppe
        </p>

        <h1 style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: 'clamp(32px, 6vw, 52px)',
          color: 'rgba(255,255,255,0.92)',
          fontWeight: 400, lineHeight: 1.2,
          margin: '0 0 16px',
        }}>
          {title}
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '14px',
          color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
          fontWeight: 300, margin: '0 0 48px',
        }}>
          {description}
        </p>

        {/* Decorative yurt symbol */}
        <div style={{
          width: '48px', height: '48px',
          border: '1px solid rgba(201,168,110,0.25)',
          borderRadius: '50%',
          margin: '0 auto 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" stroke="rgba(201,168,110,0.6)" strokeWidth="1.5"/>
            <path d="M10 2 L18 10 L10 18 L2 10 Z" stroke="rgba(201,168,110,0.3)" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '13px 28px',
              background: 'rgba(201,168,110,0.1)',
              border: '1px solid rgba(201,168,110,0.4)',
              color: 'rgba(201,168,110,0.9)',
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              borderRadius: '4px',
            }}
          >
            {homeLabel}
          </Link>
          <Link
            href="/catalog"
            style={{
              padding: '13px 28px',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              borderRadius: '4px',
            }}
          >
            {catalogLabel}
          </Link>
        </div>
      </div>
    </main>
  )
}
