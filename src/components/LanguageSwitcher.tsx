'use client'

import { useParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const MIN_TOUCH_PX = 44

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

  const handleSwitch = useCallback(
    (langCode: string) => {
      if (langCode === currentLocale) return
      const segments = (pathname || '').split('/')
      segments[1] = langCode
      const newPath = segments.join('/') || `/${langCode}`
      window.location.href = newPath
    },
    [currentLocale, pathname]
  )

  return (
    <div
      className="language-switcher"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(4px, 1vw, 8px)',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {languages.map((lang, i) => (
        <span key={lang.code} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            onClick={() => handleSwitch(lang.code)}
            type="button"
            className="lang-btn"
            style={{
              background: 'none',
              border: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              cursor: lang.code === currentLocale ? 'default' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(12px, 1.5vw, 13px)',
              fontWeight: currentLocale === lang.code ? 600 : 400,
              letterSpacing: '0.1em',
              color:
                currentLocale === lang.code
                  ? 'rgba(255,255,255,1)'
                  : 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              padding: `clamp(10px, 2vw, 12px) clamp(14px, 2.5vw, 18px)`,
              minWidth: MIN_TOUCH_PX,
              minHeight: MIN_TOUCH_PX,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom:
                currentLocale === lang.code
                  ? '2px solid rgba(255,255,255,0.75)'
                  : '2px solid transparent',
              transition: 'color 0.2s ease, border-color 0.2s ease',
              touchAction: 'manipulation',
            }}
            aria-label={`Language: ${lang.label}`}
            aria-current={currentLocale === lang.code ? 'true' : undefined}
          >
            {lang.label}
          </button>
          {i < languages.length - 1 && (
            <span
              style={{
                color: 'rgba(255,255,255,0.25)',
                fontSize: 'clamp(10px, 1.2vw, 12px)',
                padding: '0 2px',
              }}
              aria-hidden
            >
              |
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
