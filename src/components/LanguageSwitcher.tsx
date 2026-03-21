'use client'

import { useParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'

export function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const currentLocale = (params?.locale as string) || 'en'
  const [hoveredCode, setHoveredCode] = useState<string | null>(null)

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
        gap: '2px',
        flexWrap: 'nowrap',
      }}
    >
      {languages.map((lang, i) => {
        const isActive = currentLocale === lang.code
        const isHovered = hoveredCode === lang.code && !isActive

        return (
          <span key={lang.code} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => handleSwitch(lang.code)}
              onMouseEnter={() => !isActive && setHoveredCode(lang.code)}
              onMouseLeave={() => setHoveredCode(null)}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: isActive ? 'default' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.1em',
                color: isActive
                  ? 'rgba(255,255,255,1)'
                  : isHovered
                  ? 'rgba(255,255,255,0.85)'
                  : 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
                padding: '6px 8px',
                minHeight: '32px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: isActive
                  ? '1.5px solid rgba(255,255,255,0.75)'
                  : '1.5px solid transparent',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                touchAction: 'manipulation',
              }}
              aria-label={`Language: ${lang.label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {lang.label}
            </button>
            {i < languages.length - 1 && (
              <span
                style={{
                  color: 'rgba(255,255,255,0.2)',
                  fontSize: '11px',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
                aria-hidden
              >
                |
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
