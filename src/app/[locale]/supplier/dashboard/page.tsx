import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { CRMDashboard, type CRMOrder, type CRMStats, type MonthlyBar, type CountryRow, type ProductRow } from '@/components/supplier/dashboard/CRMDashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ maxWidth: '480px' }}>
        <header style={{ marginBottom: '40px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sp-text-3)', marginBottom: '10px' }}>
            Supplier Portal
          </p>
          <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(28px, 5vw, 44px)', color: 'var(--sp-text-1)', fontWeight: 400, margin: 0 }}>
            Welcome back
          </h1>
        </header>
        <div style={{ padding: '40px 32px', textAlign: 'center', border: '1px solid var(--sp-border)', background: 'var(--sp-surface)', borderRadius: '12px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'var(--sp-text-2)', marginBottom: '24px', lineHeight: 1.6 }}>
            Sign in to access your dashboard
          </p>
          <Link href="/supplier/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--sp-gold)', color: '#0a0806', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '6px' }}>
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // ── Load supplier ──────────────────────────────────────────────────────────
  const { data: supplier } = await supabase
    .from('suppliers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!supplier) redirect(`/${locale}/supplier/register`)

  const supplierId = (supplier as { id: string }).id
  const supplierName = (supplier as { company_name: string }).company_name || user.email || 'Supplier'
  const isApproved = !!(supplier as { is_approved?: boolean }).is_approved

  // ── Fetch all orders (for analytics) ──────────────────────────────────────
  type RawOrder = {
    id: string
    order_number: string
    status: string
    payment_status: string
    quantity: number
    total_price_usd: number | null
    unit_price_usd: number | null
    created_at: string
    buyer_name: string
    buyer_email: string
    buyer_phone: string
    delivery_country: string
    delivery_city: string
    shipping_method: string | null
    yurt: { name: string } | { name: string }[] | null
  }

  const [{ data: rawOrders }, totalYurtsResult] = await Promise.all([
    supabase
      .from('orders')
      .select(`
        id, order_number, status, payment_status, quantity,
        total_price_usd, unit_price_usd, created_at,
        buyer_name, buyer_email, buyer_phone,
        delivery_country, delivery_city, shipping_method,
        yurt:yurts(name)
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false }),
    supabase
      .from('yurts')
      .select('id', { count: 'exact', head: true })
      .eq('supplier_id', supplierId),
  ])

  const totalYurts = totalYurtsResult.count ?? 0

  // Normalise yurt relation
  const orders: CRMOrder[] = (rawOrders ?? []).map((o: RawOrder) => ({
    id: o.id,
    order_number: o.order_number,
    status: o.status,
    payment_status: o.payment_status,
    quantity: o.quantity,
    total_price_usd: o.total_price_usd,
    created_at: o.created_at,
    buyer_name: o.buyer_name,
    buyer_email: o.buyer_email,
    buyer_phone: o.buyer_phone,
    delivery_country: o.delivery_country,
    delivery_city: o.delivery_city,
    shipping_method: o.shipping_method,
    yurt_name: Array.isArray(o.yurt) ? (o.yurt[0]?.name ?? null) : (o.yurt?.name ?? null),
  }))

  // ── Compute analytics ──────────────────────────────────────────────────────

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const totalRevenue = orders.reduce((s, o) => s + (o.total_price_usd ?? 0), 0)
  const paidRevenue  = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((s, o) => s + (o.total_price_usd ?? 0), 0)
  const thisMonthOrders  = orders.filter(o => new Date(o.created_at) >= thisMonthStart).length
  const thisMonthRevenue = orders
    .filter(o => new Date(o.created_at) >= thisMonthStart)
    .reduce((s, o) => s + (o.total_price_usd ?? 0), 0)
  const withPrice = orders.filter(o => (o.total_price_usd ?? 0) > 0)
  const avgOrderValue = withPrice.length > 0
    ? withPrice.reduce((s, o) => s + (o.total_price_usd ?? 0), 0) / withPrice.length
    : 0
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const activeCount  = orders.filter(o => ['confirmed', 'in_production', 'ready', 'shipped'].includes(o.status)).length

  const stats: CRMStats = {
    totalRevenue, paidRevenue, totalOrders: orders.length,
    thisMonthOrders, thisMonthRevenue, avgOrderValue,
    pendingCount, activeCount,
  }

  // ── Monthly data (last 6 months) ───────────────────────────────────────────
  const monthly: MonthlyBar[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    const slice = orders.filter(o => {
      const t = new Date(o.created_at)
      return t >= d && t < next
    })
    monthly.push({
      label: d.toLocaleString('en', { month: 'short' }),
      orders: slice.length,
      revenue: slice.reduce((s, o) => s + (o.total_price_usd ?? 0), 0),
    })
  }

  // ── Countries ──────────────────────────────────────────────────────────────
  const countryMap: Record<string, { count: number; revenue: number }> = {}
  for (const o of orders) {
    const c = o.delivery_country || 'Unknown'
    if (!countryMap[c]) countryMap[c] = { count: 0, revenue: 0 }
    countryMap[c].count++
    countryMap[c].revenue += o.total_price_usd ?? 0
  }
  const countries: CountryRow[] = Object.entries(countryMap)
    .map(([country, v]) => ({ country, ...v }))
    .sort((a, b) => b.count - a.count)

  // ── Products ───────────────────────────────────────────────────────────────
  const productMap: Record<string, { count: number; revenue: number }> = {}
  for (const o of orders) {
    const name = o.yurt_name || 'Unknown'
    if (!productMap[name]) productMap[name] = { count: 0, revenue: 0 }
    productMap[name].count++
    productMap[name].revenue += o.total_price_usd ?? 0
  }
  const products: ProductRow[] = Object.entries(productMap)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.count - a.count)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <CRMDashboard
      orders={orders}
      stats={stats}
      monthly={monthly}
      countries={countries}
      products={products}
      supplierName={supplierName}
      isApproved={isApproved}
      totalYurts={totalYurts}
      locale={locale}
    />
  )
}
