import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { RentalsList } from './RentalsList'

export default async function SupplierRentalsPage() {
  const t = await getTranslations('supplier')
  const locale = await getLocale()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/supplier/login`)

  const { data: supplier } = await supabase
    .from('suppliers')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!supplier) redirect(`/${locale}/supplier/register`)

  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )

  const { data: rentals } = await adminClient
    .from('rental_inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  const statusLabels: Record<string, string> = {
    new: t('rentalStatusNew'),
    contacted: t('rentalStatusContacted'),
    confirmed: t('rentalStatusConfirmed'),
    cancelled: t('rentalStatusCancelled'),
  }

  return (
    <div style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sp-text-3)', marginBottom: '6px' }}>
          Sales
        </p>
        <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(26px, 4vw, 36px)', color: 'var(--sp-text-1)', fontWeight: 400, margin: 0 }}>
          {t('rentals')}
        </h1>
      </div>
      <RentalsList
        rentals={(rentals as any[]) ?? []}
        statusLabels={statusLabels}
        noRentalsLabel={t('noRentals')}
        clientLabel={t('rentalClient')}
        phoneLabel={t('rentalPhone')}
        yurtLabel={t('rentalYurt')}
        messageLabel={t('rentalMessage')}
        dateLabel={t('rentalDate')}
      />
    </div>
  )
}
