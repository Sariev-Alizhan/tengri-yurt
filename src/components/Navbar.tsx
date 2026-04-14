'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { useCart } from './CartContext'

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
        <img
          src="/images/logo_white.png"
          alt="Tengri Yurt"
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
          </div>

          <Link href="/">
            <img
              src="/images/logo_white.png"
              alt="Tengri Yurt"
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
      </div>
    </>
  )
}
