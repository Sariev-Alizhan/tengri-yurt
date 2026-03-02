'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  LOGISTICS,
  getRecommendationForSlug,
  COVER_OPTIONS,
  PILLOWS_ADDON,
  KORPE_ADDON,
  BED_ADDON,
  type LogisticsOption,
} from '@/lib/yurtAddOns'

type YurtForModal = {
  id: string
  name: string
  slug: string
  price_usd: number
  supplier_id: string
  photo?: string | null
}

type Props = {
  yurt: YurtForModal
  onConfirm: (opts: {
    logistics: LogisticsOption
    coverId: string | null
    pillowsQty: number
    korpeQty: number
    bed: boolean
  }) => void
  onClose: () => void
}

export function AddYurtModal({ yurt, onConfirm, onClose }: Props) {
  const t = useTranslations('catalog')
  const rec = getRecommendationForSlug(yurt.slug)

  const [logistics, setLogistics] = useState<LogisticsOption>('air')
  const [coverId, setCoverId] = useState<string | null>(null)
  const [pillowsQty, setPillowsQty] = useState(rec.pillowsMin)
  const [korpeQty, setKorpeQty] = useState(rec.korpeMin)
  const [bed, setBed] = useState(false)

  const handleAddWithOptions = () => {
    onConfirm({
      logistics,
      coverId,
      pillowsQty: pillowsQty >= PILLOWS_ADDON.minQty ? pillowsQty : 0,
      korpeQty: korpeQty >= KORPE_ADDON.minQty ? korpeQty : 0,
      bed,
    })
    onClose()
  }

  const handleYurtOnly = () => {
    onConfirm({
      logistics,
      coverId: null,
      pillowsQty: 0,
      korpeQty: 0,
      bed: false,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-[#2a2520] border border-white/10 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <h2 className="font-garamond text-white text-2xl md:text-3xl mb-1">
            {t('addYurtModalTitle')}
          </h2>
          <p className="font-inter text-white/70 text-sm mb-6">{yurt.name}</p>
          <p className="font-inter text-white/50 text-xs mb-6">{t('addYurtModalSubtitle')}</p>

          {/* Installation */}
          <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="font-inter text-white/80 text-sm leading-relaxed">{t('installationNote')}</p>
          </div>

          {/* Logistics */}
          <div className="mb-6">
            <p className="font-inter text-white/60 text-xs uppercase tracking-wider mb-3">
              {t('logisticsTitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-white/90 font-inter text-sm">
                <input
                  type="radio"
                  name="logistics"
                  checked={logistics === 'air'}
                  onChange={() => setLogistics('air')}
                  className="accent-amber-600"
                />
                {t('airShipping')}
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-white/90 font-inter text-sm">
                <input
                  type="radio"
                  name="logistics"
                  checked={logistics === 'sea'}
                  onChange={() => setLogistics('sea')}
                  className="accent-amber-600"
                />
                {t('seaShipping')}
              </label>
            </div>
          </div>

          {/* Accessories */}
          <div className="mb-6">
            <p className="font-inter text-white/60 text-xs uppercase tracking-wider mb-3">
              {t('addAccessoriesTitle')}
            </p>

            {/* Covers */}
            <div className="space-y-2 mb-4">
              {COVER_OPTIONS.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="cover"
                      checked={coverId === c.id}
                      onChange={() => setCoverId(coverId === c.id ? null : c.id)}
                      className="accent-amber-600"
                    />
                    <span className="font-inter text-white/90 text-sm">
                      {t(c.nameKey)} — {t('coverPrice')}
                    </span>
                  </div>
                </label>
              ))}
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
                <input
                  type="radio"
                  name="cover"
                  checked={coverId === null}
                  onChange={() => setCoverId(null)}
                  className="accent-amber-600"
                />
                <span className="font-inter text-white/50 text-sm">—</span>
              </label>
            </div>

            {/* Recommendation */}
            <p className="font-inter text-amber-200/90 text-xs mb-4">
              {t('recommendationForYurt', {
                pillows: `${rec.pillowsMin}–${rec.pillowsMax}`,
                korpe: `${rec.korpeMin}–${rec.korpeMax}`,
              })}
            </p>

            {/* Pillows */}
            <div className="mb-4">
              <p className="font-inter text-white/80 text-sm mb-1">{t('pillows')}</p>
              <p className="font-inter text-white/50 text-xs mb-2">{t('pillowsDesc')}</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={PILLOWS_ADDON.maxQty}
                  value={pillowsQty}
                  onChange={(e) =>
                    setPillowsQty(
                      Math.min(
                        PILLOWS_ADDON.maxQty,
                        Math.max(0, parseInt(String(e.target.value), 10) || 0)
                      )
                    )
                  }
                  className="w-20 rounded border border-white/20 bg-white/5 px-2 py-2 text-white text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="font-inter text-white/50 text-xs">
                  ({PILLOWS_ADDON.minQty}–{PILLOWS_ADDON.maxQty})
                </span>
              </div>
            </div>

            {/* Körpe */}
            <div className="mb-4">
              <p className="font-inter text-white/80 text-sm mb-1">{t('korpe')}</p>
              <p className="font-inter text-white/50 text-xs mb-2">{t('korpeDesc')}</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={KORPE_ADDON.maxQty}
                  value={korpeQty}
                  onChange={(e) =>
                    setKorpeQty(
                      Math.min(
                        KORPE_ADDON.maxQty,
                        Math.max(0, parseInt(String(e.target.value), 10) || 0)
                      )
                    )
                  }
                  className="w-20 rounded border border-white/20 bg-white/5 px-2 py-2 text-white text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="font-inter text-white/50 text-xs">
                  ({KORPE_ADDON.minQty}–{KORPE_ADDON.maxQty})
                </span>
              </div>
            </div>

            {/* Bed */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={bed}
                onChange={(e) => setBed(e.target.checked)}
                className="accent-amber-600 rounded"
              />
              <span className="font-inter text-white/90 text-sm">{t('bed')}</span>
              <span className="font-inter text-white/50 text-xs ml-auto">
                {BED_ADDON.price_kzt.toLocaleString('ru-RU')} ₸
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleAddWithOptions}
              className="flex-1 min-w-[140px] py-3 px-6 rounded-lg font-inter text-sm font-medium uppercase tracking-wider bg-amber-600 text-white hover:bg-amber-500 transition-colors"
            >
              {t('addToCartWithOptions')}
            </button>
            <button
              type="button"
              onClick={handleYurtOnly}
              className="py-3 px-6 rounded-lg font-inter text-sm font-medium uppercase tracking-wider border border-white/40 text-white/90 hover:bg-white/10 transition-colors"
            >
              {t('addYurtOnly')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-lg font-inter text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
