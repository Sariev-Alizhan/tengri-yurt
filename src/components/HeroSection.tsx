'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type Props = {
  heroTitle: string
  since: string
  heroSubtitle: string
  statement: string
}

export function HeroSection({ heroTitle, since, heroSubtitle, statement }: Props) {
  const tNav = useTranslations('nav')
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height))
      setScrollProgress(progress)
      // Parallax only on desktop
      if (bgRef.current && window.innerWidth >= 768) {
        bgRef.current.style.transform = `translate3d(0, ${-rect.top * 0.2}px, 0)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const contentOpacity = Math.max(0, 1 - scrollProgress * 1.5)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: '100dvh', minHeight: '600px' }}
    >
      {/* Background image */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
        <Image
          src="/images/hero_bg.jpeg"
          alt="Kazakh yurt in the steppe"
          fill
          className="object-cover"
          style={{ transform: 'scale(1.08)' }}
          priority
          sizes="100vw"
        />
        {/* Overlays — cinematic, not flat */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(180deg, rgba(15,10,5,0.3) 0%, rgba(15,10,5,0.05) 35%, rgba(15,10,5,0.5) 75%, rgba(15,10,5,0.75) 100%),
            linear-gradient(90deg, rgba(15,10,5,0.4) 0%, transparent 50%)
          `
        }} />
      </div>

      {/* Thin gold line — top */}
      <div className="absolute top-0 left-0 right-0 z-20 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(168,149,120,0.3), transparent)',
        width: loaded ? '100%' : '0%',
        transition: 'width 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
      }} />

      {/* Content — bottom-aligned, editorial */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 md:px-16 lg:px-24"
        style={{
          opacity: contentOpacity,
          transition: 'opacity 0.05s linear',
          paddingBottom: '8vh',
        }}
      >
        {/* Title */}
        <h1
          className="font-garamond"
          style={{
            fontSize: 'clamp(52px, 12vw, 120px)',
            fontWeight: 300,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '20px',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          {heroTitle}
        </h1>

        {/* Since — below title, high contrast */}
        <p
          className="mb-5"
          style={{
            fontSize: '13px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,1)',
            textShadow: '0 1px 8px rgba(0,0,0,0.6)',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
          }}
        >
          {since}
        </p>

        {/* Thin gold divider */}
        <div
          className="my-6 md:my-8 mx-auto"
          style={{
            width: loaded ? 'clamp(60px, 10vw, 120px)' : '0px',
            height: '1px',
            background: 'rgba(168,149,120,0.5)',
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1s',
          }}
        />

        {/* Subtitle */}
        <p
          className="font-garamond italic max-w-md"
          style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 300,
            textShadow: '0 1px 12px rgba(0,0,0,0.5)',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.2s',
          }}
        >
          {heroSubtitle}
        </p>

        {/* Statement quote */}
        {statement && (
          <p
            style={{
              marginTop: 'clamp(16px, 2.5vw, 24px)',
              fontSize: 'clamp(11px, 1.4vw, 13px)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(168,149,120,0.7)',
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.4s',
            }}
          >
            {statement}
          </p>
        )}

        {/* CTA Button */}
        <Link
          href="/catalog"
          className="btn-book"
          style={{
            marginTop: 'clamp(24px, 4vw, 36px)',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.5s, background 0.3s ease, border-color 0.3s ease',
          }}
        >
          {tNav('bookNow')}
        </Link>
      </div>

      {/* Scroll indicator — minimal */}
      <div
        className="absolute z-10 flex flex-col items-center gap-3"
        style={{
          bottom: 'clamp(24px, 5vh, 48px)',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: loaded ? 0.4 : 0,
          transition: 'opacity 1s ease 2s',
        }}
      >
        <div className="w-px h-10 bg-white/20 relative overflow-hidden">
          <div
            className="absolute -top-full left-0 w-full h-full bg-white/50"
            style={{ animation: 'scrollLine 2.5s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  )
}
