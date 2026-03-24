'use client'

import { useCallback, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

export function LanguageSwitcher({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale()
  const switchingRef = useRef(false)
  const [hoveredCode, setHoveredCode] = useState<string | null>(null)

  const languages = [
    { code: 'en' as const, label: 'EN' },
    { code: 'ru' as const, label: 'RU' },
    { code: 'kk' as const, label: 'KZ' },
    { code: 'zh' as const, label: 'CN' },
  ]

  const handleSwitch = useCallback(
    (langCode: string) => {
      if (langCode === currentLocale) return
      if (switchingRef.current) return
      switchingRef.current = true
      const path = pathname && pathname.length > 0 ? pathname : '/'
      onNavigate?.()
      router.replace(path, { locale: langCode })
      window.setTimeout(() => {
        switchingRef.current = false
      }, 600)
    },
    [currentLocale, pathname, router, onNavigate]
  )

  return (
    <div
      className="language-switcher"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexWrap: 'nowrap',
        justifyContent: 'center',
      }}
    >
      {languages.map((lang, i) => {
        const isActive = currentLocale === lang.code
        const isHovered = hoveredCode === lang.code && !isActive

        return (
          <span key={lang.code} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSwitch(lang.code)
              }}
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
                padding: '10px 10px',
                minHeight: '44px',
                minWidth: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: isActive
                  ? '1.5px solid rgba(255,255,255,0.75)'
                  : '1.5px solid transparent',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                touchAction: 'manipulation',
                WebkitUserSelect: 'none',
                userSelect: 'none',
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
                  padding: '0 2px',
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
