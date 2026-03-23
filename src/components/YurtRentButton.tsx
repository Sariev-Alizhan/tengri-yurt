'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { RentModal } from './RentModal'

export function YurtRentButton({
  yurtId,
  yurtSlug,
  yurtName,
  rentalPrice,
  supplierId,
  photo,
  locale,
}: {
  yurtId: string
  yurtSlug: string
  yurtName: string
  rentalPrice?: number | null
  supplierId: string
  photo?: string | null
  locale: string
}) {
  const t = useTranslations('catalog')
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-[10px] border border-[#1a1714]/35 bg-white/35 px-3 font-inter text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1a1714] shadow-sm transition-colors hover:border-[#1a1714] hover:bg-[#1a1714] hover:text-white touch-manipulation"
      >
        {t('rent')}
        {rentalPrice != null && rentalPrice > 0 && (
          <span className="font-normal text-[11px] opacity-90">
            from ${rentalPrice.toLocaleString('en-US')}
          </span>
        )}
      </button>
      {open && (
        <RentModal
          yurtId={yurtId}
          yurtSlug={yurtSlug}
          yurtName={yurtName}
          rentalPrice={rentalPrice}
          supplierId={supplierId}
          photo={photo}
          locale={locale}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
