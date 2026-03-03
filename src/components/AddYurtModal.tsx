'use client'

import { useState, useEffect, useCallback } from 'react'
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
import type { FloorWallsOption } from '@/types/cart'

const formatNumber = (num: number): string =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

type YurtForModal = {
  id: string
  name: string
  slug: string
  price_usd: number
  supplier_id: string
  photo?: string | null
}

export type TraditionalAccessorySelected = {
  id: string
  name: string
  slug: string
  price_usd: number
  price_kzt: number
  photo?: string | null
}

type ApiAccessory = {
  id: string
  slug: string
  name: string
  description: string
  history: string
  price_kzt: number
  price_usd: number
  photos?: string[]
}

type Props = {
  yurt: YurtForModal
  locale: string
  onConfirm: (opts: {
    logistics: LogisticsOption
    coverId: string | null
    pillowsQty: number
    korpeQty: number
    bed: boolean
    selectedTraditional: TraditionalAccessorySelected[]
    floorWalls: FloorWallsOption
    customInterior: boolean
    note: string
  }) => void
  onClose: () => void
}

export function AddYurtModal({ yurt, locale, onConfirm, onClose }: Props) {
  const t = useTranslations('catalog')
  const rec = getRecommendationForSlug(yurt.slug)

  const [logistics, setLogistics] = useState<LogisticsOption>('air')
  const [coverId, setCoverId] = useState<string | null>(null)
  const [pillowsQty, setPillowsQty] = useState(rec.pillowsMin)
  const [korpeQty, setKorpeQty] = useState(rec.korpeMin)
  const [bed, setBed] = useState(false)
  const [floorWalls, setFloorWalls] = useState<FloorWallsOption>('felt')
  const [customInterior, setCustomInterior] = useState(false)
  const [note, setNote] = useState('')

  const [traditionalList, setTraditionalList] = useState<ApiAccessory[]>([])
  const [selectedTraditionalIds, setSelectedTraditionalIds] = useState<string[]>([])
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null)
  const [loadingTraditional, setLoadingTraditional] = useState(true)

  const fetchTraditional = useCallback(async () => {
    setLoadingTraditional(true)
    try {
      const res = await fetch(`/api/accessories?locale=${locale}`)
      const data = await res.json()
      const list = (data.accessories || []) as ApiAccessory[]
      setTraditionalList(list)
    } catch (e) {
      console.error('Fetch accessories:', e)
    } finally {
      setLoadingTraditional(false)
    }
  }, [locale])

  useEffect(() => {
    fetchTraditional()
  }, [fetchTraditional])

  const toggleTraditional = (id: string) => {
    setSelectedTraditionalIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleHistory = (id: string) => {
    setExpandedHistoryId((prev) => (prev === id ? null : id))
  }

  const getSelectedTraditional = (): TraditionalAccessorySelected[] =>
    traditionalList
      .filter((a) => selectedTraditionalIds.includes(a.id))
      .map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        price_usd: a.price_usd,
        price_kzt: a.price_kzt,
        photo: a.photos?.[0] ?? null,
      }))

  const handleAddWithOptions = () => {
    onConfirm({
      logistics,
      coverId,
      pillowsQty: pillowsQty >= PILLOWS_ADDON.minQty ? pillowsQty : 0,
      korpeQty: korpeQty >= KORPE_ADDON.minQty ? korpeQty : 0,
      bed,
      selectedTraditional: getSelectedTraditional(),
      floorWalls,
      customInterior,
      note: note.trim(),
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
      selectedTraditional: getSelectedTraditional(),
      floorWalls,
      customInterior,
      note: note.trim(),
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[rgba(168,149,120,0.2)]"
        style={{ background: 'var(--beige-deep, #7a6a54)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <h2 className="font-garamond text-[#1a1714] text-2xl md:text-3xl mb-1">
            {t('addYurtModalTitle')}
          </h2>
          <p className="font-inter text-[#1a1714]/85 text-sm mb-6">{yurt.name}</p>
          <p className="font-inter text-[#1a1714]/65 text-xs mb-6">{t('addYurtModalSubtitle')}</p>

          {/* Interior options */}
          <div className="mb-6">
            <p className="font-inter text-[#1a1714] text-sm font-semibold mb-3">
              {t('interiorOptionsTitle')}
            </p>
            <div className="border-t border-[rgba(26,23,20,0.2)] pt-3 space-y-3">
              <p className="font-inter text-[#1a1714]/70 text-xs uppercase tracking-wider">
                {t('floorWallsTitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-[#1a1714]/90 font-inter text-sm">
                  <input
                    type="radio"
                    name="floorWalls"
                    checked={floorWalls === 'felt'}
                    onChange={() => setFloorWalls('felt')}
                    className="accent-amber-700"
                  />
                  {t('floorFelt')}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#1a1714]/90 font-inter text-sm">
                  <input
                    type="radio"
                    name="floorWalls"
                    checked={floorWalls === 'carpolan'}
                    onChange={() => setFloorWalls('carpolan')}
                    className="accent-amber-700"
                  />
                  {t('floorCarpolan')}
                </label>
              </div>
              <p className="font-inter text-[#1a1714]/70 text-xs uppercase tracking-wider mt-4">
                {t('furnitureTitle')}
              </p>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customInterior}
                  onChange={(e) => setCustomInterior(e.target.checked)}
                  className="accent-amber-700 rounded mt-0.5"
                />
                <span className="font-inter text-[#1a1714]/90 text-sm">{t('customInterior')}</span>
              </label>
              <p className="font-inter text-[#1a1714]/55 text-xs ml-6">{t('customInteriorNote')}</p>
              <label className="flex items-center gap-3 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={coverId !== null}
                  onChange={(e) => setCoverId(e.target.checked ? 'default-white-cover' : null)}
                  className="accent-amber-700 rounded"
                />
                <span className="font-inter text-[#1a1714]/90 text-sm">{t('coverCustomOrder')}</span>
                <span className="font-inter text-[#1a1714]/60 text-xs ml-auto">
                  — {t('coverPaidSeparately')}
                </span>
              </label>
              {coverId !== null && (
                <div className="ml-6 flex gap-2">
                  {COVER_OPTIONS.map((c) => (
                    <label key={c.id} className="flex items-center gap-1 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="coverType"
                        checked={coverId === c.id}
                        onChange={() => setCoverId(c.id)}
                        className="accent-amber-700"
                      />
                      {t(c.nameKey)}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Installation */}
          <div className="mb-6 p-4 rounded-lg bg-[rgba(26,23,20,0.12)] border border-[rgba(26,23,20,0.15)]">
            <p className="font-inter text-[#1a1714]/85 text-sm leading-relaxed">{t('installationNote')}</p>
          </div>

          {/* Logistics */}
          <div className="mb-6">
            <p className="font-inter text-[#1a1714]/70 text-xs uppercase tracking-wider mb-3">
              {t('logisticsTitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-[#1a1714]/90 font-inter text-sm">
                <input
                  type="radio"
                  name="logistics"
                  checked={logistics === 'air'}
                  onChange={() => setLogistics('air')}
                  className="accent-amber-700"
                />
                {t('airShipping')}
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#1a1714]/90 font-inter text-sm">
                <input
                  type="radio"
                  name="logistics"
                  checked={logistics === 'sea'}
                  onChange={() => setLogistics('sea')}
                  className="accent-amber-700"
                />
                {t('seaShipping')}
              </label>
            </div>
          </div>

          {/* Accessories */}
          <div className="mb-6">
            <p className="font-inter text-[#1a1714]/70 text-xs uppercase tracking-wider mb-3">
              {t('addAccessoriesTitle')}
            </p>

            {/* Recommendation */}
            <p className="font-inter text-amber-900/90 text-xs mb-4">
              {t('recommendationForYurt', {
                pillows: `${rec.pillowsMin}–${rec.pillowsMax}`,
                korpe: `${rec.korpeMin}–${rec.korpeMax}`,
              })}
            </p>

            {/* Pillows */}
            <div className="mb-4">
              <p className="font-inter text-[#1a1714]/85 text-sm mb-1">{t('pillows')}</p>
              <p className="font-inter text-[#1a1714]/55 text-xs mb-2">{t('pillowsDesc')}</p>
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
                  className="w-20 rounded border border-[rgba(26,23,20,0.3)] bg-[rgba(26,23,20,0.08)] px-2 py-2 text-[#1a1714] text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="font-inter text-[#1a1714]/55 text-xs">
                  ({PILLOWS_ADDON.minQty}–{PILLOWS_ADDON.maxQty})
                </span>
              </div>
            </div>

            {/* Körpe */}
            <div className="mb-4">
              <p className="font-inter text-[#1a1714]/85 text-sm mb-1">{t('korpe')}</p>
              <p className="font-inter text-[#1a1714]/55 text-xs mb-2">{t('korpeDesc')}</p>
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
                  className="w-20 rounded border border-[rgba(26,23,20,0.3)] bg-[rgba(26,23,20,0.08)] px-2 py-2 text-[#1a1714] text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="font-inter text-[#1a1714]/55 text-xs">
                  ({KORPE_ADDON.minQty}–{KORPE_ADDON.maxQty})
                </span>
              </div>
            </div>

            {/* Bed */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-[rgba(26,23,20,0.2)] hover:bg-[rgba(26,23,20,0.08)] cursor-pointer">
              <input
                type="checkbox"
                checked={bed}
                onChange={(e) => setBed(e.target.checked)}
                className="accent-amber-700 rounded"
              />
              <span className="font-inter text-[#1a1714]/90 text-sm">{t('bed')}</span>
              <span className="font-inter text-[#1a1714]/55 text-xs ml-auto">
                {BED_ADDON.price_kzt.toLocaleString('ru-RU')} ₸
              </span>
            </label>
          </div>

          {/* Traditional accessories */}
          <div className="mb-6 p-4 rounded-lg bg-[rgba(26,23,20,0.12)] border border-[rgba(26,23,20,0.15)]">
            <p className="font-inter text-[#1a1714] text-sm font-medium mb-1">
              {t('traditionalAccessoriesTitle')}
            </p>
            <p className="font-inter text-[#1a1714]/65 text-xs mb-4">
              {t('traditionalAccessoriesSubtitle')}
            </p>
            {loadingTraditional ? (
              <p className="font-inter text-[#1a1714]/55 text-sm">{t('loadingAccessories')}</p>
            ) : (
              <ul className="space-y-3">
                {traditionalList.map((acc) => (
                  <li key={acc.id} className="border-b border-[rgba(26,23,20,0.15)] last:border-0 pb-3 last:pb-0">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTraditionalIds.includes(acc.id)}
                        onChange={() => toggleTraditional(acc.id)}
                        className="accent-amber-700 rounded mt-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-inter text-[#1a1714]/90 text-sm">{acc.name}</span>
                        <p className="font-inter text-[#1a1714]/55 text-xs mt-0.5">{acc.description}</p>
                        <p className="font-inter text-amber-900/90 text-xs mt-1">
                          {formatNumber(acc.price_kzt)} T / ${acc.price_usd}
                        </p>
                        {acc.history && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleHistory(acc.id)
                              }}
                              className="font-inter text-xs uppercase tracking-wider text-amber-800 hover:text-amber-900"
                            >
                              {expandedHistoryId === acc.id ? t('historyHide') : t('historyShow')} →
                            </button>
                            {expandedHistoryId === acc.id && (
                              <p className="font-inter text-[#1a1714]/55 text-xs mt-1 leading-relaxed">
                                {acc.history}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Message (optional) */}
          <div className="mb-6">
            <p className="font-inter text-[#1a1714]/70 text-xs uppercase tracking-wider mb-2">
              {t('messageOptional')}
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('messagePlaceholder')}
              rows={3}
              className="w-full rounded border border-[rgba(26,23,20,0.3)] bg-[rgba(26,23,20,0.08)] px-3 py-2 text-[#1a1714] text-sm font-inter placeholder:text-[#1a1714]/40 resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[rgba(26,23,20,0.2)]">
            <button
              type="button"
              onClick={handleAddWithOptions}
              className="flex-1 min-w-[140px] py-3 px-6 rounded-lg font-inter text-sm font-medium uppercase tracking-wider bg-amber-700 text-[#1a1714] hover:bg-amber-600 transition-colors"
            >
              {t('addToCartWithOptions')}
            </button>
            <button
              type="button"
              onClick={handleYurtOnly}
              className="py-3 px-6 rounded-lg font-inter text-sm font-medium uppercase tracking-wider border border-[rgba(26,23,20,0.4)] text-[#1a1714]/90 hover:bg-[rgba(26,23,20,0.1)] transition-colors"
            >
              {t('addYurtOnly')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-lg font-inter text-sm text-[#1a1714]/60 hover:text-[#1a1714]/90 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
