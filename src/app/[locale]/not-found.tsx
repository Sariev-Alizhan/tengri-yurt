import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  let title = 'Page not found'
  let description = 'This page does not exist or has been moved.'
  let homeLabel = 'Home'
  let catalogLabel = 'Catalog'

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
      padding: 24,
      fontFamily: 'Inter, sans-serif',
      background: '#0f0d0a',
      color: 'rgba(255,255,255,0.9)',
    }}>
      <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginBottom: 8 }}>{title}</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>{description}</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            padding: '12px 24px',
            border: '1px solid rgba(168,149,120,0.5)',
            color: 'rgba(255,255,255,0.95)',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          {homeLabel}
        </Link>
        <Link
          href="/catalog"
          style={{
            padding: '12px 24px',
            border: '1px solid rgba(168,149,120,0.5)',
            color: 'rgba(255,255,255,0.95)',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          {catalogLabel}
        </Link>
      </div>
    </main>
  )
}
