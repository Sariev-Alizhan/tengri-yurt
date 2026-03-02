import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export default async function NotFound() {
  const locale = await getLocale()
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
      <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginBottom: 8 }}>Page not found</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>This page does not exist or has been moved.</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href={`/${locale}`}
          style={{
            padding: '12px 24px',
            border: '1px solid rgba(168,149,120,0.5)',
            color: 'rgba(255,255,255,0.95)',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          Home
        </Link>
        <Link
          href={`/${locale}/supplier/dashboard`}
          style={{
            padding: '12px 24px',
            border: '1px solid rgba(168,149,120,0.5)',
            color: 'rgba(255,255,255,0.95)',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          Supplier panel
        </Link>
        <Link
          href={`/${locale}/supplier/login`}
          style={{
            padding: '12px 24px',
            border: '1px solid rgba(168,149,120,0.5)',
            color: 'rgba(255,255,255,0.95)',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          Sign In
        </Link>
      </div>
    </main>
  )
}
