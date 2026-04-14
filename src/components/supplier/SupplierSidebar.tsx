'use client'

import { useState, useEffect } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/utils/supabase/client'

/* ─── SVG Icons ──────────────────────────────────────────────────── */
const icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  yurts: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14 7V14H2V7L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M6 14V10H10V14" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  add: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  accessories: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1L9.8 5.8L15 6.2L11.2 9.6L12.4 14.8L8 12L3.6 14.8L4.8 9.6L1 6.2L6.2 5.8L8 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  orders: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1.5" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 5.5H11M5 8H11M5 10.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  rentals: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 3V1.5M11 3V1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M1.5 7H14.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.2 3.2L4.2 4.2M11.8 11.8L12.8 12.8M12.8 3.2L11.8 4.2M4.2 11.8L3.2 12.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  collapse: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  expand: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M6 2H3C2.4 2 2 2.4 2 3V12C2 12.6 2.4 13 3 13H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M10 10L13 7.5L10 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 7.5H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  store: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 11L11 2M11 2H6M11 2V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const sp = {
  bg:        'var(--sp-bg)',
  sidebar:   'var(--sp-sidebar)',
  surface:   'var(--sp-surface)',
  surface2:  'var(--sp-surface-2)',
  surface3:  'var(--sp-surface-3)',
  gold:      'var(--sp-gold)',
  goldBr:    'var(--sp-gold-bright)',
  t1:        'var(--sp-text-1)',
  t2:        'var(--sp-text-2)',
  t3:        'var(--sp-text-3)',
  border:    'var(--sp-border)',
  border2:   'var(--sp-border-2)',
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'SU'
}

export function SupplierSidebar({ supplierName, isLoggedIn = true }: { supplierName: string; isLoggedIn?: boolean }) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const pathname = usePathname()
  const t = useTranslations('supplier')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed)
  }, [collapsed])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = `/${locale}/supplier/login`
  }

  const navGroups = [
    {
      label: 'Overview',
      items: [
        { href: '/supplier/dashboard', icon: icons.dashboard, label: t('dashboard') },
      ],
    },
    {
      label: 'Catalogue',
      items: [
        { href: '/supplier/dashboard/yurts',         icon: icons.yurts,       label: t('yurts') },
        { href: '/supplier/dashboard/yurts/new',     icon: icons.add,         label: t('addYurt') },
        { href: '/supplier/dashboard/accessories',   icon: icons.accessories, label: t('accessories') },
      ],
    },
    {
      label: 'Sales',
      items: [
        { href: '/supplier/dashboard/orders',  icon: icons.orders,  label: t('orders') },
        { href: '/supplier/dashboard/rentals', icon: icons.rentals, label: t('rentals') },
      ],
    },
    {
      label: 'Account',
      items: [
        { href: '/supplier/dashboard/settings', icon: icons.settings, label: t('profile') },
      ],
    },
  ]

  const mobileItems = [
    { href: '/supplier/dashboard',               icon: icons.dashboard, label: t('dashboard') },
    { href: '/supplier/dashboard/yurts',         icon: icons.yurts,     label: t('yurts') },
    { href: '/supplier/dashboard/orders',        icon: icons.orders,    label: t('orders') },
    { href: '/supplier/dashboard/rentals',       icon: icons.rentals,   label: t('rentals') },
    { href: '/supplier/dashboard/settings',      icon: icons.settings,  label: t('profile') },
  ]

  const isActive = (href: string) =>
    pathname === href ||
    (href !== '/supplier/dashboard' && pathname?.startsWith(href))

  return (
    <>
      {/* ── Mobile bottom nav ───────────────────────────────── */}
      <nav
        className="mobile-nav"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(10,8,6,0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: `1px solid ${sp.border}`,
          display: 'none',
          justifyContent: 'space-around',
          alignItems: 'stretch',
          padding: `8px 4px max(12px, env(safe-area-inset-bottom))`,
        }}
      >
        {mobileItems.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '5px',
                padding: '8px 4px', minHeight: '52px', flex: '1 1 0',
                maxWidth: '72px', textDecoration: 'none',
                color: active ? sp.goldBr : sp.t3,
                borderRadius: '10px',
                background: active ? `rgba(201,168,110,0.1)` : 'transparent',
                transition: 'color 0.15s, background 0.15s',
              }}
            >
              <span style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </span>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '10px',
                fontWeight: active ? 600 : 400, letterSpacing: '0.04em',
                textTransform: 'uppercase', lineHeight: 1,
              }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside
        className="desktop-sidebar"
        style={{
          width: collapsed ? '60px' : '220px',
          minHeight: 'calc(100vh - 56px)',
          background: sp.sidebar,
          borderRight: `1px solid ${sp.border}`,
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1)',
          flexShrink: 0,
          position: 'fixed', top: '56px', left: 0,
          height: 'calc(100vh - 56px)',
          overflowY: 'auto', overflowX: 'hidden',
        }}
      >
        {/* User card */}
        {!collapsed && isLoggedIn && (
          <div style={{
            margin: '12px 12px 4px',
            padding: '12px',
            background: sp.surface,
            border: `1px solid ${sp.border}`,
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: `linear-gradient(135deg, var(--sp-gold) 0%, var(--sp-surface-3) 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700,
              color: '#0a0806', letterSpacing: '0.05em',
            }}>
              {getInitials(supplierName)}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500,
                color: sp.t1, overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', margin: 0, lineHeight: 1.3,
              }}>
                {supplierName}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 400,
                color: sp.t3, margin: 0, letterSpacing: '0.05em', marginTop: '2px',
              }}>
                Supplier
              </p>
            </div>
          </div>
        )}
        {collapsed && isLoggedIn && (
          <div style={{
            margin: '12px auto 4px',
            width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
            background: `linear-gradient(135deg, var(--sp-gold) 0%, var(--sp-surface-3) 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700,
            color: '#0a0806',
          }}>
            {getInitials(supplierName)}
          </div>
        )}

        {/* Nav groups */}
        <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto' }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: '4px' }}>
              {!collapsed && (
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: sp.t3, padding: '10px 8px 4px',
                  margin: 0,
                }}>
                  {group.label}
                </p>
              )}
              {group.items.map(item => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: collapsed ? '0' : '9px',
                      padding: collapsed ? '10px 0' : '8px 10px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      borderRadius: '8px',
                      marginBottom: '2px',
                      textDecoration: 'none',
                      background: active ? 'rgba(201,168,110,0.1)' : 'transparent',
                      color: active ? sp.goldBr : sp.t3,
                      transition: 'background 0.12s, color 0.12s',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(201,168,110,0.06)'
                        e.currentTarget.style.color = sp.t2
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = sp.t3
                      }
                    }}
                  >
                    {/* Active indicator bar */}
                    {active && !collapsed && (
                      <span style={{
                        position: 'absolute', left: 0, top: '20%', bottom: '20%',
                        width: '2px', borderRadius: '1px',
                        background: sp.gold,
                      }} />
                    )}
                    <span style={{
                      width: '16px', height: '16px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginLeft: active && !collapsed ? '6px' : '0',
                    }}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '13px',
                        fontWeight: active ? 500 : 400,
                        letterSpacing: '-0.01em',
                        lineHeight: 1,
                      }}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div style={{
          padding: '8px',
          borderTop: `1px solid ${sp.border}`,
          display: 'flex', flexDirection: 'column', gap: '4px',
          flexShrink: 0,
        }}>
          {/* View store */}
          {!collapsed && (
            <Link
              href="/catalog"
              target="_blank"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '7px',
                textDecoration: 'none', color: sp.t3,
                fontFamily: 'Inter, sans-serif', fontSize: '12px',
                transition: 'background 0.12s, color 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,110,0.06)'; e.currentTarget.style.color = sp.t2 }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = sp.t3 }}
            >
              {icons.store}
              <span>View Store</span>
            </Link>
          )}

          {/* Collapse / Expand */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '8px',
              padding: collapsed ? '10px 0' : '8px 10px',
              borderRadius: '7px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: sp.t3, width: '100%',
              fontFamily: 'Inter, sans-serif', fontSize: '12px',
              transition: 'background 0.12s, color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,110,0.06)'; e.currentTarget.style.color = sp.t2 }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = sp.t3 }}
          >
            {collapsed ? icons.expand : icons.collapse}
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '8px',
              padding: collapsed ? '10px 0' : '8px 10px',
              borderRadius: '7px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(239,68,68,0.5)', width: '100%',
              fontFamily: 'Inter, sans-serif', fontSize: '12px',
              transition: 'background 0.12s, color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'rgba(239,68,68,0.8)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(239,68,68,0.5)' }}
          >
            {icons.logout}
            {!collapsed && <span>{t('signOut')}</span>}
          </button>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-nav     { display: flex !important; }
          .desktop-sidebar{ display: none !important; }
        }
        @media (min-width: 768px) {
          .mobile-nav     { display: none  !important; }
          .desktop-sidebar{ display: flex  !important; }
        }
      `}</style>
    </>
  )
}
