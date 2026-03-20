'use client'

import { useEffect, useRef, useState } from 'react'

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(t)
  }, [])

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

      {/* Mirroring the SCROLL indicator — positioned bottom-left, vertical layout */}
      <div
        className="fixed bottom-20 left-8 z-50 flex flex-col items-center gap-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Track name — vertical text, same style as SCROLL label */}
        <p
          className="font-inter uppercase"
          style={{
            fontSize: '8px',
            letterSpacing: '0.35em',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: playing ? 'rgba(168,149,120,0.8)' : 'rgba(255,255,255,0.55)',
            transition: 'color 0.3s ease',
          }}
        >
          Бесік күйі
        </p>

        {/* Thin animated line */}
        <div className="w-px relative overflow-hidden" style={{ height: '48px' }}>
          <div
            className="absolute inset-0"
            style={{ background: playing ? 'rgba(168,149,120,0.35)' : 'rgba(255,255,255,0.2)' }}
          />
          {playing && (
            <div
              className="absolute left-0 w-full"
              style={{
                height: '40%',
                background: 'rgba(168,149,120,1)',
                animation: 'scanLine 1.8s ease-in-out infinite',
              }}
            />
          )}
        </div>

        {/* Square play/pause button */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
          className="group relative"
          style={{
            width: '36px',
            height: '36px',
            border: playing
              ? '1px solid rgba(168,149,120,0.8)'
              : '1px solid rgba(255,255,255,0.4)',
            background: playing ? 'rgba(168,149,120,0.12)' : 'rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.3s ease, background 0.3s ease',
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
          {playing ? (
            <div className="flex gap-[4px] items-center">
              <span style={{ display: 'block', width: '2px', height: '12px', background: '#a89578' }} />
              <span style={{ display: 'block', width: '2px', height: '12px', background: '#a89578' }} />
            </div>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M0 0L10 6L0 12V0Z" fill="rgba(255,255,255,0.85)" />
            </svg>
          )}

          {playing && (
            <span
              className="absolute inset-0"
              style={{
                border: '1px solid rgba(168,149,120,0.5)',
                animation: 'squarePulse 2.4s ease-out infinite',
              }}
            />
          )}
        </button>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: -40%; }
          100% { top: 140%; }
        }
        @keyframes squarePulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          60%  { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </>
  )
}
