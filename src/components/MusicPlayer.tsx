'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from '@/i18n/navigation'

let _audio: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!_audio) {
    _audio = new Audio('/audio/kuy-aday-kurmangazy.mp3')
    _audio.loop = true
    _audio.preload = 'none'
  }
  return _audio
}

export function MusicPlayer() {
  const [playing, setPlaying]   = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const pathname    = usePathname()
  const isSupplierPage = pathname?.includes('/supplier/')
  const foundationRef  = useRef<HTMLDivElement>(null)
  const labelTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Sync --music-foundation-height (desktop only)
  useEffect(() => {
    if (isSupplierPage || isMobile) {
      document.documentElement.style.removeProperty('--music-foundation-height')
      return
    }
    const el = foundationRef.current
    if (!el) return
    const sync = () => {
      const h = Math.ceil(el.getBoundingClientRect().height)
      if (h > 0) document.documentElement.style.setProperty('--music-foundation-height', `${h}px`)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener('resize', sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
      document.documentElement.style.removeProperty('--music-foundation-height')
    }
  }, [isSupplierPage, isMobile])

  useEffect(() => {
    const audio = getAudio()
    if (!audio) return
    setPlaying(!audio.paused)
  }, [])

  useEffect(() => {
    if (isSupplierPage) { getAudio()?.pause(); setPlaying(false) }
  }, [isSupplierPage])

  if (isSupplierPage) return null

  const toggle = () => {
    const audio = getAudio()
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => {
        setPlaying(true)
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Адай — Күрмаңғазы',
            artist: 'Traditional Kazakh Kuy',
            album: 'Tengri Yurt Ambient',
            artwork: [{ src: '/images/logo_white.png', sizes: '512x512', type: 'image/png' }],
          })
          navigator.mediaSession.setActionHandler('play',  () => { audio.play();  setPlaying(true)  })
          navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); setPlaying(false) })
        }
      }).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  const handleMobileTap = () => {
    toggle()
    // Show track label briefly after tap
    setShowLabel(true)
    if (labelTimer.current) clearTimeout(labelTimer.current)
    labelTimer.current = setTimeout(() => setShowLabel(false), 2400)
  }

  // ── Mobile: small floating button ─────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Track label tooltip */}
        <div style={{
          position: 'fixed',
          left: '16px',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)',
          zIndex: 15,
          background: 'rgba(12,10,8,0.92)',
          border: '1px solid rgba(168,149,120,0.3)',
          borderRadius: '20px',
          padding: '5px 12px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          pointerEvents: 'none',
          transition: 'opacity 0.3s, transform 0.3s',
          opacity: showLabel ? 1 : 0,
          transform: showLabel ? 'translateY(0)' : 'translateY(6px)',
        }}>
          <span style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.85)',
            whiteSpace: 'nowrap',
          }}>
            Адай — Күрмаңғазы
          </span>
        </div>

        {/* Floating button */}
        <button
          type="button"
          onClick={handleMobileTap}
          aria-label={playing ? 'Pause music' : 'Play music'}
          style={{
            position: 'fixed',
            left: '16px',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
            zIndex: 15,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: `1.5px solid ${playing ? 'rgba(168,149,120,0.85)' : 'rgba(168,149,120,0.35)'}`,
            background: playing
              ? 'rgba(168,149,120,0.14)'
              : 'rgba(12,10,8,0.82)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: playing
              ? '0 0 16px rgba(168,149,120,0.2), 0 2px 8px rgba(0,0,0,0.4)'
              : '0 2px 8px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
          }}
        >
          {playing ? (
            /* Animated equalizer bars */
            <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
              {[0.35, 0.65, 0.5, 0.8, 0.45].map((h, i) => (
                <span key={i} style={{
                  display: 'block',
                  width: '2px',
                  borderRadius: '1px',
                  background: 'rgba(168,149,120,0.9)',
                  height: `${Math.max(6, h * 16)}px`,
                  animation: `tkBar${i} ${0.7 + i * 0.12}s ease-in-out infinite alternate`,
                }} />
              ))}
            </span>
          ) : (
            /* Music note icon */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 17H5a2 2 0 1 0 2 2V7l11-2v10" stroke="rgba(168,149,120,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="17" r="2" stroke="rgba(168,149,120,0.8)" strokeWidth="1.5"/>
            </svg>
          )}
        </button>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes tkBar0 { from { height: 6px } to { height: 14px } }
          @keyframes tkBar1 { from { height: 10px } to { height: 6px } }
          @keyframes tkBar2 { from { height: 8px } to { height: 4px } }
          @keyframes tkBar3 { from { height: 13px } to { height: 8px } }
          @keyframes tkBar4 { from { height: 6px } to { height: 12px } }
        `}} />
      </>
    )
  }

  // ── Desktop: full bar ─────────────────────────────────────────────────────
  return (
    <div
      ref={foundationRef}
      className="music-foundation"
      style={{
        position: 'fixed',
        left: 0, right: 0, bottom: 0,
        zIndex: 15,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'linear-gradient(180deg, #0c0a08 0%, #0f0d0a 40%, #12100e 100%)',
        borderTop: '1px solid rgba(168,149,120,0.35)',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.35)',
      }}
    >
      <div aria-hidden style={{
        width: '100%', height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(168,149,120,0.45) 50%, transparent 100%)',
        marginTop: '-1px',
      }} />

      <div
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-3.5"
        style={{ minHeight: '56px' }}
      >
        {/* Play button + equalizer */}
        <div className="flex flex-shrink-0 items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause music' : 'Play music'}
            className="group flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition-all md:h-12 md:w-12"
            style={{
              borderColor: playing ? 'rgba(168,149,120,0.9)' : 'rgba(168,149,120,0.45)',
              background:   playing ? 'rgba(168,149,120,0.12)' : 'rgba(168,149,120,0.06)',
              boxShadow:    playing ? '0 0 20px rgba(168,149,120,0.15)' : 'none',
            }}
          >
            {playing ? (
              <span className="flex items-center gap-0.5">
                <span className="block h-3 w-0.5 rounded-sm bg-[#a89578]" />
                <span className="block h-3 w-0.5 rounded-sm bg-[#a89578]" />
              </span>
            ) : (
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" className="ml-0.5">
                <path d="M0 0L16 9L0 18V0Z" fill="rgba(255,255,255,0.85)" />
              </svg>
            )}
          </button>

          <div className="hidden h-8 w-px bg-[rgba(168,149,120,0.25)] sm:block" aria-hidden />

          {/* Equalizer */}
          <div className="flex h-8 items-end gap-0.5">
            {[0.35, 0.65, 0.5, 0.8, 0.45].map((h, i) => (
              <span key={i} className="w-0.5 rounded-full bg-[#a89578]/60 transition-all" style={{
                height: playing ? `${Math.max(12, h * 28)}px` : '6px',
                opacity: playing ? 0.9 : 0.35,
                animation: playing ? `tkBar${i} ${0.7 + i * 0.12}s ease-in-out infinite alternate` : 'none',
              }} />
            ))}
          </div>
        </div>

        {/* Track name */}
        <div className="min-w-0 flex-1 text-center px-1 sm:px-2">
          <p className="font-garamond text-base leading-tight text-white/90 sm:text-lg md:text-xl">
            Адай — Күрмаңғазы
          </p>
          <p className="font-garamond italic mt-0.5 hidden text-[10px] tracking-[0.15em] text-[#a89578]/70 sm:block sm:text-[11px]">
            Traditional Kazakh Kuy
          </p>
        </div>

        {/* Brand */}
        <div className="hidden flex-shrink-0 flex-col items-end text-right sm:flex">
          <span className="font-inter text-[8px] uppercase tracking-[0.25em] text-white/35">Tengri Yurt</span>
          <span className="font-inter mt-0.5 text-[9px] uppercase tracking-[0.15em] text-[#a89578]/50">Ambient</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tkBar0 { from { height: 8px } to { height: 22px } }
        @keyframes tkBar1 { from { height: 14px } to { height: 10px } }
        @keyframes tkBar2 { from { height: 12px } to { height: 6px } }
        @keyframes tkBar3 { from { height: 20px } to { height: 12px } }
        @keyframes tkBar4 { from { height: 10px } to { height: 18px } }
      `}} />
    </div>
  )
}
