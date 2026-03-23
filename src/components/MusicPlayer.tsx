'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Module-level singleton — survives page navigations, never recreated
let _audio: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!_audio) {
    _audio = new Audio('/audio/besik-kui.mp3')
    _audio.loop = true
    _audio.preload = 'none'
  }
  return _audio
}

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const pathname = usePathname()

  const isSupplierPage = pathname?.includes('/supplier/')

  useEffect(() => {
    const audio = getAudio()
    if (!audio) return
    setPlaying(!audio.paused)
  }, [])

  useEffect(() => {
    if (isSupplierPage) {
      getAudio()?.pause()
      setPlaying(false)
    }
  }, [isSupplierPage])

  if (isSupplierPage) return null

  const toggle = () => {
    const audio = getAudio()
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  // z-index 20: ниже модалок (z-50), оверлеев и корзины — не перекрывает TOTAL / кнопки
  const dockStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    pointerEvents: 'none',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    paddingLeft: 'max(12px, env(safe-area-inset-left))',
    paddingRight: 'max(12px, env(safe-area-inset-right))',
    paddingTop: '10px',
    background: 'linear-gradient(to top, rgba(15,13,10,0.78) 0%, rgba(15,13,10,0.35) 55%, transparent 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    minHeight: '52px',
  }

  const btnStyle: React.CSSProperties = {
    pointerEvents: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 14px 0 10px',
    height: '34px',
    marginBottom: '8px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(20,16,12,0.85)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
    boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
  }

  return (
    <div style={dockStyle}>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
        style={btnStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
          e.currentTarget.style.background = 'rgba(28,24,18,0.95)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          e.currentTarget.style.background = 'rgba(20,16,12,0.85)'
        }}
      >
        <span style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {playing ? (
            <span style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              <span style={{ display: 'block', width: '2px', height: '8px', background: 'rgba(255,255,255,0.9)', borderRadius: '1px' }} />
              <span style={{ display: 'block', width: '2px', height: '8px', background: 'rgba(255,255,255,0.9)', borderRadius: '1px' }} />
            </span>
          ) : (
            <svg width="7" height="8" viewBox="0 0 7 8" fill="none" style={{ marginLeft: '1px' }}>
              <path d="M0 0L7 4L0 8V0Z" fill="rgba(255,255,255,0.85)" />
            </svg>
          )}
        </span>

        <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px', flexShrink: 0 }}>
          {[1, 0.6, 0.9, 0.5].map((h, i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '2px',
                borderRadius: '1px',
                background: playing ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)',
                height: playing ? `${h * 14}px` : '4px',
                animation: playing ? `tkBar${i} ${0.8 + i * 0.15}s ease-in-out infinite alternate` : 'none',
                transition: 'height 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </span>

        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '9px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.65)',
          whiteSpace: 'nowrap',
        }}>
          Бесік күйі
        </span>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes tkBar0 { from { height: 4px } to { height: 14px } }
          @keyframes tkBar1 { from { height: 8px } to { height: 5px } }
          @keyframes tkBar2 { from { height: 12px } to { height: 6px } }
          @keyframes tkBar3 { from { height: 5px } to { height: 12px } }
        `}} />
      </button>
    </div>
  )
}
