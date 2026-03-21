import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
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

  const { data: rentals } = await supabase
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
    <div className="max-w-6xl">
      <h1 className="font-garamond text-3xl text-white mb-8">{t('rentals')}</h1>
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
