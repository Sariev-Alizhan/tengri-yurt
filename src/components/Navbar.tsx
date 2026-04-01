'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
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
          style={{ height: 'clamp(24px, 5vw, 28px)', width: 'auto' }}
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
  // Корзина только в разделе Book Now: каталог, корзина, оформление заказа, страницы юрты/аксессуара
  const isBookNowFlow = (pathname?.match(/\/(catalog|cart|order|yurt\/|accessory\/)/)) != null
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isLanding = !pathname || pathname === '/'

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
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
        background: (!isLanding || scrolled) ? 'rgba(15, 13, 10, 0.92)' : 'transparent',
        backdropFilter: (!isLanding || scrolled) ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: (!isLanding || scrolled) ? 'blur(16px)' : 'none',
        boxShadow: (!isLanding || scrolled) ? '0 1px 0 rgba(168,149,120,0.08)' : 'none',
        borderBottom: 'none',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease',
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

          <div style={{ justifySelf: 'start' }}>
            <div style={{ display: isDesktop ? 'block' : 'none' }}>
              <LanguageSwitcher />
            </div>
          </div>

          <Link href="/">
            <img
              src="/images/logo_white.png"
              alt="Tengri Yurt"
              style={{
                height: 'clamp(36px, 6vw, 56px)',
                width: 'auto',
                display: 'block'
              }}
            />
          </Link>

          <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/supplier/login"
              style={{
                cursor: 'pointer',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)',
                display: isDesktop ? 'inline-flex' : 'none',
                alignItems: 'center',
                transition: 'color 0.2s ease',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}
            >
              SUPPLIER PORTAL
            </Link>
            <span style={{
              display: isDesktop && isBookNowFlow ? 'inline-block' : 'none',
              width: '1px',
              height: '14px',
              background: 'rgba(255,255,255,0.15)',
            }} />
            {isBookNowFlow && (
              <Link
                href="/cart"
                style={{
                  display: 'flex',
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
                {totalItems > 0 && (
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}>
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            )}
            <span style={{
              display: isDesktop ? 'inline-block' : 'none',
              width: '1px',
              height: '14px',
              background: 'rgba(255,255,255,0.15)',
            }} />
            {isCatalog ? (
              <Link
                href="/"
                style={{
                  display: isDesktop ? 'inline-flex' : 'none',
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
                }}
              >
                {t('home')}
              </Link>
            ) : (
              <Link
                href="/catalog"
                style={{
                  display: isDesktop ? 'inline-flex' : 'none',
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
                }}
              >
                {t('bookNow')}
              </Link>
            )}
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
                display: 'block', width: '24px',
                height: '1px', background: 'rgba(255,255,255,0.9)',
                transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
                transition: 'transform 0.3s ease'
              }} />
              <span style={{
                display: 'block', width: '16px',
                height: '1px', background: 'rgba(255,255,255,0.9)',
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }} />
              <span style={{
                display: 'block', width: '24px',
                height: '1px', background: 'rgba(255,255,255,0.9)',
                transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
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
          background: '#a89578',
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
        {isBookNowFlow && (
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
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {t('cart')} {totalItems > 0 ? `(${totalItems})` : ''}
          </Link>
        )}
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
        <Link href="/supplier/login"
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
          SUPPLIER PORTAL
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
          <LanguageSwitcher onNavigate={() => setMenuOpen(false)} />
        </div>
      </div>
    </>
  )
}
