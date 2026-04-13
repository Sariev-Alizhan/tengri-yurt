import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('notFound')

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
      <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginBottom: 8 }}>{t('title')}</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>{t('description')}</p>
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
          {t('home')}
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
          {t('catalog')}
        </Link>
      </div>
    </main>
  )
}
