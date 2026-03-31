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
      <>
        <header style={{ marginBottom: '40px' }}>
          <p className="sp-breadcrumb" style={{ marginBottom: '8px' }}>
            {t('portalBreadcrumb')}
          </p>
          <h1 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: 'rgba(255,255,255,0.88)',
            fontWeight: 400,
            margin: 0,
          }}>
            {t('welcomeBack')}
          </h1>
        </header>
        <div style={{
          padding: '48px 32px',
          textAlign: 'center',
          border: '1px solid rgba(168,149,120,0.2)',
          background: 'rgba(168,149,120,0.06)',
          borderRadius: '8px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '24px',
          }}>
            {t('signInToAccessDashboard')}
          </p>
          <Link
            href="/supplier/login"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              border: '1px solid rgba(168,149,120,0.6)',
              color: 'rgba(255,255,255,0.95)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            {t('signIn')}
          </Link>
        </div>
      </>
    )
  }

  const { data: supplier } = await supabase
    .from('suppliers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Пользователь есть, но запись поставщика не создана — ведём на регистрацию поставщика, а не на логин
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

  return (
    <>
        <header style={{ marginBottom: '40px' }}>
          <p className="sp-breadcrumb" style={{ marginBottom: '8px' }}>
            {t('portalBreadcrumb')}
          </p>
          <h1 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: 'rgba(255,255,255,0.88)',
            fontWeight: 400,
            margin: 0,
          }}>
            {t('welcomeBack')}
          </h1>
        </header>

        {!(supplier as { is_approved?: boolean }).is_approved && (
          <div style={{
            padding: '16px 20px',
            marginBottom: '24px',
            background: 'rgba(255,180,80,0.08)',
            border: '1px solid rgba(255,180,80,0.25)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.85)',
          }}>
            {t('pendingApproval')}
          </div>
        )}

        <div
          className="supplier-stat-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
            gap: '12px',
            marginBottom: '48px',
          }}
        >
          {[
            { label: t('activeYurts'), value: totalYurts, icon: '⌂' },
            { label: t('totalOrdersLabel'), value: totalOrders, icon: '◎' },
            { label: t('pendingLabel'), value: pendingOrders, icon: '◐', highlight: pendingOrders > 0 },
          ].map(stat => (
            <div
              key={stat.label}
              className="supplier-stat-card"
              style={{
                background: 'rgba(26,21,16,0.9)',
                padding: 'clamp(20px, 3vw, 28px)',
                border: '1px solid rgba(168,149,120,0.08)',
                borderRadius: '16px',
              }}
            >
              <p style={{
                fontFamily: 'monospace',
                fontSize: '20px',
                color: stat.highlight ? 'rgba(255,180,80,0.85)' : 'rgba(168,149,120,0.6)',
                marginBottom: '10px',
              }}>
                {stat.icon}
              </p>
              <p style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 'clamp(28px, 5vw, 48px)',
                color: stat.highlight ? 'rgba(255,180,80,0.95)' : 'rgba(255,255,255,0.9)',
                fontWeight: 500,
                lineHeight: 1,
                marginBottom: '8px',
              }}>
                {stat.value}
              </p>
              <p className="sp-label" style={{ fontWeight: 500 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(20px, 3vw, 28px)',
              color: 'rgba(255,255,255,0.75)',
              fontWeight: 400,
              margin: 0,
            }}>
              {t('recentOrders')}
            </h2>
            <Link href="/supplier/dashboard/orders" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: 'rgba(168,149,120,0.7)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(168,149,120,0.3)',
            }}>
              {t('viewAll')}
            </Link>
          </div>

          {recentOrders && recentOrders.length > 0 ? (
            <>
              <div className="supplier-orders-desktop" style={{ border: '1px solid rgba(168,149,120,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                {recentOrders.map((order, i) => (
                  <div key={`d-${order.id}`} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr auto auto',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: i < recentOrders.length - 1 ? '1px solid rgba(168,149,120,0.06)' : 'none',
                    alignItems: 'center',
                  }}>
                    <div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginBottom: '3px' }}>#{order.order_number}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(168,149,120,0.65)' }}>{order.buyer_name}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{order.yurt?.name ?? '—'}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(168,149,120,0.55)' }}>{order.delivery_country} · {t('qty')} {order.quantity}</p>
                    </div>
                    <StatusBadge label={statusLabels[order.status] || order.status} status={order.status} />
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(168,149,120,0.6)', whiteSpace: 'nowrap' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
              <div className="supplier-orders-mobile" style={{ display: 'none' }}>
                {recentOrders.map((order) => (
                  <Link key={`m-${order.id}`} href="/supplier/dashboard/orders" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="supplier-order-card" style={{ background: 'rgba(26,21,16,0.8)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: 0 }}>#{order.order_number}</p>
                        <StatusBadge label={statusLabels[order.status] || order.status} status={order.status} />
                      </div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(168,149,120,0.75)', margin: '0 0 4px' }}>{order.buyer_name}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.65)', margin: '0 0 3px' }}>{order.yurt?.name ?? '—'}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(168,149,120,0.6)', margin: 0 }}>{order.delivery_country} · {t('qty')} {order.quantity} · {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="supplier-orders-desktop" style={{ border: '1px solid rgba(168,149,120,0.1)', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '20px', color: 'rgba(168,149,120,0.3)', margin: 0 }}>{t('noOrdersYet')}</p>
              </div>
              <div className="supplier-orders-mobile" style={{ display: 'none', border: '1px solid rgba(168,149,120,0.1)', borderRadius: '14px', padding: '32px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '18px', color: 'rgba(168,149,120,0.35)', margin: 0 }}>{t('noOrdersYet')}</p>
              </div>
            </>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
          gap: '12px',
        }}>
          {[
            { label: t('addNewYurt'), href: '/supplier/dashboard/yurts/new', icon: '+' },
            { label: t('viewAllOrders'), href: '/supplier/dashboard/orders', icon: '◎' },
            { label: t('editProfile'), href: '/supplier/dashboard/settings', icon: '◉' },
          ].map(action => (
            <ActionLink
              key={action.href}
              href={action.href}
              icon={action.icon}
              label={action.label}
            />
          ))}
        </div>

        {/* Помощник / Quick guide */}
        <section className="supplier-helper-card" style={{
          marginTop: '48px',
          padding: '24px 28px',
          background: 'rgba(168,149,120,0.06)',
          border: '1px solid rgba(168,149,120,0.12)',
        }}>
          <h2 className="sp-label" style={{ margin: '0 0 16px' }}>
            {t('helperTitle')}
          </h2>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.7)',
          }}>
            <li style={{ marginBottom: '8px' }}>{t('helperTip1')}</li>
            <li style={{ marginBottom: '8px' }}>{t('helperTip2')}</li>
            <li>{t('helperTip3')}</li>
          </ul>
        </section>

    </>
  )
}

function StatusBadge({ label, status }: { label: string; status?: string }) {
  return (
    <span className={`sp-badge ${status ? `sp-badge-${status}` : ''}`}>
      {label}
    </span>
  )
}
