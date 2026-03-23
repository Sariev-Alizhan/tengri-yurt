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
        style={{
          width: '100%',
          height: '48px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          border: '1px solid rgba(168,149,120,0.5)',
          color: 'rgba(168,149,120,0.95)',
          background: 'rgba(168,149,120,0.08)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          borderRadius: '10px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'manipulation',
        }}
      >
        {t('rent')}
        {rentalPrice != null && rentalPrice > 0 && (
          <span style={{ fontWeight: 400, fontSize: '11px', opacity: 0.7, marginLeft: '8px' }}>
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
