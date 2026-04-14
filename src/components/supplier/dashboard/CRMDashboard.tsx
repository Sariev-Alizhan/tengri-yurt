'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'

// ── Types ────────────────────────────────────────────────────────────────────

export interface CRMOrder {
  id: string
  order_number: string
  status: string
  payment_status: string
  quantity: number
  total_price_usd: number | null
  created_at: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  delivery_country: string
  delivery_city: string
  shipping_method: string | null
  yurt_name: string | null
}

export interface CRMStats {
  totalRevenue: number
  paidRevenue: number
  totalOrders: number
  thisMonthOrders: number
  thisMonthRevenue: number
  avgOrderValue: number
  pendingCount: number
  activeCount: number
}

export interface MonthlyBar {
  label: string
  orders: number
  revenue: number
}

export interface CountryRow {
  country: string
  count: number
  revenue: number
}

export interface ProductRow {
  name: string
  count: number
  revenue: number
}

interface Props {
  orders: CRMOrder[]
  stats: CRMStats
  monthly: MonthlyBar[]
  countries: CountryRow[]
  products: ProductRow[]
  supplierName: string
  isApproved: boolean
  totalYurts: number
  locale: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending:       'rgba(255,180,60,0.85)',
  confirmed:     'rgba(100,180,255,0.85)',
  in_production: 'rgba(160,130,255,0.85)',
  ready:         'rgba(80,210,140,0.7)',
  shipped:       'rgba(80,200,220,0.85)',
  delivered:     'rgba(100,210,100,0.9)',
  cancelled:     'rgba(220,80,80,0.7)',
}
const STATUS_BG: Record<string, string> = {
  pending:       'rgba(255,180,60,0.10)',
  confirmed:     'rgba(100,180,255,0.10)',
  in_production: 'rgba(160,130,255,0.10)',
  ready:         'rgba(80,210,140,0.08)',
  shipped:       'rgba(80,200,220,0.10)',
  delivered:     'rgba(100,210,100,0.10)',
  cancelled:     'rgba(220,80,80,0.08)',
}
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', confirmed: 'Confirmed', in_production: 'In Production',
  ready: 'Ready', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
}
const PAY_LABEL: Record<string, string> = {
  awaiting_invoice: 'Awaiting Invoice', invoice_sent: 'Invoice Sent',
  paid: 'Paid', cancelled: 'Cancelled',
}
const PAY_COLOR: Record<string, string> = {
  awaiting_invoice: 'rgba(255,180,60,0.85)',
  invoice_sent: 'rgba(100,180,255,0.85)',
  paid: 'rgba(100,210,100,0.9)',
  cancelled: 'rgba(220,80,80,0.7)',
}

function fmt(n: number) { return '$' + Math.round(n).toLocaleString() }

// ── Bar Chart (SVG) ──────────────────────────────────────────────────────────

function BarChart({ data, valueKey }: { data: MonthlyBar[]; valueKey: 'revenue' | 'orders' }) {
  const vals = data.map(d => d[valueKey])
  const max = Math.max(...vals, 1)
  const H = 80
  const gap = 8

  return (
    <svg
      width="100%" viewBox={`0 0 ${data.length * (32 + gap)} ${H + 20}`}
      style={{ overflow: 'visible', display: 'block' }}
    >
      {data.map((d, i) => {
        const v = d[valueKey]
        const barH = Math.max(2, (v / max) * H)
        const x = i * (32 + gap)
        const isLast = i === data.length - 1
        return (
          <g key={d.label}>
            <rect
              x={x} y={H - barH} width={32} height={barH}
              rx={3}
              fill={isLast ? 'rgba(201,168,110,0.7)' : 'rgba(201,168,110,0.25)'}
            />
            <text
              x={x + 16} y={H + 14}
              textAnchor="middle"
              fontSize="9" fill="rgba(168,149,120,0.6)"
              fontFamily="Inter, sans-serif"
            >
              {d.label}
            </text>
            {v > 0 && (
              <text
                x={x + 16} y={H - barH - 4}
                textAnchor="middle"
                fontSize="8" fill="rgba(201,168,110,0.8)"
                fontFamily="Inter, sans-serif"
              >
                {valueKey === 'revenue' ? (v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`) : v}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Mini Donut ────────────────────────────────────────────────────────────────

function MiniDonut({ slices }: { slices: { value: number; color: string }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  const r = 28, cx = 32, cy = 32, stroke = 10
  let angle = -Math.PI / 2
  const paths: { d: string; color: string }[] = []
  for (const s of slices) {
    const sweep = (s.value / total) * 2 * Math.PI
    if (sweep < 0.01) { angle += sweep; continue }
    const x1 = cx + r * Math.cos(angle)
    const y1 = cy + r * Math.sin(angle)
    angle += sweep
    const x2 = cx + r * Math.cos(angle)
    const y2 = cy + r * Math.sin(angle)
    const large = sweep > Math.PI ? 1 : 0
    paths.push({ d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, color: s.color })
  }
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth={stroke} strokeLinecap="butt" />
      ))}
    </svg>
  )
}

// ── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--sp-surface)',
      border: '1px solid var(--sp-border)',
      borderRadius: '12px',
      padding: '20px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--sp-text-3)', margin: '0 0 16px',
    }}>
      {children}
    </p>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CRMDashboard({
  orders, stats, monthly, countries, products,
  supplierName, isApproved, totalYurts,
}: Props) {
  const [activeChart, setActiveChart] = useState<'revenue' | 'orders'>('revenue')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const firstName = supplierName.split(' ')[0] || supplierName

  // Status distribution
  const statusCounts: Record<string, number> = {}
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
  }

  // Payment breakdown
  const payCounts: Record<string, number> = {}
  for (const o of orders) {
    payCounts[o.payment_status] = (payCounts[o.payment_status] || 0) + 1
  }

  // Filtered orders for pipeline
  const filteredOrders = statusFilter === 'all'
    ? orders.slice(0, 20)
    : orders.filter(o => o.status === statusFilter).slice(0, 20)

  const PIPELINE_STATUSES = ['pending', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered']

  return (
    <div style={{ maxWidth: '1100px' }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sp-text-3)', margin: '0 0 8px' }}>
          Supplier Portal · CRM
        </p>
        <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(26px, 4vw, 40px)', color: 'var(--sp-text-1)', fontWeight: 400, margin: 0, lineHeight: 1.1 }}>
          Welcome back, {firstName}
        </h1>
      </header>

      {/* ── Approval banner ── */}
      {!isApproved && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 16px', marginBottom: '24px', background: 'rgba(255,180,60,0.07)', border: '1px solid rgba(255,180,60,0.2)', borderRadius: '10px' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="rgba(255,180,60,0.85)"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 5.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/></svg>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,180,60,0.85)', margin: 0 }}>Your account is pending approval. You can add products but orders won&apos;t be visible to buyers yet.</p>
        </div>
      )}

      {/* ── KPI Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }} className="crm-kpi-grid">
        <KPICard label="Total Revenue" value={fmt(stats.totalRevenue)} sub={`${fmt(stats.paidRevenue)} confirmed`} color="rgba(201,168,110,0.9)" />
        <KPICard label="Total Orders" value={String(stats.totalOrders)} sub={`${stats.thisMonthOrders} this month`} color="rgba(100,180,255,0.85)" />
        <KPICard label="Avg Order Value" value={fmt(stats.avgOrderValue)} sub="per inquiry" color="rgba(160,130,255,0.85)" />
        <KPICard label="Needs Action" value={String(stats.pendingCount)} sub="pending orders" color={stats.pendingCount > 0 ? 'rgba(255,180,60,0.9)' : 'rgba(100,210,100,0.85)'} highlight={stats.pendingCount > 0} />
      </div>

      {/* ── Second KPI Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }} className="crm-kpi-grid">
        <KPICard label="Active Yurts" value={String(totalYurts)} sub="in catalog" color="rgba(80,210,140,0.8)" />
        <KPICard label="This Month" value={fmt(stats.thisMonthRevenue)} sub="revenue" color="rgba(201,168,110,0.7)" />
        <KPICard label="In Pipeline" value={String(stats.activeCount)} sub="in production/transit" color="rgba(80,200,220,0.85)" />
        <KPICard label="Paid" value={String(payCounts['paid'] || 0)} sub={`of ${stats.totalOrders} orders`} color="rgba(100,210,100,0.85)" />
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="crm-two-col">

        {/* Revenue / Orders chart */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <CardTitle>{activeChart === 'revenue' ? 'Monthly Revenue' : 'Monthly Orders'}</CardTitle>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['revenue', 'orders'] as const).map(k => (
                <button key={k} onClick={() => setActiveChart(k)} style={{
                  padding: '3px 10px', fontSize: '9px', fontFamily: 'Inter, sans-serif',
                  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                  border: '1px solid', cursor: 'pointer', borderRadius: '4px',
                  borderColor: activeChart === k ? 'rgba(201,168,110,0.5)' : 'rgba(255,255,255,0.08)',
                  background: activeChart === k ? 'rgba(201,168,110,0.12)' : 'transparent',
                  color: activeChart === k ? 'rgba(201,168,110,0.9)' : 'var(--sp-text-3)',
                  transition: 'all 0.15s',
                }}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          {monthly.length > 0 ? (
            <BarChart data={monthly} valueKey={activeChart} />
          ) : (
            <EmptyChart />
          )}
        </Card>

        {/* Order Status Funnel */}
        <Card>
          <CardTitle>Order Pipeline</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {PIPELINE_STATUSES.map(s => {
              const count = statusCounts[s] || 0
              const pct = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0
              return (
                <div key={s}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: STATUS_COLORS[s] }}>{STATUS_LABEL[s]}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)' }}>{count}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: STATUS_COLORS[s], borderRadius: '2px', transition: 'width 0.6s ease', minWidth: count > 0 ? '6px' : '0' }} />
                  </div>
                </div>
              )
            })}
            {statusCounts['cancelled'] > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: STATUS_COLORS['cancelled'] }}>Cancelled</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)' }}>{statusCounts['cancelled']}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((statusCounts['cancelled'] || 0) / stats.totalOrders) * 100}%`, background: STATUS_COLORS['cancelled'], borderRadius: '2px' }} />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Countries + Payment Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="crm-two-col">

        {/* Top Countries */}
        <Card>
          <CardTitle>Top Countries</CardTitle>
          {countries.length === 0 ? (
            <EmptyState text="No orders yet" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {countries.slice(0, 6).map((c, i) => {
                const maxCount = countries[0].count
                const pct = (c.count / maxCount) * 100
                return (
                  <div key={c.country}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-1)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', color: 'var(--sp-text-3)', minWidth: '14px' }}>{i + 1}</span>
                        {c.country || '—'}
                      </span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)', display: 'flex', gap: '10px' }}>
                        {c.revenue > 0 && <span style={{ color: 'rgba(201,168,110,0.7)' }}>{fmt(c.revenue)}</span>}
                        <span>{c.count} order{c.count !== 1 ? 's' : ''}</span>
                      </span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(201,168,110,0.4)', borderRadius: '2px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Payment Status */}
        <Card>
          <CardTitle>Payment Status</CardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <MiniDonut slices={[
              { value: payCounts['paid'] || 0, color: 'rgba(100,210,100,0.85)' },
              { value: payCounts['invoice_sent'] || 0, color: 'rgba(100,180,255,0.8)' },
              { value: payCounts['awaiting_invoice'] || 0, color: 'rgba(255,180,60,0.8)' },
              { value: payCounts['cancelled'] || 0, color: 'rgba(220,80,80,0.6)' },
            ]} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(['paid', 'invoice_sent', 'awaiting_invoice', 'cancelled'] as const).map(k => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: PAY_COLOR[k], flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-2)' }}>{PAY_LABEL[k]}</span>
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: PAY_COLOR[k] }}>
                    {payCounts[k] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Product Performance ── */}
      {products.length > 0 && (
        <Card style={{ marginBottom: '16px' }}>
          <CardTitle>Product Performance</CardTitle>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Yurt Model', 'Orders', 'Revenue', 'Avg Value', 'Share'].map(h => (
                    <th key={h} style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sp-text-3)', padding: '0 16px 10px 0', textAlign: 'left', borderBottom: '1px solid var(--sp-border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => {
                  const totalOrders = products.reduce((s, x) => s + x.count, 0)
                  const share = totalOrders > 0 ? Math.round((p.count / totalOrders) * 100) : 0
                  return (
                    <tr key={p.name} style={{ borderBottom: i < products.length - 1 ? '1px solid var(--sp-border)' : 'none' }}>
                      <td style={{ padding: '10px 16px 10px 0', fontFamily: 'EB Garamond, serif', fontSize: '15px', color: 'var(--sp-text-1)' }}>{p.name || '—'}</td>
                      <td style={{ padding: '10px 16px 10px 0', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-2)', fontWeight: 600 }}>{p.count}</td>
                      <td style={{ padding: '10px 16px 10px 0', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(201,168,110,0.8)' }}>{p.revenue > 0 ? fmt(p.revenue) : '—'}</td>
                      <td style={{ padding: '10px 16px 10px 0', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-3)' }}>{p.count > 0 && p.revenue > 0 ? fmt(p.revenue / p.count) : '—'}</td>
                      <td style={{ padding: '10px 0', minWidth: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                            <div style={{ height: '100%', width: `${share}%`, background: 'rgba(201,168,110,0.45)', borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--sp-text-3)', minWidth: '26px' }}>{share}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Orders Pipeline ── */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <CardTitle>Recent Orders</CardTitle>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <FilterBtn active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>All</FilterBtn>
            {['pending', 'confirmed', 'in_production', 'shipped'].map(s => (
              <FilterBtn key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} color={STATUS_COLORS[s]}>
                {STATUS_LABEL[s]}
              </FilterBtn>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState text="No orders match this filter" />
        ) : (
          <>
            {/* Desktop table */}
            <div className="crm-orders-desktop" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Order', 'Customer', 'Yurt', 'Country', 'Status', 'Payment', 'Value', 'Date'].map(h => (
                      <th key={h} style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sp-text-3)', padding: '0 12px 10px 0', textAlign: 'left', borderBottom: '1px solid var(--sp-border)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o, i) => (
                    <tr key={o.id} className="crm-order-row" style={{ borderBottom: i < filteredOrders.length - 1 ? '1px solid var(--sp-border)' : 'none' }}>
                      <td style={{ padding: '11px 12px 11px 0' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--sp-text-1)' }}>#{o.order_number}</span>
                      </td>
                      <td style={{ padding: '11px 12px 11px 0' }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-1)', margin: 0 }}>{o.buyer_name}</p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--sp-text-3)', margin: 0 }}>{o.buyer_email}</p>
                      </td>
                      <td style={{ padding: '11px 12px 11px 0', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-2)', whiteSpace: 'nowrap' }}>
                        {o.yurt_name ?? '—'}{o.quantity > 1 && <span style={{ color: 'var(--sp-text-3)' }}> ×{o.quantity}</span>}
                      </td>
                      <td style={{ padding: '11px 12px 11px 0', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)' }}>{o.delivery_country || '—'}</td>
                      <td style={{ padding: '11px 12px 11px 0' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '20px', background: STATUS_BG[o.status], color: STATUS_COLORS[o.status], whiteSpace: 'nowrap' }}>
                          {STATUS_LABEL[o.status] || o.status}
                        </span>
                      </td>
                      <td style={{ padding: '11px 12px 11px 0' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', color: PAY_COLOR[o.payment_status] || 'var(--sp-text-3)', whiteSpace: 'nowrap' }}>
                          {PAY_LABEL[o.payment_status] || o.payment_status}
                        </span>
                      </td>
                      <td style={{ padding: '11px 12px 11px 0', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(201,168,110,0.8)', whiteSpace: 'nowrap' }}>
                        {o.total_price_usd ? fmt(o.total_price_usd) : '—'}
                      </td>
                      <td style={{ padding: '11px 0', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)', whiteSpace: 'nowrap' }}>
                        {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="crm-orders-mobile" style={{ display: 'none', flexDirection: 'column', gap: '8px' }}>
              {filteredOrders.map(o => (
                <div key={o.id} style={{ padding: '14px', background: 'var(--sp-surface-2)', borderRadius: '8px', border: '1px solid var(--sp-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: 'var(--sp-text-1)' }}>#{o.order_number}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px', background: STATUS_BG[o.status], color: STATUS_COLORS[o.status] }}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-2)', margin: '0 0 4px' }}>{o.buyer_name} · {o.delivery_country}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)', margin: 0 }}>
                    {o.yurt_name ?? '—'}{o.quantity > 1 ? ` ×${o.quantity}` : ''} · {o.total_price_usd ? fmt(o.total_price_usd) : 'TBD'}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--sp-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/supplier/dashboard/orders" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, color: 'var(--sp-gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
            View all orders
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </Card>

      {/* ── Quick Actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '8px' }} className="crm-actions-grid">
        {[
          { href: '/supplier/dashboard/yurts/new', label: 'Add Yurt', icon: '+' },
          { href: '/supplier/dashboard/orders', label: 'All Orders', icon: '◎' },
          { href: '/supplier/dashboard/settings', label: 'Settings', icon: '◉' },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', background: 'var(--sp-surface)',
            border: '1px solid var(--sp-border)', borderRadius: '8px',
            textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,110,0.3)'; e.currentTarget.style.background = 'var(--sp-surface-2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--sp-border)'; e.currentTarget.style.background = 'var(--sp-surface)' }}
          >
            <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '18px', color: 'var(--sp-gold)', opacity: 0.7 }}>{a.icon}</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--sp-text-2)' }}>{a.label}</span>
          </Link>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .crm-order-row:hover td { background: rgba(255,255,255,0.025); }
        @media (max-width: 900px) {
          .crm-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .crm-two-col { grid-template-columns: 1fr !important; }
          .crm-actions-grid { grid-template-columns: 1fr !important; }
          .crm-orders-desktop { display: none !important; }
          .crm-orders-mobile { display: flex !important; }
        }
        @media (max-width: 480px) {
          .crm-kpi-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}} />
    </div>
  )
}

// ── Small sub-components ──────────────────────────────────────────────────────

function KPICard({ label, value, sub, color, highlight }: { label: string; value: string; sub: string; color: string; highlight?: boolean }) {
  return (
    <div style={{
      padding: '16px 18px', background: 'var(--sp-surface)',
      border: `1px solid ${highlight ? 'rgba(255,180,60,0.25)' : 'var(--sp-border)'}`,
      borderRadius: '10px', position: 'relative', overflow: 'hidden',
    }}>
      {highlight && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, rgba(255,180,60,0.7), transparent)' }} />}
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sp-text-3)', margin: '0 0 8px' }}>{label}</p>
      <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(22px, 3.5vw, 30px)', color, fontWeight: 400, lineHeight: 1, margin: '0 0 5px' }}>{value}</p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--sp-text-3)', margin: 0 }}>{sub}</p>
    </div>
  )
}

function FilterBtn({ children, active, onClick, color }: { children: React.ReactNode; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button onClick={onClick} style={{
      padding: '3px 10px', fontSize: '9px', fontFamily: 'Inter, sans-serif',
      fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
      border: '1px solid', cursor: 'pointer', borderRadius: '4px',
      borderColor: active ? (color || 'rgba(201,168,110,0.5)') : 'rgba(255,255,255,0.08)',
      background: active ? (color ? color.replace('0.85', '0.12').replace('0.9', '0.12').replace('0.7', '0.10') : 'rgba(201,168,110,0.12)') : 'transparent',
      color: active ? (color || 'rgba(201,168,110,0.9)') : 'var(--sp-text-3)',
      transition: 'all 0.15s',
    }}>
      {children}
    </button>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--sp-text-3)', textAlign: 'center', padding: '24px 0', margin: 0 }}>{text}</p>
  )
}

function EmptyChart() {
  return (
    <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-3)', margin: 0 }}>No data yet</p>
    </div>
  )
}
