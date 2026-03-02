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
      width: '100%',
      minHeight: '100vh',
      background: '#0f0d0a',
      paddingTop: '60px',
    }}>
      <SupplierSidebar supplierName={supplierName} isLoggedIn={!!user} />
      <main
        className="supplier-dashboard-main"
        style={{
          minHeight: 'calc(100vh - 60px)',
          overflowY: 'auto',
          padding: 'clamp(24px, 4vw, 48px)',
          paddingBottom: '80px',
          background: '#12100d',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {children}
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .supplier-dashboard-main {
            margin-left: 240px;
          }
          body.sidebar-collapsed .supplier-dashboard-main {
            margin-left: 64px;
          }
        }
        @media (max-width: 767px) {
          .supplier-dashboard-main {
            margin-left: 0;
            padding-bottom: max(80px, env(safe-area-inset-bottom) + 70px) !important;
          }
        }
      `}} />
    </div>
  )
}
