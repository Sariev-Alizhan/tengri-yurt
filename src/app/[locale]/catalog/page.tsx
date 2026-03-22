import { createClient } from '@/utils/supabase/server'
import { DEFAULT_YURTS, DEFAULT_ACCESSORIES } from '@/lib/defaultCatalog'
import { CatalogClient, type Yurt, type Accessory } from './CatalogClient'

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

  // Если есть одобренные поставщики — показываем только их товары. Иначе — все юрты и аксессуары из БД.
  let yurtsQuery = supabase
    .from('yurts')
    .select(`
      id, name, slug, diameter_m, kanat,
      capacity_min, capacity_max, price_usd, price_usd_max, rental_price_usd,
      production_days_min, production_days_max, description, photos, supplier_id,
      suppliers ( company_name )
    `)
    .eq('is_available', true)
    .order('price_usd', { ascending: true })

  let accessoriesQuery = supabase
    .from('accessories')
    .select(`
      id, name, slug, category, description,
      price_usd, price_kzt, stock_quantity, photos, supplier_id, name_i18n,
      suppliers ( company_name )
    `)
    .eq('is_available', true)
    .order('category', { ascending: true })

  if (supplierIds.length > 0) {
    yurtsQuery = yurtsQuery.in('supplier_id', supplierIds)
    accessoriesQuery = accessoriesQuery.in('supplier_id', supplierIds)
  }

  const [{ data: yurts }, { data: accessories }] = await Promise.all([
    yurtsQuery,
    accessoriesQuery,
  ])

  const yurtsList = (yurts?.length ?? 0) > 0 ? yurts : DEFAULT_YURTS.map((y) => ({ ...y, suppliers: null }))
  const accessoriesList = (accessories?.length ?? 0) > 0 ? accessories : DEFAULT_ACCESSORIES.map((a) => ({ ...a, suppliers: null }))

  return (
    <CatalogClient
      yurts={(yurtsList ?? []) as Yurt[]}
      accessories={(accessoriesList ?? []) as Accessory[]}
      locale={locale}
    />
  )
}
