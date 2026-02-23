import { createClient } from '@/utils/supabase/server'
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar'

export const dynamic = 'force-dynamic'

export default async function SupplierDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let supplierName: string
  if (user) {
    const { data: supplier } = await supabase
      .from('suppliers')
      .select('id, company_name')
      .eq('user_id', user.id)
      .single()
    supplierName = (supplier as { company_name?: string } | null)?.company_name || user.email || 'Supplier'
  } else {
    supplierName = ''
  }

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      minHeight: '100vh',
      background: '#0f0d0a',
    }}>
      <SupplierSidebar supplierName={supplierName} isLoggedIn={!!user} />
      <main
        style={{
          flex: 1,
          minHeight: '100vh',
          overflowY: 'auto',
          padding: 'clamp(24px, 4vw, 48px)',
          paddingBottom: '80px',
          background: '#12100d',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {children}
      </main>
    </div>
  )
}
