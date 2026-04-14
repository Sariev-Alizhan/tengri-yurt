'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { useCart } from './CartContext'
import { getAudio, dispatchMusicState } from '@/lib/musicAudio'

export default function Navbar() {
  const pathname = usePathname()

  const noNavbarPages = ['/supplier/login', '/supplier/register']
  const hideNavbar = noNavbarPages.some(p => pathname?.includes(p) ?? false)
  if (hideNavbar) return null

  const isSupplierPortal = pathname?.includes('/supplier/') ?? false
  if (isSupplierPortal) return <SupplierNavbar />

  return <PublicNavbar />
}

function SupplierNavbar() {
  const pathname = usePathname()
  const t = useTranslations('supplier')

  const getSection = () => {
    if (pathname?.includes('/dashboard') && !pathname?.includes('/yurts') && !pathname?.includes('/orders') && !pathname?.includes('/settings') && !pathname?.includes('/accessories')) return t('dashboard')
    if (pathname?.includes('/yurts/new')) return t('addYurt')
    if (pathname?.includes('/yurts')) return t('yurts')
    if (pathname?.includes('/rentals')) return t('rentals')
    if (pathname?.includes('/orders')) return t('orders')
    if (pathname?.includes('/accessories')) return t('accessories')
    if (pathname?.includes('/profile') || pathname?.includes('/settings')) return t('profile')
    if (pathname?.includes('/login')) return t('signIn')
    if (pathname?.includes('/register')) return t('register')
    return t('portalTitle')
  }

  return (
    <header
      className="supplier-navbar supplier-navbar-root"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        minHeight: '56px',
        background: '#0f0d0a',
        borderBottom: '1px solid rgba(168,149,120,0.1)',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: 'calc(clamp(10px, 2vw, 14px) + env(safe-area-inset-top, 0px))',
        paddingBottom: 'clamp(10px, 2vw, 14px)',
        paddingLeft: 'max(clamp(16px, 4vw, 24px), env(safe-area-inset-left, 0px))',
        paddingRight: 'max(clamp(16px, 4vw, 24px), env(safe-area-inset-right, 0px))',
        gap: 'clamp(10px, 2vw, 16px)',
      }}
    >
      <Link
        href="/supplier/dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 1.5vw, 10px)',
          textDecoration: 'none',
          flexShrink: 0,
          minHeight: '44px',
          minWidth: '44px',
        }}
      >
        <Image
          src="/images/logo_white.png"
          alt="Tengri Yurt"
          width={120} height={40}
          style={{ height: 'clamp(32px, 6vw, 40px)', width: 'auto' }}
        />
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(12px, 2vw, 14px)',
              color: 'rgba(255,255,255,0.7)',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Tengri Yurt
          </p>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(9px, 1.2vw, 10px)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(168,149,120,0.4)',
              margin: 0,
            }}
          >
            {t('portalTitle')}
          </p>
        </div>
      </Link>

      <span
        className="supplier-nav-sep"
        style={{
          width: '1px',
          height: '20px',
          background: 'rgba(168,149,120,0.15)',
          flexShrink: 0,
          alignSelf: 'center',
        }}
      />

      <p
        className="supplier-nav-section"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(10px, 1.5vw, 11px)',
          letterSpacing: '0.1em',
          color: 'rgba(168,149,120,0.5)',
          margin: 0,
          flexShrink: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 'min(180px, 40vw)',
        }}
      >
        {getSection()}
      </p>

      <div style={{ flex: 1, minWidth: '8px' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <LanguageSwitcher />
      </div>

      <Link
        href="/catalog"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(9px, 1.3vw, 10px)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(168,149,120,0.45)',
          textDecoration: 'none',
          border: '1px solid rgba(168,149,120,0.15)',
          padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2.5vw, 14px)',
          minHeight: '44px',
          minWidth: '44px',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'rgba(168,149,120,0.8)'
          e.currentTarget.style.borderColor = 'rgba(168,149,120,0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(168,149,120,0.45)'
          e.currentTarget.style.borderColor = 'rgba(168,149,120,0.15)'
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="supplier-view-store-text">{t('viewStore')}</span>
      </Link>

      <Link
        href="/supplier/dashboard/settings"
        style={{
          width: '44px',
          height: '44px',
          minWidth: '44px',
          minHeight: '44px',
          borderRadius: '50%',
          background: 'rgba(168,149,120,0.12)',
          border: '1px solid rgba(168,149,120,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          color: 'rgba(168,149,120,0.6)',
          fontFamily: 'EB Garamond, serif',
          fontSize: '14px',
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(168,149,120,0.2)'
          e.currentTarget.style.color = 'rgba(168,149,120,0.9)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(168,149,120,0.12)'
          e.currentTarget.style.color = 'rgba(168,149,120,0.6)'
        }}
        aria-label={t('profile')}
      >
        ◉
      </Link>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 480px) {
          .supplier-nav-sep { display: none; }
          .supplier-nav-section { max-width: 120px; }
          .supplier-view-store-text { display: none; }
        }
      `}} />
    </header>
  )
}

function PublicNavbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const isCatalog = pathname?.includes('/catalog') ?? false
  const isBookNowFlow = (pathname?.match(/\/(cart|accessory\/)/)) != null
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const isOrderFlow = pathname?.includes('/order') || pathname?.includes('/cart') || pathname?.includes('/checkout') || pathname?.includes('/quiz') || pathname?.includes('/inquiry')

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      if (desktop) setMenuOpen(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    // Sync initial audio state
    const audio = getAudio()
    if (audio) setMusicPlaying(!audio.paused)
    // Listen for state changes from MusicPlayer
    const handler = (e: Event) => {
      setMusicPlaying((e as CustomEvent<{ playing: boolean }>).detail.playing)
    }
    window.addEventListener('music-state', handler)
    return () => window.removeEventListener('music-state', handler)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100,
        background: 'transparent',
        borderBottom: 'none',
        paddingTop: 'calc(clamp(8px, 2vw, 14px) + env(safe-area-inset-top, 0px))',
        paddingBottom: 'clamp(8px, 2vw, 14px)',
        paddingLeft: 'max(clamp(16px, 5vw, 48px), env(safe-area-inset-left, 0px))',
        paddingRight: 'max(clamp(16px, 5vw, 48px), env(safe-area-inset-right, 0px))',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center'
        }}>

          <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: isDesktop && !isOrderFlow ? 'flex' : 'none', alignItems: 'center', gap: '8px' }}>
              <LanguageSwitcher theme="dark" />
              <ThemeToggle />
            </div>
            {isDesktop && !isOrderFlow && (
              <Link
                href="/news"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  minHeight: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginLeft: '12px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
              >
                Press
              </Link>
            )}
            {isDesktop && !isOrderFlow && (
              <Link
                href="/about"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  minHeight: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginLeft: '12px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
              >
                About
              </Link>
            )}
            {isDesktop && !isOrderFlow && (
              <Link
                href="/hammam"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,168,110,0.6)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  minHeight: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginLeft: '12px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(201,168,110,1)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(201,168,110,0.6)' }}
              >
                Hammam
              </Link>
            )}
            {isDesktop && !isOrderFlow && (
              <Link
                href="/calculator"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,168,110,0.5)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  minHeight: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginLeft: '12px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(201,168,110,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(201,168,110,0.5)' }}
              >
                Calculator
              </Link>
            )}
            {isDesktop && !isOrderFlow && (
              <Link
                href="/contact"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  minHeight: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginLeft: '12px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
              >
                Contact
              </Link>
            )}
            {isDesktop && !isOrderFlow && (
              <Link
                href="/supplier/dashboard"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  minHeight: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderBottom: '1px solid transparent',
                  transition: 'color 0.2s, border-color 0.2s',
                  marginLeft: '12px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                  e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                  e.currentTarget.style.borderBottomColor = 'transparent'
                }}
              >
                Supplier Portal
              </Link>
            )}
            {isDesktop && !isOrderFlow && (
              <button
                type="button"
                onClick={() => {
                  const audio = getAudio()
                  if (!audio) return
                  if (audio.paused) {
                    audio.play().then(() => {
                      if ('mediaSession' in navigator) {
                        navigator.mediaSession.metadata = new MediaMetadata({
                          title: 'Адай — Күрмаңғазы',
                          artist: 'Traditional Kazakh Kuy',
                          album: 'Tengri Yurt Ambient',
                          artwork: [{ src: '/images/logo_white.png', sizes: '512x512', type: 'image/png' }],
                        })
                        navigator.mediaSession.setActionHandler('play',  () => { audio.play();  setMusicPlaying(true);  dispatchMusicState(true) })
                        navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); setMusicPlaying(false); dispatchMusicState(false) })
                      }
                      setMusicPlaying(true)
                      dispatchMusicState(true)
                    }).catch(() => {})
                  } else {
                    audio.pause()
                    setMusicPlaying(false)
                    dispatchMusicState(false)
                  }
                }}
                aria-label={musicPlaying ? 'Pause music' : 'Play music'}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 0',
                  minHeight: '40px',
                  marginLeft: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: musicPlaying ? 'rgba(168,149,120,0.9)' : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = musicPlaying ? 'rgba(168,149,120,1)' : 'rgba(255,255,255,0.75)' }}
                onMouseLeave={e => { e.currentTarget.style.color = musicPlaying ? 'rgba(168,149,120,0.9)' : 'rgba(255,255,255,0.4)' }}
              >
                {musicPlaying ? (
                  <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
                    {[0.35, 0.65, 0.5, 0.8, 0.45].map((h, i) => (
                      <span key={i} style={{
                        display: 'block', width: '2px', borderRadius: '1px',
                        background: 'rgba(168,149,120,0.9)',
                        height: `${Math.max(4, h * 12)}px`,
                        animation: `tkNavBar${i} ${0.7 + i * 0.12}s ease-in-out infinite alternate`,
                      }} />
                    ))}
                  </span>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 17H5a2 2 0 1 0 2 2V7l11-2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="16" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                )}
              </button>
            )}
          </div>

          <Link href="/">
            <Image
              src="/images/logo_white.png"
              alt="Tengri Yurt"
              width={160} height={56}
              style={{
                height: 'clamp(36px, 6vw, 56px)',
                width: 'auto',
                display: 'block',
              }}
            />
          </Link>

          <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              display: isDesktop && isBookNowFlow ? 'inline-block' : 'none',
              width: '1px',
              height: '14px',
              background: 'rgba(255,255,255,0.15)',
            }} />
            <Link
              href="/cart"
              style={{
                display: isBookNowFlow ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minWidth: '44px',
                minHeight: '44px',
                padding: '0 12px',
                border: '1px solid rgba(255,255,255,0.35)',
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              {t('cart')}
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'rgba(168,149,120,0.9)',
                color: '#0f0d0a',
                fontSize: '10px',
                fontWeight: 600,
                display: totalItems > 0 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
              }}>
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            </Link>
            <span style={{
              display: isDesktop ? 'inline-block' : 'none',
              width: '1px',
              height: '14px',
              background: 'rgba(255,255,255,0.15)',
            }} />
            {isDesktop && !isOrderFlow && (
              <Link
                href="/supplier/dashboard"
                aria-label="Supplier Portal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(201,168,110,0.25)',
                  color: 'rgba(201,168,110,0.55)',
                  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,110,0.6)'
                  e.currentTarget.style.color = 'rgba(201,168,110,1)'
                  e.currentTarget.style.background = 'rgba(201,168,110,0.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,110,0.25)'
                  e.currentTarget.style.color = 'rgba(201,168,110,0.55)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            )}
            {isDesktop && !isOrderFlow && (
              <a
                href="https://wa.me/77477777888"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact via WhatsApp"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(37,211,102,0.3)',
                  color: 'rgba(37,211,102,0.65)',
                  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(37,211,102,0.7)'
                  e.currentTarget.style.color = 'rgba(37,211,102,1)'
                  e.currentTarget.style.background = 'rgba(37,211,102,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)'
                  e.currentTarget.style.color = 'rgba(37,211,102,0.65)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            )}
            <Link
              href="/"
              style={{
                display: isDesktop && isCatalog ? 'inline-flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.6)',
                color: 'rgba(255,255,255,0.9)',
                padding: '10px 28px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {t('home')}
            </Link>
            <Link
              href="/catalog"
              style={{
                display: isDesktop && !isCatalog ? 'inline-flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.6)',
                color: 'rgba(255,255,255,0.9)',
                padding: '10px 28px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {t('bookNow')}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: isDesktop ? 'none' : 'flex',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 'clamp(10px, 2vw, 14px)',
                minWidth: '44px',
                minHeight: '44px',
                flexDirection: 'column',
                gap: '5px',
                alignItems: 'center',
                justifyContent: 'center',
                appearance: 'none',
                WebkitAppearance: 'none',
                touchAction: 'manipulation',
              }}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            >
              <span style={{
                display: 'block', width: '28px',
                height: '2px', background: 'rgba(255,255,255,0.9)',
                transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                transition: 'transform 0.3s ease'
              }} />
              <span style={{
                display: 'block', width: '20px',
                height: '2px', background: 'rgba(255,255,255,0.9)',
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }} />
              <span style={{
                display: 'block', width: '28px',
                height: '2px', background: 'rgba(255,255,255,0.9)',
                transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                transition: 'transform 0.3s ease'
              }} />
            </button>
          </div>

        </div>
      </nav>

      <div
        onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false) }}
        role="presentation"
        style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: '#0f0d0a',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-start',
          gap: 'clamp(20px, 5vw, 32px)',
          paddingTop: 'calc(clamp(56px, 14vw, 72px) + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(clamp(24px, 6vw, 40px) + env(safe-area-inset-bottom, 0px))',
          paddingLeft: 'max(20px, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(20px, env(safe-area-inset-right, 0px))',
          minHeight: '100dvh',
          maxHeight: '100dvh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}>
        <Link href="/cart"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            color: 'rgba(255,255,255,0.9)',
            textDecoration: 'none',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: isBookNowFlow ? 'inline-flex' : 'none',
            alignItems: 'center',
          }}
        >
          {t('cart')} {totalItems > 0 ? `(${totalItems})` : ''}
        </Link>
        <Link href="/catalog"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(26px, 6vw, 32px)',
            color: 'rgba(255,255,255,0.9)',
            textDecoration: 'none',
            fontWeight: 400,
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {t('bookNow')}
        </Link>
        <Link href="/"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
          {t('home')}
        </Link>

        <Link href="/about"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            color: 'rgba(255,255,255,0.55)',
            textDecoration: 'none',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
          About
        </Link>

        <Link href="/hammam"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            color: 'rgba(201,168,110,0.7)',
            textDecoration: 'none',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}>
          ◈ Hammam
        </Link>

        <Link href="/calculator"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            color: 'rgba(201,168,110,0.6)',
            textDecoration: 'none',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}>
          Calculator
        </Link>

        <Link href="/contact"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            color: 'rgba(255,255,255,0.55)',
            textDecoration: 'none',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
          Contact
        </Link>

        <Link href="/news"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            color: 'rgba(255,255,255,0.65)',
            textDecoration: 'none',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}>
          Press
        </Link>

        <Link href="/presentation"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            color: 'rgba(201,168,110,0.75)',
            textDecoration: 'none',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}>
          <span style={{ fontSize: '12px' }}>▶</span>
          Presentation
        </Link>

        <Link href="/supplier/dashboard"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            color: 'rgba(168,149,120,0.7)',
            textDecoration: 'none',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: 'clamp(12px, 3vw, 16px)',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}>
          <span style={{ fontSize: '14px' }}>◉</span>
          Supplier Portal
        </Link>

        {/* Music button */}
        {!isOrderFlow && (
          <button
            type="button"
            onClick={() => {
              const audio = getAudio()
              if (!audio) return
              if (audio.paused) {
                audio.play().then(() => {
                  setMusicPlaying(true)
                  dispatchMusicState(true)
                }).catch(() => {})
              } else {
                audio.pause()
                setMusicPlaying(false)
                dispatchMusicState(false)
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 'clamp(12px, 3vw, 16px)',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(11px, 2.5vw, 12px)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: musicPlaying ? 'rgba(168,149,120,0.9)' : 'rgba(255,255,255,0.45)',
              transition: 'color 0.2s',
            }}
            aria-label={musicPlaying ? 'Pause music' : 'Play music'}
          >
            {musicPlaying ? (
              /* Equalizer bars */
              <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                {[0.35, 0.65, 0.5, 0.8, 0.45].map((h, i) => (
                  <span key={i} style={{
                    display: 'block', width: '2px', borderRadius: '1px',
                    background: 'rgba(168,149,120,0.85)',
                    height: `${Math.max(5, h * 14)}px`,
                    animation: `tkNavBar${i} ${0.7 + i * 0.12}s ease-in-out infinite alternate`,
                  }} />
                ))}
              </span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 17H5a2 2 0 1 0 2 2V7l11-2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
            {musicPlaying ? 'Адай — Күрмаңғазы' : 'Music'}
          </button>
        )}

        <div
          style={{
            marginTop: 'clamp(20px, 5vw, 32px)',
            paddingTop: 'clamp(20px, 5vw, 28px)',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            width: '100%',
            maxWidth: 'min(100%, 360px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {!isOrderFlow && (
            <>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                {t('language')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LanguageSwitcher onNavigate={() => setMenuOpen(false)} theme="dark" />
                <ThemeToggle />
              </div>
            </>
          )}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes tkNavBar0 { from { height: 5px } to { height: 12px } }
          @keyframes tkNavBar1 { from { height: 9px } to { height: 5px } }
          @keyframes tkNavBar2 { from { height: 7px } to { height: 3px } }
          @keyframes tkNavBar3 { from { height: 11px } to { height: 7px } }
          @keyframes tkNavBar4 { from { height: 5px } to { height: 10px } }
        `}} />
      </div>
    </>
  )
}
