'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams, usePathname } from 'next/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'

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
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const pathname = usePathname()
  const t = useTranslations('supplier')

  const getSection = () => {
    if (pathname?.includes('/dashboard') && !pathname?.includes('/yurts') && !pathname?.includes('/orders') && !pathname?.includes('/settings') && !pathname?.includes('/accessories')) return t('dashboard')
    if (pathname?.includes('/yurts/new')) return t('addYurt')
    if (pathname?.includes('/yurts')) return t('yurts')
    if (pathname?.includes('/orders')) return t('orders')
    if (pathname?.includes('/accessories')) return t('accessories')
    if (pathname?.includes('/profile') || pathname?.includes('/settings')) return t('profile')
    if (pathname?.includes('/login')) return t('signIn')
    if (pathname?.includes('/register')) return t('register')
    return t('portalTitle')
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      height: '60px',
      background: '#0f0d0a',
      borderBottom: '1px solid rgba(168,149,120,0.1)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: '16px',
    }}>

      <a href={`/${locale}/supplier/dashboard`} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        flexShrink: 0,
      }}>
        <img src="/images/logo.png" alt="Tengri Yurt"
          style={{ height: '28px', width: 'auto' }} />
        <div>
          <p style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)',
            margin: 0,
            lineHeight: 1.1,
          }}>
            Tengri Yurt
          </p>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(168,149,120,0.4)',
            margin: 0,
          }}>
            {t('portalTitle')}
          </p>
        </div>
      </a>

      <span style={{
        width: '1px', height: '20px',
        background: 'rgba(168,149,120,0.15)',
        flexShrink: 0,
      }} />

      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        letterSpacing: '0.1em',
        color: 'rgba(168,149,120,0.5)',
        margin: 0,
        flexShrink: 0,
      }}>
        {getSection()}
      </p>

      <div style={{ flex: 1 }} />

      <LanguageSwitcher />

      <a
        href={`/${locale}/catalog`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(168,149,120,0.45)',
          textDecoration: 'none',
          border: '1px solid rgba(168,149,120,0.15)',
          padding: '6px 14px',
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
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        {t('viewStore')}
      </a>

      <a
        href={`/${locale}/supplier/dashboard/settings`}
        style={{
          width: '32px',
          height: '32px',
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
      >
        ◉
      </a>

    </header>
  )
}

function PublicNavbar() {
  const t = useTranslations('nav')
  const params = useParams()
  const pathname = usePathname()
  const locale = (params?.locale as string) || 'en'
  const isCatalog = pathname?.includes('/catalog') ?? false
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 1280
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

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100,
        background: 'transparent',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        boxShadow: 'none',
        borderBottom: 'none',
        padding: 'clamp(12px, 3vw, 20px) clamp(16px, 5vw, 48px)'
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

          <a href={`/${locale}`}>
            <img
              src="/images/logo.png"
              alt="Tengri Yurt"
              style={{
                height: 'clamp(48px, 8vw, 80px)',
                width: 'auto',
                display: 'block'
              }}
            />
          </a>

          <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href={`/${locale}/supplier/login`}
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
              display: isDesktop ? 'inline-block' : 'none',
              width: '1px',
              height: '14px',
              background: 'rgba(255,255,255,0.15)',
            }} />
            {isCatalog ? (
              <a
                href={`/${locale}`}
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
              </a>
            ) : (
              <a
                href={`/${locale}/catalog`}
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
              </a>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: isDesktop ? 'none' : 'flex',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                flexDirection: 'column',
                gap: '5px',
                alignItems: 'flex-end',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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

      <div style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: '#a89578',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '40px',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'all' : 'none',
        transition: 'opacity 0.3s ease'
      }}>
        <LanguageSwitcher />
        <a href={`/${locale}/catalog`}
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: '32px', color: 'rgba(255,255,255,0.9)',
            textDecoration: 'none', fontWeight: 400
          }}>
          {t('bookNow')}
        </a>
        <Link href={`/${locale}/supplier/login`}
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px', color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none', letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
          SUPPLIER PORTAL
        </Link>
        <a href={`/${locale}`}
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px', color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none', letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
          {t('home')}
        </a>
      </div>
    </>
  )
}
