'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartContext'
import { useTranslations } from 'next-intl'
import { AddYurtModal } from '@/components/AddYurtModal'
import { COVER_OPTIONS, PILLOWS_ADDON, KORPE_ADDON, BED_ADDON } from '@/lib/yurtAddOns'

type Props = {
  yurtId: string
  name: string
  slug: string
  price_usd: number
  supplier_id: string
  photo?: string | null
  addToCartLabel: string
  quantityLabel: string
}

export function YurtDetailAddToCart({
  yurtId,
  name,
  slug,
  price_usd,
  supplier_id,
  photo,
  addToCartLabel,
}: Props) {
  const t = useTranslations('catalog')
  const { addYurt, addAccessory } = useCart()
  const [showModal, setShowModal] = useState(false)

  const handleConfirm = (opts: {
    logistics: 'air' | 'sea'
    coverId: string | null
    pillowsQty: number
    korpeQty: number
    bed: boolean
  }) => {
    addYurt({
      id: yurtId,
      name,
      slug,
      price_usd,
      quantity: 1,
      photo: photo ?? null,
      supplier_id,
      logistics: opts.logistics,
    })
    if (opts.coverId) {
      const cover = COVER_OPTIONS.find((c) => c.id === opts.coverId)
      if (cover) {
        addAccessory({
          id: cover.id,
          name: t(cover.nameKey),
          slug: cover.slug,
          price_usd: null,
          price_kzt: cover.price_kzt,
          quantity: 1,
          supplier_id,
        })
      }
    }
    if (opts.pillowsQty >= PILLOWS_ADDON.minQty) {
      addAccessory({
        id: PILLOWS_ADDON.id,
        name: t('pillows'),
        slug: PILLOWS_ADDON.slug,
        price_usd: null,
        price_kzt: PILLOWS_ADDON.price_kzt_per_unit,
        quantity: opts.pillowsQty,
        supplier_id,
      })
    }
    if (opts.korpeQty >= KORPE_ADDON.minQty) {
      addAccessory({
        id: KORPE_ADDON.id,
        name: t('korpe'),
        slug: KORPE_ADDON.slug,
        price_usd: null,
        price_kzt: KORPE_ADDON.price_kzt_per_unit,
        quantity: opts.korpeQty,
        supplier_id,
      })
    }
    if (opts.bed) {
      addAccessory({
        id: BED_ADDON.id,
        name: t('bed'),
        slug: BED_ADDON.slug,
        price_usd: null,
        price_kzt: BED_ADDON.price_kzt,
        quantity: 1,
        supplier_id,
      })
    }
    setShowModal(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-block border border-white bg-white/10 py-3 px-8 font-inter text-sm font-medium uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-white hover:text-black"
      >
        {addToCartLabel}
      </button>
      {showModal && (
        <AddYurtModal
          yurt={{ id: yurtId, name, slug, price_usd, supplier_id, photo: photo ?? null }}
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
