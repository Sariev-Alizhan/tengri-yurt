import type React from 'react'
import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { ActionLink } from './ActionLink'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('supplier')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div style={{ maxWidth: '480px' }}>
        <header style={{ marginBottom: '40px' }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--sp-text-3)',
            marginBottom: '10px',
          }}>
            {t('portalBreadcrumb')}
          </p>
          <h1 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(28px, 5vw, 44px)',
            color: 'var(--sp-text-1)',
            fontWeight: 400,
            margin: 0,
          }}>
            {t('welcomeBack')}
          </h1>
        </header>
        <div style={{
          padding: '40px 32px',
          textAlign: 'center',
          border: '1px solid var(--sp-border)',
          background: 'var(--sp-surface)',
          borderRadius: '12px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            color: 'var(--sp-text-2)',
            marginBottom: '24px',
            lineHeight: 1.6,
          }}>
            {t('signInToAccessDashboard')}
          </p>
          <Link
            href="/supplier/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'var(--sp-gold)',
              color: '#0a0806',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '6px',
              transition: 'opacity 0.15s',
            }}
          >
            {t('signIn')}
          </Link>
        </div>
      </div>
    )
  }

  const { data: supplier } = await supabase
    .from('suppliers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!supplier) redirect(`/${locale}/supplier/register`)

  const supplierId = (supplier as { id: string }).id

  const { data: yurts } = await supabase
    .from('yurts')
    .select('id, name, price_usd, is_available')
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentOrdersRaw } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, quantity, created_at,
      buyer_name, delivery_country,
      yurt:yurts(name)
    `)
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false })
    .limit(8)

  type YurtRel = { name: string } | { name: string }[] | null
  type RecentOrder = {
    id: string
    order_number: string
    status: string
    quantity: number
    created_at: string
    buyer_name: string
    delivery_country: string
    yurt: { name: string } | null
  }
  const recentOrders: RecentOrder[] = (recentOrdersRaw ?? []).map((o: Record<string, unknown> & { yurt?: YurtRel }) => ({
    ...o,
    yurt: Array.isArray(o.yurt) ? (o.yurt[0] ?? null) : (o.yurt ?? null),
  })) as RecentOrder[]

  const supplierName = (supplier as { company_name: string }).company_name || user.email || 'Supplier'

  const totalYurtsResult = await supabase
    .from('yurts')
    .select('id', { count: 'exact', head: true })
    .eq('supplier_id', supplierId)
  const totalOrdersResult = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('supplier_id', supplierId)
  const totalYurts = totalYurtsResult.count ?? 0
  const totalOrders = totalOrdersResult.count ?? 0
  const pendingOrders = recentOrders.filter(o => o.status === 'pending').length

  const statusLabels: Record<string, string> = {
    pending: t('statusPending'),
    confirmed: t('statusConfirmed'),
    in_production: t('statusInProduction'),
    ready: t('statusReady'),
    shipped: t('statusShipped'),
    delivered: t('statusDelivered'),
    cancelled: t('statusCancelled'),
  }

  const firstName = supplierName.split(' ')[0] || supplierName

  return (
    <div style={{ maxWidth: '960px' }}>

      {/* ─── Header ─── */}
      <header style={{ marginBottom: '40px' }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--sp-text-3)',
          marginBottom: '8px',
        }}>
          {t('portalBreadcrumb')}
        </p>
        <h1 style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: 'clamp(26px, 4vw, 40px)',
          color: 'var(--sp-text-1)',
          fontWeight: 400,
          margin: 0,
        }}>
          {t('welcomeBack')}{firstName ? `, ${firstName}` : ''}
        </h1>
      </header>

      {/* ─── Pending approval banner ─── */}
      {!(supplier as { is_approved?: boolean }).is_approved && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          marginBottom: '28px',
          background: 'rgba(255,180,60,0.07)',
          border: '1px solid rgba(255,180,60,0.2)',
          borderRadius: '10px',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 5.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" fill="rgba(255,180,60,0.85)"/>
          </svg>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,180,60,0.85)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            {t('pendingApproval')}
          </p>
        </div>
      )}

      {/* ─── Stat cards ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '40px',
      }}
      className="sp-stat-grid"
      >
        <StatCard
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L1.5 7v9h5v-5h5v5h5V7L9 1Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" fill="none"/>
            </svg>
          }
          value={totalYurts}
          label={t('activeYurts')}
        />
        <StatCard
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.25" fill="none"/>
              <path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
          }
          value={totalOrders}
          label={t('totalOrdersLabel')}
        />
        <StatCard
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.25" fill="none"/>
              <path d="M9 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          value={pendingOrders}
          label={t('pendingLabel')}
          highlight={pendingOrders > 0}
        />
      </div>

      {/* ─── Recent orders ─── */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h2 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--sp-text-3)',
            margin: 0,
          }}>
            {t('recentOrders')}
          </h2>
          <Link href="/supplier/dashboard/orders" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--sp-gold)',
            textDecoration: 'none',
            opacity: 0.8,
          }}>
            {t('viewAll')}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="supplier-orders-desktop" style={{
              border: '1px solid var(--sp-border)',
              borderRadius: '10px',
              overflow: 'hidden',
              background: 'var(--sp-surface)',
            }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
                gap: '16px',
                padding: '10px 16px',
                borderBottom: '1px solid var(--sp-border)',
              }}>
                {['Order', 'Product', 'Status', 'Date', 'Qty'].map(h => (
                  <p key={h} style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--sp-text-3)',
                    margin: 0,
                  }}>{h}</p>
                ))}
              </div>
              {recentOrders.map((order, i) => (
                <div key={`d-${order.id}`} className="sp-order-row" style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
                  gap: '16px',
                  padding: '13px 16px',
                  borderBottom: i < recentOrders.length - 1 ? '1px solid var(--sp-border)' : 'none',
                  alignItems: 'center',
                }}>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--sp-text-1)', fontWeight: 510, marginBottom: '2px', margin: '0 0 2px' }}>
                      #{order.order_number}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)', margin: 0 }}>
                      {order.buyer_name}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-2)', margin: '0 0 2px' }}>
                      {order.yurt?.name ?? '—'}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)', margin: 0 }}>
                      {order.delivery_country}
                    </p>
                  </div>
                  <StatusBadge label={statusLabels[order.status] || order.status} status={order.status} />
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)', margin: 0 }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-2)', margin: 0, fontWeight: 510 }}>
                    {order.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="supplier-orders-mobile" style={{ display: 'none', flexDirection: 'column', gap: '8px' }}>
              {recentOrders.map((order) => (
                <Link key={`m-${order.id}`} href="/supplier/dashboard/orders" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{
                    padding: '14px 16px',
                    background: 'var(--sp-surface)',
                    border: '1px solid var(--sp-border)',
                    borderRadius: '10px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: 'var(--sp-text-1)', margin: 0 }}>
                        #{order.order_number}
                      </p>
                      <StatusBadge label={statusLabels[order.status] || order.status} status={order.status} />
                    </div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-gold)', margin: '0 0 3px', opacity: 0.8 }}>
                      {order.buyer_name}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-2)', margin: '0 0 4px' }}>
                      {order.yurt?.name ?? '—'}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)', margin: 0 }}>
                      {order.delivery_country} · {t('qty')} {order.quantity} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            border: '1px solid var(--sp-border)',
            borderRadius: '10px',
            background: 'var(--sp-surface)',
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.2 }}>
              <rect x="4" y="6" width="24" height="20" rx="3" stroke="var(--sp-gold)" strokeWidth="1.5" fill="none"/>
              <path d="M10 12h12M10 17h8" stroke="var(--sp-gold)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '18px', color: 'var(--sp-text-3)', margin: 0 }}>
              {t('noOrdersYet')}
            </p>
          </div>
        )}
      </section>

      {/* ─── Quick actions ─── */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--sp-text-3)',
          marginBottom: '12px',
          marginTop: 0,
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
          gap: '10px',
        }}>
          <ActionLink href="/supplier/dashboard/yurts/new" icon="+" label={t('addNewYurt')} />
          <ActionLink href="/supplier/dashboard/orders" icon="◎" label={t('viewAllOrders')} />
          <ActionLink href="/supplier/dashboard/settings" icon="◉" label={t('editProfile')} />
        </div>
      </section>

      {/* ─── Getting started guide ─── */}
      <section style={{
        padding: '24px 28px',
        background: 'var(--sp-surface)',
        border: '1px solid var(--sp-border)',
        borderRadius: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="var(--sp-gold)" strokeWidth="1.25" fill="none" opacity="0.6"/>
            <path d="M8 5v3.5l2 2" stroke="var(--sp-gold)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          </svg>
          <h2 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--sp-text-3)',
            margin: 0,
          }}>
            {t('helperTitle')}
          </h2>
        </div>
        <ul style={{
          margin: 0,
          paddingLeft: '0',
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {[t('helperTip1'), t('helperTip2'), t('helperTip3')].map((tip, i) => (
            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{
                flexShrink: 0,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'rgba(201,168,110,0.1)',
                border: '1px solid rgba(201,168,110,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--sp-gold)',
                marginTop: '1px',
              }}>
                {i + 1}
              </span>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'var(--sp-text-2)',
                margin: 0,
              }}>
                {tip}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Responsive fixes */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sp-order-row:hover { background: var(--sp-surface-2) !important; }
        @media (max-width: 767px) {
          .sp-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .supplier-orders-desktop { display: none !important; }
          .supplier-orders-mobile { display: flex !important; }
        }
      `}} />

    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  highlight = false,
}: {
  icon: React.ReactNode
  value: number
  label: string
  highlight?: boolean
}) {
  return (
    <div style={{
      padding: 'clamp(16px, 3vw, 24px)',
      background: 'var(--sp-surface)',
      border: `1px solid ${highlight ? 'rgba(255,180,60,0.25)' : 'var(--sp-border)'}`,
      borderRadius: '12px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {highlight && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, rgba(255,180,60,0.6), rgba(255,180,60,0))',
        }} />
      )}
      <div style={{
        color: highlight ? 'rgba(255,180,60,0.7)' : 'var(--sp-gold)',
        opacity: highlight ? 1 : 0.5,
        marginBottom: '14px',
        display: 'flex',
      }}>
        {icon}
      </div>
      <p style={{
        fontFamily: 'EB Garamond, serif',
        fontSize: 'clamp(32px, 5vw, 44px)',
        fontWeight: 400,
        color: highlight ? 'rgba(255,180,60,0.95)' : 'var(--sp-text-1)',
        lineHeight: 1,
        margin: '0 0 6px',
      }}>
        {value}
      </p>
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--sp-text-3)',
        margin: 0,
      }}>
        {label}
      </p>
    </div>
  )
}

function StatusBadge({ label, status }: { label: string; status?: string }) {
  return (
    <span className={`sp-badge ${status ? `sp-badge-${status}` : ''}`}>
      {label}
    </span>
  )
}
