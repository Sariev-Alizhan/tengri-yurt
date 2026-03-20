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

  // Sync playing state with the actual audio element on mount
  useEffect(() => {
    const audio = getAudio()
    if (!audio) return
    setPlaying(!audio.paused)
  }, [])

  // Pause on supplier pages
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

  return (
    <>
      <div className="tk-player" style={{
        position: 'fixed',
        bottom: '80px',
        left: '32px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>

        {/* Track name — always white, same brightness playing or not */}
        <p className="font-inter uppercase" style={{
          fontSize: '8px',
          letterSpacing: '0.35em',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: 'rgba(255,255,255,0.7)',
          margin: 0,
        }}>
          Бесік күйі
        </p>

        {/* Line — always same brightness */}
        <div style={{
          width: '1px',
          height: '48px',
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.25)',
        }}>
          {playing && (
            <div style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: '40%',
              background: 'rgba(255,255,255,0.9)',
              animation: 'tkScanLine 1.8s linear infinite',
            }} />
          )}
        </div>

        <button
          onClick={toggle}
          aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
          style={{
            width: '36px',
            height: '36px',
            flexShrink: 0,
            border: playing ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.4)',
            background: playing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.3s ease, background 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = playing ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'
            e.currentTarget.style.background = playing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'
          }}
        >
          {playing ? (
            <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ display: 'block', width: '2px', height: '12px', background: 'rgba(255,255,255,0.9)' }} />
              <span style={{ display: 'block', width: '2px', height: '12px', background: 'rgba(255,255,255,0.9)' }} />
            </span>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M0 0L10 6L0 12V0Z" fill="rgba(255,255,255,0.85)" />
            </svg>
          )}
        </button>
      </div>

    </>
  )
}
