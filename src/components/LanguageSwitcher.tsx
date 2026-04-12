'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

export function LanguageSwitcher({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale()
  const switchingRef = useRef(false)
  const [hoveredCode, setHoveredCode] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'en' as const, label: 'EN' },
    { code: 'ru' as const, label: 'RU' },
    { code: 'kk' as const, label: 'KZ' },
    { code: 'zh' as const, label: 'CN' },
    { code: 'ar' as const, label: 'AR' },
  ]

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close dropdown on outside tap
  useEffect(() => {
    if (!dropdownOpen) return
    const onClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('touchstart', onClickOutside)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('touchstart', onClickOutside)
    }
  }, [dropdownOpen])

  const handleSwitch = useCallback(
    (langCode: string) => {
      if (langCode === currentLocale) return
      if (switchingRef.current) return
      switchingRef.current = true
      const path = pathname && pathname.length > 0 ? pathname : '/'
      setDropdownOpen(false)
      onNavigate?.()
      router.replace(path, { locale: langCode })
      window.setTimeout(() => {
        switchingRef.current = false
      }, 600)
    },
    [currentLocale, pathname, router, onNavigate]
  )

  const currentLang = languages.find(l => l.code === currentLocale) ?? languages[0]

  // Mobile: dropdown to prevent accidental taps
  if (isMobile) {
    return (
      <div
        ref={dropdownRef}
        className="language-switcher"
        style={{ position: 'relative', display: 'inline-flex' }}
      >
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.25)',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.9)',
            textTransform: 'uppercase',
            padding: '10px 14px',
            minHeight: '44px',
            minWidth: '48px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            touchAction: 'manipulation',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
          aria-label={`Language: ${currentLang.label}`}
          aria-expanded={dropdownOpen}
        >
          {currentLang.label}
          <svg
            width="8"
            height="5"
            viewBox="0 0 8 5"
            fill="none"
            aria-hidden
            style={{
              transform: dropdownOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          >
            <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '6px',
              background: '#1a1714',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              minWidth: '60px',
              zIndex: 200,
              overflow: 'hidden',
            }}
          >
            {languages.map((lang) => {
              const isActive = currentLocale === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSwitch(lang.code)
                  }}
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'none',
                    border: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: isActive ? 'default' : 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.1em',
                    color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.55)',
                    textTransform: 'uppercase',
                    padding: '12px 20px',
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'manipulation',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    textAlign: 'center',
                    width: '100%',
                  }}
                  aria-label={`Language: ${lang.label}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {lang.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Desktop: inline buttons (unchanged behavior)
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
