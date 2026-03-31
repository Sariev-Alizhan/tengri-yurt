'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartContext'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { AddYurtModal } from '@/components/AddYurtModal'
import type { TraditionalAccessorySelected } from '@/components/AddYurtModal'
import { COVER_OPTIONS, PILLOWS_ADDON, KORPE_ADDON, BED_ADDON } from '@/lib/yurtAddOns'

type Props = {
  locale: string
  yurtId: string
  name: string
  slug: string
  price_usd: number
  supplier_id: string
  photo?: string | null
  addToCartLabel: string
}

export function YurtDetailAddToCart({
  locale,
  yurtId,
  name,
  slug,
  price_usd,
  supplier_id,
  photo,
  addToCartLabel,
}: Props) {
  const t = useTranslations('catalog')
  const tNav = useTranslations('nav')
  const { addYurt } = useCart()
  const [showModal, setShowModal] = useState(false)
  const [added, setAdded] = useState(false)

  const handleConfirm = (opts: {
    logistics: 'air' | 'sea'
    coverId: string | null
    pillowsQty: number
    korpeQty: number
    bed: boolean
    selectedTraditional: TraditionalAccessorySelected[]
    keregeColor: 'natural' | 'blue' | 'red' | 'silver'
    customInterior: boolean
    note: string
  }) => {
    const addons: { id: string; name: string; slug: string; price_usd: number; quantity: number }[] = []
    if (opts.coverId) {
      const cover = COVER_OPTIONS.find((c) => c.id === opts.coverId)
      if (cover) addons.push({ id: cover.id, name: t(cover.nameKey), slug: cover.slug, price_usd: cover.price_usd, quantity: 1 })
    }
    if (opts.pillowsQty >= PILLOWS_ADDON.minQty) {
      addons.push({ id: PILLOWS_ADDON.id, name: t('pillows'), slug: PILLOWS_ADDON.slug, price_usd: PILLOWS_ADDON.price_usd_per_unit, quantity: opts.pillowsQty })
    }
    if (opts.korpeQty >= KORPE_ADDON.minQty) {
      addons.push({ id: KORPE_ADDON.id, name: t('korpe'), slug: KORPE_ADDON.slug, price_usd: KORPE_ADDON.price_usd_per_unit, quantity: opts.korpeQty })
    }
    if (opts.bed) {
      addons.push({ id: BED_ADDON.id, name: t('bed'), slug: BED_ADDON.slug, price_usd: BED_ADDON.price_usd, quantity: 1 })
    }
    for (const acc of opts.selectedTraditional) {
      addons.push({ id: acc.id, name: acc.name, slug: acc.slug, price_usd: acc.price_usd, quantity: 1 })
    }
    addYurt({
      id: yurtId,
      name,
      slug,
      price_usd,
      quantity: 1,
      photo: photo ?? null,
      supplier_id,
      logistics: opts.logistics,
      keregeColor: opts.keregeColor,
      customInterior: opts.customInterior,
      note: opts.note || undefined,
      addons: addons.length > 0 ? addons : undefined,
    })
    setShowModal(false)
    setAdded(true)
  }

  return (
    <>
      {added ? (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/cart"
            className="inline-block border border-white bg-white text-[#1a1714] py-3 px-8 font-inter text-sm font-medium uppercase tracking-[0.12em] transition-colors duration-200 hover:bg-white/90 min-h-[48px] rounded-lg text-center"
          >
            {tNav('cart')} →
          </Link>
          <Link
            href="/catalog"
            className="inline-block border border-white/50 bg-transparent text-white/80 py-3 px-8 font-inter text-sm font-medium uppercase tracking-[0.12em] transition-colors duration-200 hover:border-white hover:text-white min-h-[48px] rounded-lg text-center"
          >
            {tNav('catalog')}
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-block border border-white/90 bg-white/10 py-3 px-8 font-inter text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-white hover:text-[#1a1714] min-h-[48px] rounded-lg"
        >
          {addToCartLabel}
        </button>
      )}
      {showModal && (
        <AddYurtModal
          yurt={{ id: yurtId, name, slug, price_usd, supplier_id, photo: photo ?? null }}
          locale={locale}
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
