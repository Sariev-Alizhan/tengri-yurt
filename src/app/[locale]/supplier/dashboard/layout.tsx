import { createClient } from '@/utils/supabase/server'
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar'
import { SupplierThemeEnforcer } from '@/components/supplier/SupplierThemeEnforcer'

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
      background: 'var(--sp-bg)',
      paddingTop: 'max(56px, env(safe-area-inset-top))',
    }}>
      <SupplierThemeEnforcer />
      <SupplierSidebar supplierName={supplierName} isLoggedIn={!!user} />
      <main
        className="supplier-dashboard-main"
        style={{
          minHeight: 'calc(100vh - 56px)',
          overflowY: 'auto',
          padding: 'clamp(24px, 4vw, 48px)',
          paddingBottom: '88px',
          background: 'var(--sp-bg)',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {children}
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .supplier-dashboard-main {
            margin-left: 220px;
          }
          body.sidebar-collapsed .supplier-dashboard-main {
            margin-left: 60px;
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
