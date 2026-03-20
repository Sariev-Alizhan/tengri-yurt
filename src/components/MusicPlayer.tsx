'use client'

import { useEffect, useRef, useState } from 'react'

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show the button after a short delay so it doesn't pop in immediately
    const t = setTimeout(() => setVisible(true), 1500)
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

      <button
        onClick={toggle}
        title={playing ? 'Pause music' : 'Play ambient music'}
        aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
        className={`
          fixed bottom-6 left-6 z-50
          w-11 h-11 rounded-full
          bg-[#1a1714]/80 backdrop-blur-md
          border border-white/15 hover:border-white/30
          flex items-center justify-center
          shadow-lg hover:shadow-xl
          transition-all duration-500
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          hover:scale-105 active:scale-95
          group
        `}
      >
        {/* Animated sound waves when playing */}
        {playing && (
          <span className="absolute inset-0 rounded-full border border-[#a89578]/40 animate-ping" />
        )}

        {playing ? (
          /* Pause icon */
          <svg className="w-4 h-4 text-[#a89578]" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          /* Sound / music icon */
          <svg className="w-4 h-4 text-white/70 group-hover:text-[#a89578] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
        )}
      </button>

      {/* Tooltip label */}
      <div className={`
        fixed bottom-[4.5rem] left-6 z-50
        bg-[#1a1714]/90 backdrop-blur-md
        border border-white/10 rounded-lg
        px-3 py-1.5
        pointer-events-none select-none
        transition-all duration-300
        ${playing
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-1'
        }
      `}>
        <p className="font-inter text-white/70 text-[10px] uppercase tracking-widest whitespace-nowrap">
          Бесік күйі
        </p>
        <div className="flex items-end gap-[3px] mt-1 h-3">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-[#a89578]"
              style={{
                height: playing ? `${[60, 100, 80, 50][i - 1]}%` : '30%',
                transition: 'height 0.3s ease',
                animation: playing ? `soundBar${i} 0.8s ease-in-out infinite alternate` : 'none',
                animationDelay: `${(i - 1) * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes soundBar1 { from { height: 30% } to { height: 90% } }
        @keyframes soundBar2 { from { height: 60% } to { height: 100% } }
        @keyframes soundBar3 { from { height: 40% } to { height: 80% } }
        @keyframes soundBar4 { from { height: 20% } to { height: 60% } }
      `}</style>
    </>
  )
}
