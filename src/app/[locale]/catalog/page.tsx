import { createClient } from '@/utils/supabase/server'
import { CatalogClient } from './CatalogClient'

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: approvedSuppliers } = await supabase
    .from('suppliers')
    .select('id')
    .eq('is_approved', true)

  const supplierIds = (approvedSuppliers ?? []).map((s: { id: string }) => s.id)
  if (supplierIds.length === 0) {
    return <CatalogClient yurts={[]} accessories={[]} locale={locale} />
  }

  const { data: yurts } = await supabase
    .from('yurts')
    .select(`
      id, name, slug, diameter_m, kanat,
      capacity_min, capacity_max, price_usd,
      production_days_min, production_days_max, description, photos
    `)
    .eq('is_available', true)
    .in('supplier_id', supplierIds)
    .order('price_usd', { ascending: true })

  const { data: accessories } = await supabase
    .from('accessories')
    .select(`
      id, name, slug, category, description,
      price_usd, price_kzt, stock_quantity, photos
    `)
    .eq('is_available', true)
    .in('supplier_id', supplierIds)
    .order('category', { ascending: true })

  return <CatalogClient yurts={yurts || []} accessories={accessories || []} locale={locale} />
}
