'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
  getRecommendationForSlug,
  COVER_OPTIONS,
  PILLOWS_ADDON,
  KORPE_ADDON,
  BED_ADDON,
  type LogisticsOption,
} from '@/lib/yurtAddOns'
import type { KeregeColorOption } from '@/types/cart'

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
  photo?: string | null
}

type ApiAccessory = {
  id: string
  slug: string
  name: string
  description: string
  history: string
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
    keregeColor: KeregeColorOption
    customInterior: boolean
    note: string
  }) => void
  onClose: () => void
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-0">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-l-lg border border-[#d4c8b8] bg-[#f5f2ee] text-[#1a1714] text-lg font-light hover:bg-[#ede8e0] transition-colors touch-manipulation"
      >
        −
      </button>
      <div className="w-14 h-10 flex items-center justify-center border-t border-b border-[#d4c8b8] bg-white text-[#1a1714] font-inter text-sm font-medium">
        {value}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-r-lg border border-[#d4c8b8] bg-[#f5f2ee] text-[#1a1714] text-lg font-light hover:bg-[#ede8e0] transition-colors touch-manipulation"
      >
        +
      </button>
    </div>
  )
}

export function AddYurtModal({ yurt, locale, onConfirm, onClose }: Props) {
  const t = useTranslations('catalog')
  const rec = getRecommendationForSlug(yurt.slug)

  const [logistics, setLogistics] = useState<LogisticsOption>('air')
  const [coverId, setCoverId] = useState<string | null>(null)
  const [pillowsQty, setPillowsQty] = useState(rec.pillowsMin)
  const [korpeQty, setKorpeQty] = useState(rec.korpeMin)
  const [bed, setBed] = useState(false)
  const [keregeColor, setKeregeColor] = useState<KeregeColorOption>('natural')
  const [customInterior, setCustomInterior] = useState(false)
  const [note, setNote] = useState('')

  const [traditionalList, setTraditionalList] = useState<ApiAccessory[]>([])
  const [selectedTraditionalIds, setSelectedTraditionalIds] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loadingTraditional, setLoadingTraditional] = useState(true)

  const fetchTraditional = useCallback(async () => {
    setLoadingTraditional(true)
    try {
      const res = await fetch(`/api/accessories?locale=${locale}`)
      const data = await res.json()
      setTraditionalList((data.accessories || []) as ApiAccessory[])
    } catch (e) {
      console.error('Fetch accessories:', e)
    } finally {
      setLoadingTraditional(false)
    }
  }, [locale])

  useEffect(() => { fetchTraditional() }, [fetchTraditional])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const toggleTraditional = (id: string) => {
    setSelectedTraditionalIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const getSelectedTraditional = (): TraditionalAccessorySelected[] =>
    traditionalList
      .filter((a) => selectedTraditionalIds.includes(a.id))
      .map((a) => ({ id: a.id, name: a.name, slug: a.slug, price_usd: a.price_usd, photo: a.photos?.[0] ?? null }))

  // Calculate running total
  const addonsTotal =
    (pillowsQty >= PILLOWS_ADDON.minQty ? pillowsQty * PILLOWS_ADDON.price_usd_per_unit : 0) +
    (korpeQty >= KORPE_ADDON.minQty ? korpeQty * KORPE_ADDON.price_usd_per_unit : 0) +
    (bed ? BED_ADDON.price_usd : 0) +
    (coverId ? (COVER_OPTIONS.find((c) => c.id === coverId)?.price_usd ?? 0) : 0) +
    traditionalList
      .filter((a) => selectedTraditionalIds.includes(a.id))
      .reduce((s, a) => s + a.price_usd, 0)
  const total = yurt.price_usd + addonsTotal

  const handleConfirm = (withAddons: boolean) => {
    onConfirm({
      logistics,
      coverId: withAddons ? coverId : null,
      pillowsQty: withAddons && pillowsQty >= PILLOWS_ADDON.minQty ? pillowsQty : 0,
      korpeQty: withAddons && korpeQty >= KORPE_ADDON.minQty ? korpeQty : 0,
      bed: withAddons && bed,
      selectedTraditional: getSelectedTraditional(),
      keregeColor,
      customInterior,
      note: note.trim(),
    })
    onClose()
  }

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#a89578] mb-3 mt-1">{children}</p>
  )

  const Divider = () => <div className="border-t border-[#ede8e0] my-6" />

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto overflow-x-hidden overscroll-contain">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* ── MOBILE: full screen ── */}
      <div className="md:hidden relative z-10 flex flex-col bg-[#faf9f7] w-full min-h-0 h-[100dvh] max-h-[100dvh]">
        {/* Mobile header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-[#ede8e0] bg-[#faf9f7] pt-[max(1rem,env(safe-area-inset-top,0px))]">
          <div>
            <p className="font-garamond text-[#1a1714] text-xl leading-tight">{yurt.name}</p>
            <p className="font-inter text-[#a89578] text-xs mt-0.5">{t('addYurtModalSubtitle')}</p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#ede8e0] transition-colors text-[#1a1714]/60">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-6 pb-4">
            <MobileFormBody
              t={t} rec={rec} keregeColor={keregeColor} setKeregeColor={setKeregeColor}
              customInterior={customInterior} setCustomInterior={setCustomInterior}
              coverId={coverId} setCoverId={setCoverId}
              logistics={logistics} setLogistics={setLogistics}
              pillowsQty={pillowsQty} setPillowsQty={setPillowsQty}
              korpeQty={korpeQty} setKorpeQty={setKorpeQty}
              bed={bed} setBed={setBed}
              traditionalList={traditionalList} loadingTraditional={loadingTraditional}
              selectedTraditionalIds={selectedTraditionalIds} toggleTraditional={toggleTraditional}
              expandedId={expandedId} setExpandedId={setExpandedId}
              note={note} setNote={setNote}
            />
            <div className="h-32" />
          </div>
        </div>
        {/* Mobile footer */}
        <div className="shrink-0 border-t border-[#ede8e0] bg-[#faf9f7] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-inter text-[#a89578] text-xs uppercase tracking-wider">Total</span>
            <div className="text-right">
              <span className="font-garamond text-[#1a1714] text-2xl">${total.toLocaleString('en-US')}</span>
              {addonsTotal > 0 && <span className="font-inter text-[#a89578] text-xs ml-2">+ ${addonsTotal.toLocaleString('en-US')} add-ons</span>}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => handleConfirm(false)} className="py-3 px-4 rounded-xl border border-[#d4c8b8] text-[#1a1714]/70 font-inter text-xs uppercase tracking-wider hover:bg-[#ede8e0] transition-colors whitespace-nowrap">{t('addYurtOnly')}</button>
            <button type="button" onClick={() => handleConfirm(true)} className="flex-1 py-3 px-6 rounded-xl bg-[#1a1714] text-white font-inter text-sm font-medium uppercase tracking-wider hover:bg-[#2d2825] active:scale-[0.98] transition-all">{t('addToCartWithOptions')}</button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: split modal ── */}
      <div className="hidden md:flex relative z-10 bg-[#faf9f7] rounded-2xl shadow-2xl overflow-hidden min-h-0"
        style={{ width: 'min(960px, 94vw)', height: 'min(90vh, 860px)' }}>

        {/* Close button */}
        <button type="button" onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-[#1a1714]/60 hover:text-[#1a1714] shadow transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* LEFT: фото + сводка — прокручивается целиком (тач-свайп на планшетах) */}
        <div
          className="w-[300px] lg:w-[340px] shrink-0 flex flex-col bg-[#1a1714] relative min-h-0 h-full max-h-full overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
        >
          {/* Yurt photo */}
          <div className="flex-1 min-h-[160px] relative shrink-0">
            {yurt.photo ? (
              <Image src={yurt.photo} alt={yurt.name} fill className="object-cover opacity-80" sizes="340px" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#2d2825] to-[#1a1714]" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714] via-[#1a1714]/20 to-transparent" />
          </div>

          {/* Info panel at bottom */}
          <div className="shrink-0 p-7 relative z-10">
            <p className="font-inter text-[#a89578] text-[10px] uppercase tracking-[0.25em] mb-2">Configure your order</p>
            <h2 className="font-garamond text-white text-3xl leading-tight mb-1">{yurt.name}</h2>
            <p className="font-inter text-white/50 text-xs mb-6">{t('addYurtModalSubtitle')}</p>

            {/* Live price */}
            <div className="border-t border-white/10 pt-5">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-inter text-white/50 text-xs uppercase tracking-wider">Yurt</span>
                <span className="font-inter text-white/80 text-sm">${yurt.price_usd.toLocaleString('en-US')}</span>
              </div>
              {addonsTotal > 0 && (
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-inter text-white/50 text-xs uppercase tracking-wider">Add-ons</span>
                  <span className="font-inter text-white/80 text-sm">+${addonsTotal.toLocaleString('en-US')}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline mt-3 pt-3 border-t border-white/10">
                <span className="font-inter text-white/60 text-xs uppercase tracking-wider">Total</span>
                <span className="font-garamond text-white text-2xl">${total.toLocaleString('en-US')}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-5 flex flex-col gap-2">
              <button type="button" onClick={() => handleConfirm(true)}
                className="w-full py-3.5 rounded-xl bg-[#a89578] text-white font-inter text-sm font-medium uppercase tracking-wider hover:bg-[#c0ab90] active:scale-[0.98] transition-all">
                {t('addToCartWithOptions')}
              </button>
              <button type="button" onClick={() => handleConfirm(false)}
                className="w-full py-3 rounded-xl border border-white/20 text-white/60 font-inter text-xs uppercase tracking-wider hover:border-white/40 hover:text-white/80 transition-all">
                {t('addYurtOnly')}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: scrollable form */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]">
          <div className="px-8 py-7 pb-10">
        <MobileFormBody
              t={t} rec={rec} keregeColor={keregeColor} setKeregeColor={setKeregeColor}
              customInterior={customInterior} setCustomInterior={setCustomInterior}
              coverId={coverId} setCoverId={setCoverId}
              logistics={logistics} setLogistics={setLogistics}
              pillowsQty={pillowsQty} setPillowsQty={setPillowsQty}
              korpeQty={korpeQty} setKorpeQty={setKorpeQty}
              bed={bed} setBed={setBed}
              traditionalList={traditionalList} loadingTraditional={loadingTraditional}
              selectedTraditionalIds={selectedTraditionalIds} toggleTraditional={toggleTraditional}
              expandedId={expandedId} setExpandedId={setExpandedId}
              note={note} setNote={setNote}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Shared form body used in both mobile and desktop
function MobileFormBody({
  t, rec, keregeColor, setKeregeColor, customInterior, setCustomInterior,
  coverId, setCoverId, logistics, setLogistics,
  pillowsQty, setPillowsQty, korpeQty, setKorpeQty,
  bed, setBed, traditionalList, loadingTraditional,
  selectedTraditionalIds, toggleTraditional, expandedId, setExpandedId,
  note, setNote,
}: {
  t: ReturnType<typeof import('next-intl').useTranslations<'catalog'>>
  rec: { pillowsMin: number; pillowsMax: number; korpeMin: number; korpeMax: number }
  keregeColor: KeregeColorOption; setKeregeColor: (v: KeregeColorOption) => void
  customInterior: boolean; setCustomInterior: (v: boolean) => void
  coverId: string | null; setCoverId: (v: string | null) => void
  logistics: LogisticsOption; setLogistics: (v: LogisticsOption) => void
  pillowsQty: number; setPillowsQty: (v: number) => void
  korpeQty: number; setKorpeQty: (v: number) => void
  bed: boolean; setBed: (v: boolean) => void
  traditionalList: ApiAccessory[]; loadingTraditional: boolean
  selectedTraditionalIds: string[]; toggleTraditional: (id: string) => void
  expandedId: string | null; setExpandedId: (v: string | null) => void
  note: string; setNote: (v: string) => void
}) {
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#a89578] mb-3 mt-1">{children}</p>
  )
  const Divider = () => <div className="border-t border-[#ede8e0] my-6" />

  return (
    <>
      {/* ── INTERIOR ── */}
      <SectionLabel>{t('interiorOptionsTitle')}</SectionLabel>

          {/* ── INTERIOR ── */}
          <SectionLabel>{t('interiorOptionsTitle')}</SectionLabel>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {(['natural', 'blue', 'red', 'silver'] as KeregeColorOption[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setKeregeColor(opt)}
                className={`py-3 px-4 rounded-xl border text-left transition-all touch-manipulation ${
                  keregeColor === opt
                    ? 'border-[#a89578] bg-[#a89578]/10 ring-1 ring-[#a89578]'
                    : 'border-[#d4c8b8] bg-white hover:border-[#a89578]/60'
                }`}
              >
                <p className="font-inter text-[#1a1714] text-sm font-medium">
                  {t(`kerege_${opt}` as any)}
                </p>
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-[#d4c8b8] bg-white cursor-pointer hover:border-[#a89578]/60 transition-colors mb-2">
            <input type="checkbox" checked={customInterior} onChange={(e) => setCustomInterior(e.target.checked)} className="accent-amber-700 w-4 h-4" />
            <div>
              <p className="font-inter text-[#1a1714] text-sm">{t('customInterior')}</p>
              <p className="font-inter text-[#a89578] text-xs">{t('customInteriorNote')}</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-[#d4c8b8] bg-white cursor-pointer hover:border-[#a89578]/60 transition-colors">
            <input type="checkbox" checked={coverId !== null} onChange={(e) => setCoverId(e.target.checked ? 'default-white-cover' : null)} className="accent-amber-700 w-4 h-4" />
            <p className="font-inter text-[#1a1714] text-sm">{t('coverCustomOrder')}</p>
          </label>
          {coverId !== null && (
            <div className="flex gap-2 mt-2 ml-3">
              {COVER_OPTIONS.map((c) => (
                <label key={c.id} className={`flex items-center gap-2 py-2 px-3 rounded-lg border cursor-pointer text-sm transition-all ${coverId === c.id ? 'border-[#a89578] bg-[#a89578]/10' : 'border-[#d4c8b8] bg-white'}`}>
                  <input type="radio" name="coverType" checked={coverId === c.id} onChange={() => setCoverId(c.id)} className="accent-amber-700" />
                  <span className="font-inter text-[#1a1714] text-xs">{t(c.nameKey)}</span>
                </label>
              ))}
            </div>
          )}

          <Divider />

          {/* ── SHIPPING ── */}
          <SectionLabel>{t('logisticsTitle')}</SectionLabel>
          <div className="grid grid-cols-2 gap-3 mb-2">
            {([
              { key: 'air' as LogisticsOption, label: t('airShipping'), sub: '3–10 days' },
              { key: 'sea' as LogisticsOption, label: t('seaShipping'), sub: '30–60 days' },
            ]).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setLogistics(opt.key)}
                className={`py-3 px-4 rounded-xl border text-left transition-all touch-manipulation ${
                  logistics === opt.key
                    ? 'border-[#a89578] bg-[#a89578]/10 ring-1 ring-[#a89578]'
                    : 'border-[#d4c8b8] bg-white hover:border-[#a89578]/60'
                }`}
              >
                <p className="font-inter text-[#1a1714] text-sm font-medium">{opt.label}</p>
                <p className="font-inter text-[#a89578] text-xs mt-0.5">{opt.sub}</p>
              </button>
            ))}
          </div>

          <Divider />

          {/* ── INSTALLATION NOTE ── */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 mb-6">
            <p className="font-inter text-amber-900 text-xs leading-relaxed">{t('installationNote')}</p>
          </div>

          {/* ── ADD-ONS ── */}
          <SectionLabel>{t('addAccessoriesTitle')}</SectionLabel>
          <p className="font-inter text-[#a89578] text-xs mb-4">
            {t('recommendationForYurt', { pillows: `${rec.pillowsMin}–${rec.pillowsMax}`, korpe: `${rec.korpeMin}–${rec.korpeMax}` })}
          </p>

          {/* Pillows */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-[#d4c8b8] bg-white mb-3">
            <div className="flex-1 mr-4">
              <p className="font-inter text-[#1a1714] text-sm font-medium">{t('pillows')}</p>
              <p className="font-inter text-[#a89578] text-xs mt-0.5">${PILLOWS_ADDON.price_usd_per_unit} / pc</p>
            </div>
            <Stepper value={pillowsQty} min={0} max={PILLOWS_ADDON.maxQty} onChange={setPillowsQty} />
          </div>

          {/* Körpe */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-[#d4c8b8] bg-white mb-3">
            <div className="flex-1 mr-4">
              <p className="font-inter text-[#1a1714] text-sm font-medium">{t('korpe')}</p>
              <p className="font-inter text-[#a89578] text-xs mt-0.5">${KORPE_ADDON.price_usd_per_unit} / pc</p>
            </div>
            <Stepper value={korpeQty} min={0} max={KORPE_ADDON.maxQty} onChange={setKorpeQty} />
          </div>

          {/* Bed */}
          <button
            type="button"
            onClick={() => setBed(!bed)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all mb-3 touch-manipulation ${
              bed ? 'border-[#a89578] bg-[#a89578]/10 ring-1 ring-[#a89578]' : 'border-[#d4c8b8] bg-white hover:border-[#a89578]/60'
            }`}
          >
            <div className="text-left">
              <p className="font-inter text-[#1a1714] text-sm font-medium">{t('bed')}</p>
              <p className="font-inter text-[#a89578] text-xs mt-0.5">${BED_ADDON.price_usd}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${bed ? 'border-[#a89578] bg-[#a89578]' : 'border-[#d4c8b8]'}`}>
              {bed && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          <Divider />

          {/* ── TRADITIONAL ACCESSORIES ── */}
          <SectionLabel>{t('traditionalAccessoriesTitle')}</SectionLabel>
          <p className="font-inter text-[#1a1714]/60 text-xs mb-4">{t('traditionalAccessoriesSubtitle')}</p>

          {loadingTraditional ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl bg-[#ede8e0] animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {traditionalList.map((acc) => {
                const photo = acc.photos?.[0]
                const isSelected = selectedTraditionalIds.includes(acc.id)
                const isExpanded = expandedId === acc.id
                return (
                  <div
                    key={acc.id}
                    className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#a89578] ring-2 ring-[#a89578] shadow-md'
                        : 'border-[#d4c8b8] hover:border-[#a89578]/60'
                    }`}
                    onClick={() => toggleTraditional(acc.id)}
                  >
                    {/* Photo */}
                    <div className="relative aspect-square bg-[#ede8e0]">
                      {photo ? (
                        <Image src={photo} alt={acc.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#a89578]">
                          <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#a89578] flex items-center justify-center shadow">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-2.5 bg-white">
                      <p className="font-inter text-[#1a1714] text-xs font-medium leading-snug">{acc.name}</p>
                      <p className="font-inter text-[#a89578] text-xs mt-0.5">${acc.price_usd}</p>
                      {acc.history && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : acc.id) }}
                          className="font-inter text-[10px] uppercase tracking-wider text-[#a89578] hover:text-[#1a1714] mt-1 transition-colors"
                        >
                          {isExpanded ? t('historyHide') : t('historyShow')} →
                        </button>
                      )}
                      {isExpanded && (
                        <p className="font-inter text-[#1a1714]/60 text-xs mt-1 leading-relaxed" onClick={(e) => e.stopPropagation()}>
                          {acc.history}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <Divider />

          {/* ── NOTE ── */}
          <SectionLabel>{t('messageOptional')}</SectionLabel>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('messagePlaceholder')}
            rows={3}
            className="w-full rounded-xl border border-[#d4c8b8] bg-white px-4 py-3 text-[#1a1714] text-sm font-inter placeholder:text-[#a89578]/60 resize-none focus:outline-none focus:border-[#a89578] transition-colors"
          />

    </>
  )
}
