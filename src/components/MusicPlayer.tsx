'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const isSupplierPage = pathname?.includes('/supplier/')

  useEffect(() => {
    if (isSupplierPage) return
    const t = setTimeout(() => setMounted(true), 1800)
    return () => clearTimeout(t)
  }, [isSupplierPage])

  useEffect(() => {
    if (isSupplierPage) {
      audioRef.current?.pause()
      setPlaying(false)
    }
  }, [isSupplierPage])

  if (isSupplierPage) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/besik-kui.mp3" loop preload="none" />

      <div
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '32px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          willChange: 'opacity, transform',
        }}
      >
        {/* Track name — vertical */}
        <p
          className="font-inter uppercase"
          style={{
            fontSize: '8px',
            letterSpacing: '0.35em',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: playing ? 'rgba(168,149,120,0.85)' : 'rgba(255,255,255,0.55)',
            transition: 'color 0.3s ease',
            margin: 0,
          }}
        >
          Бесік күйі
        </p>

        {/* Animated line */}
        <div
          style={{
            width: '1px',
            height: '48px',
            position: 'relative',
            overflow: 'hidden',
            background: playing ? 'rgba(168,149,120,0.3)' : 'rgba(255,255,255,0.2)',
          }}
        >
          {playing && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: '100%',
                height: '40%',
                background: '#a89578',
                animation: 'tkScanLine 1.8s linear infinite',
              }}
            />
          )}
        </div>

        {/* Square button — overflow:hidden to contain any effects */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
          style={{
            width: '36px',
            height: '36px',
            flexShrink: 0,
            border: playing ? '1px solid rgba(168,149,120,0.8)' : '1px solid rgba(255,255,255,0.4)',
            background: playing ? 'rgba(168,149,120,0.12)' : 'rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.3s ease, background 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            if (!playing) {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            }
          }}
          onMouseLeave={e => {
            if (!playing) {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            }
          }}
        >
          {/* Shimmer effect inside button when playing */}
          {playing && (
            <span
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(168,149,120,0.15) 50%, transparent 100%)',
                animation: 'tkShimmer 2s linear infinite',
              }}
            />
          )}

          {playing ? (
            <span style={{ display: 'flex', gap: '4px', alignItems: 'center', position: 'relative' }}>
              <span style={{ display: 'block', width: '2px', height: '12px', background: '#a89578' }} />
              <span style={{ display: 'block', width: '2px', height: '12px', background: '#a89578' }} />
            </span>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" style={{ position: 'relative' }}>
              <path d="M0 0L10 6L0 12V0Z" fill="rgba(255,255,255,0.85)" />
            </svg>
          )}
        </button>
      </div>

      <style>{`
        @keyframes tkScanLine {
          0%   { top: -40%; }
          100% { top: 140%; }
        }
        @keyframes tkShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  )
}
