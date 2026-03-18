'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface Props {
  photos: string[]
  name: string
}

export function YurtPhotoCarousel({ photos, name }: Props) {
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
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  if (total === 0) return <div className="absolute inset-0 bg-[#1a1714]" />

  return (
    <div className="flex flex-col h-full">
      {/* ── HERO SLIDER ── */}
      <div
        className="relative flex-1 select-none overflow-hidden group"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {photos.map((url, i) => (
          <div
            key={url}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <Image
              src={url}
              alt={`${name} ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.12) 45%, transparent)' }}
        />

        {/* Arrow buttons */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20
                w-10 h-10 sm:w-11 sm:h-11 rounded-full
                bg-black/30 hover:bg-black/55 backdrop-blur-sm border border-white/20
                flex items-center justify-center text-white
                opacity-0 group-hover:opacity-100 focus:opacity-100
                transition-all duration-200 touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20
                w-10 h-10 sm:w-11 sm:h-11 rounded-full
                bg-black/30 hover:bg-black/55 backdrop-blur-sm border border-white/20
                flex items-center justify-center text-white
                opacity-0 group-hover:opacity-100 focus:opacity-100
                transition-all duration-200 touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter badge */}
        {total > 1 && (
          <div className="absolute bottom-4 right-4 z-20 bg-black/40 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1">
            <span className="font-inter text-white text-xs tracking-wider">
              {current + 1} / {total}
            </span>
          </div>
        )}

        {/* Dot indicators */}
        {total > 1 && total <= 8 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 items-center">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Photo ${i + 1}`}
                className={`rounded-full transition-all duration-300 touch-manipulation ${
                  i === current
                    ? 'w-5 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── THUMBNAIL STRIP ── */}
      {total > 1 && (
        <div className="shrink-0 px-3 sm:px-5 py-3 flex gap-2 overflow-x-auto bg-transparent">
          {photos.map((url, i) => (
            <button
              key={url}
              onClick={() => setCurrent(i)}
              aria-label={`Photo ${i + 1}`}
              className={`relative shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden
                border-2 transition-all duration-200 touch-manipulation
                ${i === current
                  ? 'border-white opacity-100 scale-105'
                  : 'border-transparent opacity-50 hover:opacity-80'
                }`}
            >
              <Image
                src={url}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
