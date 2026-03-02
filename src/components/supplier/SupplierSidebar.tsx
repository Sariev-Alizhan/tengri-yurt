'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/utils/supabase/client'

export function SupplierSidebar({ supplierName, isLoggedIn = true }: { supplierName: string; isLoggedIn?: boolean }) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const pathname = usePathname()
  const t = useTranslations('supplier')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed')
    } else {
      document.body.classList.remove('sidebar-collapsed')
    }
  }, [collapsed])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = `/${locale}/supplier/login`
  }

  const navItems = [
    { href: `/${locale}/supplier/dashboard`, icon: '◈', label: t('dashboard') },
    { href: `/${locale}/supplier/dashboard/yurts`, icon: '⌂', label: t('yurts') },
    { href: `/${locale}/supplier/dashboard/yurts/new`, icon: '+', label: t('addYurt') },
    { href: `/${locale}/supplier/dashboard/accessories`, icon: '◇', label: t('accessories') },
    { href: `/${locale}/supplier/dashboard/orders`, icon: '◎', label: t('orders') },
    { href: `/${locale}/supplier/dashboard/settings`, icon: '◉', label: t('profile') },
  ]

  return (
    <>
      {/* Mobile bottom nav — min 44px touch targets */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#0f0d0a',
        borderTop: '1px solid rgba(168,149,120,0.1)',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        padding: 'clamp(8px, 2vw, 12px) clamp(4px, 1vw, 8px)',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}
      className="mobile-nav"
      >
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: 'clamp(10px, 2vw, 12px)',
                minHeight: '52px',
                minWidth: '44px',
                flex: '1 1 0',
                maxWidth: '100px',
                textDecoration: 'none',
                color: isActive ? 'rgba(168,149,120,0.9)' : 'rgba(255,255,255,0.35)',
                touchAction: 'manipulation',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 'clamp(16px, 4vw, 18px)' }}>{item.icon}</span>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(9px, 2vw, 10px)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop sidebar */}
      <aside style={{
        width: collapsed ? '64px' : '240px',
        minHeight: 'calc(100vh - 60px)',
        background: '#0f0d0a',
        borderRight: '1px solid rgba(168,149,120,0.12)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        flexShrink: 0,
        position: 'fixed',
        top: '60px',
        left: 0,
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
      }}
      className="desktop-sidebar"
      >

      {!collapsed && (
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(168,149,120,0.08)',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px',
            color: 'rgba(168,149,120,0.4)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}>
            {isLoggedIn ? t('loggedInAs') : ''}
          </p>
          {isLoggedIn ? (
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {supplierName}
            </p>
          ) : (
            <Link
              href={`/${locale}/supplier/login`}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: 'rgba(168,149,120,0.8)',
                textDecoration: 'underline',
              }}
            >
              {t('signIn')}
            </Link>
          )}
        </div>
      )}

      <nav style={{ flex: 1, padding: '16px 0' }}>
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '12px 20px' : '12px 20px',
                textDecoration: 'none',
                background: isActive ? 'rgba(168,149,120,0.12)' : 'transparent',
                borderLeft: isActive ? '2px solid rgba(168,149,120,0.6)' : '2px solid transparent',
                color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
              }}
            >
              <span style={{
                fontFamily: 'monospace',
                fontSize: '16px',
                width: '20px',
                textAlign: 'center',
                flexShrink: 0,
              }}>
                {item.icon}
              </span>
              {!collapsed && (
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: isActive ? 500 : 300,
                  letterSpacing: '0.05em',
                }}>
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(168,149,120,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: '1px solid rgba(168,149,120,0.2)',
            color: 'rgba(168,149,120,0.5)',
            padding: '8px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '12px',
            transition: 'all 0.2s',
            width: '100%',
          }}
        >
          {collapsed ? '→' : `← ${t('collapse')}`}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid rgba(255,100,100,0.15)',
            color: 'rgba(255,100,100,0.4)',
            padding: '8px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            width: '100%',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(255,100,100,0.8)'
            e.currentTarget.style.borderColor = 'rgba(255,100,100,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,100,100,0.4)'
            e.currentTarget.style.borderColor = 'rgba(255,100,100,0.15)'
          }}
        >
          {collapsed ? '✕' : t('signOut')}
        </button>
      </div>
    </aside>

    <style jsx>{`
      @media (max-width: 767px) {
        .mobile-nav {
          display: flex !important;
        }
        .desktop-sidebar {
          display: none !important;
        }
      }
      @media (min-width: 768px) {
        .mobile-nav {
          display: none !important;
        }
        .desktop-sidebar {
          display: flex !important;
        }
      }
    `}</style>
    </>
  )
}
