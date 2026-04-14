'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

const LANGUAGES = [
  { code: 'en' as const, label: 'English',   short: 'EN' },
  { code: 'ru' as const, label: 'Русский',   short: 'RU' },
  { code: 'kk' as const, label: 'Қазақша',   short: 'KZ' },
  { code: 'zh' as const, label: '中文',       short: 'CN' },
  { code: 'ar' as const, label: 'العربية',   short: 'AR' },
]

function GlobeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="8" cy="8" rx="2.8" ry="6.5" stroke="currentColor" strokeWidth="1.1" />
      <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="currentColor" strokeWidth="1.1" />
      <line x1="2.5" y1="5" x2="13.5" y2="5" stroke="currentColor" strokeWidth="1.1" />
      <line x1="2.5" y1="11" x2="13.5" y2="11" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

type Theme = 'light' | 'dark'

export function LanguageSwitcher({
  onNavigate,
  theme = 'dark',
}: {
  onNavigate?: () => void
  theme?: Theme
}) {
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale()
  const switchingRef = useRef(false)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const handleSwitch = useCallback(
    (langCode: string) => {
      if (langCode === currentLocale || switchingRef.current) return
      switchingRef.current = true
      const path = pathname && pathname.length > 0 ? pathname : '/'
      setOpen(false)
      onNavigate?.()
      router.replace(path, { locale: langCode })
      setTimeout(() => { switchingRef.current = false }, 600)
    },
    [currentLocale, pathname, router, onNavigate]
  )

  const current = LANGUAGES.find(l => l.code === currentLocale) ?? LANGUAGES[0]

  // Colors based on theme
  const btnColor      = theme === 'light' ? 'rgba(28,18,10,0.75)' : 'rgba(255,255,255,0.75)'
  const btnBorder     = theme === 'light' ? 'rgba(120,88,56,0.25)' : 'rgba(255,255,255,0.2)'
  const dropBg        = theme === 'light' ? '#f4e9d8' : '#1c1510'
  const dropBorder    = theme === 'light' ? 'rgba(120,88,56,0.15)' : 'rgba(255,255,255,0.1)'
  const itemActive    = theme === 'light' ? 'rgba(120,88,56,0.12)' : 'rgba(255,255,255,0.08)'
  const itemColorAct  = theme === 'light' ? 'rgba(28,18,10,0.95)'  : 'rgba(255,255,255,1)'
  const itemColorInact= theme === 'light' ? 'rgba(28,18,10,0.55)'  : 'rgba(255,255,255,0.5)'
  const itemHoverBg   = theme === 'light' ? 'rgba(120,88,56,0.08)' : 'rgba(255,255,255,0.06)'

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={`Language: ${current.label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: `1px solid ${btnBorder}`,
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: btnColor,
          padding: '8px 12px',
          minHeight: '40px',
          minWidth: '44px',
          transition: 'border-color 0.2s, color 0.2s',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          touchAction: 'manipulation',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = theme === 'light' ? 'rgba(120,88,56,0.5)' : 'rgba(255,255,255,0.4)'
          e.currentTarget.style.color = theme === 'light' ? 'rgba(28,18,10,0.95)' : 'rgba(255,255,255,0.95)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = btnBorder
          e.currentTarget.style.color = btnColor
        }}
      >
        <GlobeIcon size={14} />
        <span>{current.short}</span>
        <svg
          width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
        >
          <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          role="listbox"
          aria-label="Language"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: dropBg,
            border: `1px solid ${dropBorder}`,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            zIndex: 300,
            minWidth: '148px',
            animation: 'langDropIn 0.15s ease',
          }}
        >
          {LANGUAGES.map(lang => {
            const isActive = currentLocale === lang.code
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isActive}
                type="button"
                onClick={() => handleSwitch(lang.code)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '11px 16px',
                  background: isActive ? itemActive : 'none',
                  border: 'none',
                  cursor: isActive ? 'default' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? itemColorAct : itemColorInact,
                  letterSpacing: '0.02em',
                  minHeight: '44px',
                  touchAction: 'manipulation',
                  transition: 'background 0.15s, color 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = itemHoverBg }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none' }}
              >
                <span>{lang.label}</span>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: isActive ? itemColorAct : (theme === 'light' ? 'rgba(120,88,56,0.4)' : 'rgba(255,255,255,0.25)'),
                }}>
                  {lang.short}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes langDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}} />
    </div>
  )
}
