'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'

const STORAGE_KEY = 'tengri-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const accepted = localStorage.getItem(STORAGE_KEY)
      if (!accepted) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed left-0 right-0 z-40 px-4 py-4 md:py-3 flex flex-wrap items-center justify-center gap-4 bg-[#0f0d0a]/98 border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] transition-[bottom] duration-200 ease-out"
      style={{
        bottom: 0,
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
      role="dialog"
      aria-live="polite"
    >
      <p className="font-inter text-white/80 text-sm text-center md:text-left max-w-2xl">
        We use cookies to improve your experience and for analytics. By continuing you agree to our use of cookies.{' '}
        <Link href="/" className="text-amber-400/90 hover:text-amber-300 underline underline-offset-2">
          Learn more
        </Link>
      </p>
      <button
        type="button"
        onClick={accept}
        className="flex-shrink-0 border border-white/50 text-white px-5 py-2 font-inter text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
      >
        Accept
      </button>
    </div>
  )
}
