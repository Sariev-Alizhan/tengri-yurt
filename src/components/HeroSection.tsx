'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Props = {
  heroTitle: string
  since: string
  heroSubtitle: string
  statement: string
}

export function HeroSection({ heroTitle, since, heroSubtitle, statement }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const height = rect.height
      const scrolled = -rect.top
      const progress = Math.min(1, Math.max(0, scrolled / height))
      setScrollProgress(progress)
      if (bgRef.current) {
        const move = scrolled * 0.4
        bgRef.current.style.transform = `translate3d(0, ${move * 0.5}px, 0)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const contentOpacity = 1 - scrollProgress * 1.2
  const contentTranslate = scrollProgress * -40

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Top line — animate width on load */}
      <div
        className="absolute top-0 left-0 z-20 h-px bg-white/15"
        style={{
          width: '0%',
          animation: 'lineExpand 1.5s ease forwards',
        }}
      />
      {/* Bottom line */}
      <div
        className="absolute bottom-0 left-0 z-20 h-px bg-white/15"
        style={{ width: '100%' }}
      />

      <div ref={bgRef} className="absolute inset-0 z-0 transition-transform duration-100 will-change-transform">
        <Image
          src="/images/background.jpg"
          alt=""
          fill
          className="object-cover scale-105"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(168, 149, 120, 0.6)' }} />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${contentTranslate}px)`,
          transition: 'opacity 0.1s ease, transform 0.1s ease',
        }}
      >
        <h1
          className="hero-title font-garamond text-white font-normal mb-6"
          style={{ 
            fontSize: 'clamp(40px, 8vw, 72px)',
            letterSpacing: '0.02em',
            lineHeight: 1.1,
          }}
        >
          {heroTitle}
        </h1>
        <p
          className="hero-since font-inter text-white/80 uppercase font-medium mb-6"
          style={{ 
            fontSize: 'clamp(10px, 1.2vw, 12px)', 
            letterSpacing: 'clamp(0.2em, 2vw, 0.3em)',
          }}
        >
          {since}
        </p>
        <p
          className="hero-subtitle font-inter text-white/90 uppercase font-light mb-16 md:mb-24"
          style={{ 
            fontSize: 'clamp(11px, 1.5vw, 13px)', 
            letterSpacing: 'clamp(0.15em, 2vw, 0.25em)',
          }}
        >
          {heroSubtitle}
        </p>
        <p
          className="hero-quote font-inter text-white/85 uppercase max-w-4xl mx-auto"
          style={{ 
            fontSize: 'clamp(12px, 2vw, 15px)',
            letterSpacing: 'clamp(0.12em, 1.5vw, 0.18em)',
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          {statement}
        </p>
        <div className="hero-arrows mt-16 md:mt-20 flex justify-center">
          <span className="text-white/60" style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>↓</span>
        </div>
      </div>

      {/* Scroll indicator — right edge */}
      <div
        className="absolute right-8 bottom-20 z-10 flex flex-col items-center gap-3"
        style={{ right: '32px', bottom: '80px' }}
      >
        <p
          className="font-inter text-[8px] uppercase text-white/30"
          style={{ letterSpacing: '0.35em', writingMode: 'vertical-rl' }}
        >
          Scroll
        </p>
        <div className="w-px h-[60px] bg-white/15 relative overflow-hidden">
          <div
            className="absolute -top-full left-0 w-full h-full bg-white/60"
            style={{ animation: 'scrollLine 2s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  )
}
