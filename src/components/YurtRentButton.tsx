'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { RentModal } from './RentModal'

export function YurtRentButton({
  yurtSlug,
  yurtName,
}: {
  yurtSlug: string
  yurtName: string
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
      </button>
      {open && (
        <RentModal
          yurtSlug={yurtSlug}
          yurtName={yurtName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
