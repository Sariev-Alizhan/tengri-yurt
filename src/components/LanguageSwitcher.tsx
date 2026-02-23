'use client'

import { useParams, usePathname } from 'next/navigation'

export function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const currentLocale = (params?.locale as string) || 'en'

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'kk', label: 'KZ' },
    { code: 'zh', label: 'CN' },
  ]

  const handleSwitch = (langCode: string) => {
    if (langCode === currentLocale) return
    const segments = (pathname || '').split('/')
    segments[1] = langCode
    const newPath = segments.join('/') || `/${langCode}`
    window.location.href = newPath
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {languages.map((lang, i) => (
        <span key={lang.code} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => handleSwitch(lang.code)}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              cursor: lang.code === currentLocale ? 'default' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: currentLocale === lang.code ? 600 : 300,
              letterSpacing: '0.1em',
              color: currentLocale === lang.code
                ? 'rgba(255,255,255,1)'
                : 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              padding: '0',
              borderBottom: currentLocale === lang.code
                ? '1px solid rgba(255,255,255,0.7)'
                : '1px solid transparent',
              paddingBottom: '1px',
              transition: 'color 0.2s ease',
            }}
          >
            {lang.label}
          </button>
          {i < languages.length - 1 && (
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>|</span>
          )}
        </span>
      ))}
    </div>
  )
}
