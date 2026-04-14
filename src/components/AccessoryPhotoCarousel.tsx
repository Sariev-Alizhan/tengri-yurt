'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface Props {
  photos: string[]
  name: string
}

export function AccessoryPhotoCarousel({ photos, name }: Props) {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const total = photos.length

  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null; touchStartY.current = null
  }

  if (total === 0) return <div className="absolute inset-0 bg-[#1a1714]" />

  return (
    <div className="absolute inset-0 group select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {photos.map((url, i) => (
        <div key={`photo-${i}`} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <Image src={url} alt={`${name} ${i + 1}`} fill className="object-cover"
            priority={i === 0} sizes="100vw" />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent)' }} />

      {total > 1 && (
        <>
          {/* Prev */}
          <button onClick={prev} aria-label="Previous"
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20
              w-8 h-8 flex items-center justify-center
              border border-white/20 text-white/60
              opacity-0 group-hover:opacity-100 transition-all duration-300
              hover:border-white/50 hover:text-white touch-manipulation">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Next */}
          <button onClick={next} aria-label="Next"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20
              w-8 h-8 flex items-center justify-center
              border border-white/20 text-white/60
              opacity-0 group-hover:opacity-100 transition-all duration-300
              hover:border-white/50 hover:text-white touch-manipulation">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter top-right */}
          <div className="absolute top-5 right-5 z-20 pointer-events-none">
            <span className="font-inter text-white/35 text-[9px] tracking-[0.25em]">
              {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

          {/* Progress line */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-white/10 pointer-events-none">
            <div className="h-full bg-white/40 transition-all duration-500"
              style={{ width: `${((current + 1) / total) * 100}%` }} />
          </div>
        </>
      )}
    </div>
  )
}
