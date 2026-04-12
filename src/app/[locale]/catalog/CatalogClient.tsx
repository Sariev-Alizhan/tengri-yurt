'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatPrice } from '@/utils/formatPrice'
import { useCart } from '@/components/CartContext'
import { PriceUsdKzt } from '@/components/PriceUsdKzt'
import { AddYurtModal, type TraditionalAccessorySelected } from '@/components/AddYurtModal'
import { RentModal } from '@/components/RentModal'
import { COVER_OPTIONS, PILLOWS_ADDON, KORPE_ADDON, BED_ADDON } from '@/lib/yurtAddOns'

export type SupplierRelation = { company_name: string } | { company_name: string }[] | null

export type Yurt = {
  id: string
  name: string
  slug: string
  diameter_m: number
  kanat: number
  capacity_min: number
  capacity_max: number
  price_usd: number
  price_usd_max?: number | null
  rental_price_usd?: number | null
  production_days_min: number
  production_days_max: number
  description: string | null
  photos: string[] | null
  supplier_id?: string
  suppliers?: SupplierRelation
}

export type Accessory = {
  id: string
  name: string
  slug: string
  category: string
  description: string | null
  price_usd: number | null
  stock_quantity: number
  photos: string[] | null
  supplier_id?: string
  name_i18n?: Record<string, string> | null
  suppliers?: SupplierRelation
}

export function CatalogClient({
  yurts,
  accessories,
  locale,
}: {
  yurts: Yurt[]
  accessories: Accessory[]
  locale: string
}) {
  const t = useTranslations('catalog')
  const { addYurt, addAccessory } = useCart()
  const yurtNames = (t.raw('yurtNames') as Record<string, string> | undefined) ?? {}
  const [activeTab, setActiveTab] = useState<'yurts' | 'accessories'>('yurts')
  const [filter, setFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all')
  const [accessoryFilter, setAccessoryFilter] = useState<'all' | 'carpet' | 'furniture' | 'cover' | 'other'>('all')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [modalYurt, setModalYurt] = useState<Yurt | null>(null)
  const [rentYurt, setRentYurt] = useState<Yurt | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'all') return yurts
    if (filter === 'small') return yurts.filter(y => y.diameter_m <= 5)
    if (filter === 'medium') return yurts.filter(y => y.diameter_m > 5 && y.diameter_m <= 7)
    if (filter === 'large') return yurts.filter(y => y.diameter_m > 7)
    return yurts
  }, [yurts, filter])

  const filteredAccessories = useMemo(() => {
    if (accessoryFilter === 'all') return accessories
    return accessories.filter(a => a.category === accessoryFilter)
  }, [accessories, accessoryFilter])

  const getPhoto = (yurt: Yurt) => {
    const first = yurt.photos?.[0]
    return first || '/images/background.jpg'
  }

  const getSupplierDisplayName = (suppliers: SupplierRelation | undefined): string => {
    if (suppliers == null) return t('defaultSupplier')
    const company = Array.isArray(suppliers) ? suppliers?.[0]?.company_name : (suppliers as { company_name?: string })?.company_name
    return company ?? t('defaultSupplier')
  }

  const filters = [
    { key: 'all' as const, label: t('filterAll') },
    { key: 'small' as const, label: '≤ 5m' },
    { key: 'medium' as const, label: '5–7m' },
    { key: 'large' as const, label: '7m+' },
  ]

  const handleAddYurtConfirm = (opts: {
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
    if (!modalYurt) return
    const supplierId = modalYurt.supplier_id ?? 'default'
    const addons: { id: string; name: string; slug: string; price_usd: number; quantity: number }[] = []
    if (opts.coverId) {
      const cover = COVER_OPTIONS.find((c) => c.id === opts.coverId)
      if (cover) addons.push({ id: cover.id, name: t(cover.nameKey as 'coverWhite'), slug: cover.slug, price_usd: cover.price_usd, quantity: 1 })
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
      id: modalYurt.id,
      name: yurtNames[modalYurt.slug] || modalYurt.name,
      slug: modalYurt.slug,
      price_usd: modalYurt.price_usd,
      quantity: 1,
      photo: modalYurt.photos?.[0] ?? null,
      supplier_id: supplierId,
      logistics: opts.logistics,
      keregeColor: opts.keregeColor,
      customInterior: opts.customInterior,
      note: opts.note || undefined,
      addons: addons.length > 0 ? addons : undefined,
    })
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>

      {rentYurt && (
        <RentModal
          yurtId={rentYurt.id}
          yurtSlug={rentYurt.slug}
          yurtName={yurtNames[rentYurt.slug] || rentYurt.name}
          rentalPrice={rentYurt.rental_price_usd}
          supplierId={rentYurt.supplier_id ?? 'default'}
          photo={rentYurt.photos?.[0] ?? null}
          locale={locale}
          onClose={() => setRentYurt(null)}
        />
      )}

      {modalYurt && (
        <AddYurtModal
          yurt={{
            id: modalYurt.id,
            name: yurtNames[modalYurt.slug] || modalYurt.name,
            slug: modalYurt.slug,
            price_usd: modalYurt.price_usd,
            supplier_id: modalYurt.supplier_id ?? 'default',
            photo: modalYurt.photos?.[0] ?? null,
          }}
          locale={locale}
          onConfirm={handleAddYurtConfirm}
          onClose={() => setModalYurt(null)}
        />
      )}

      {/* ─── ФОН — background.jpg на всю страницу (не блокирует клики) ─── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: 'url(/images/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }} />

      {/* Тёплый оверлей поверх фона */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(90,70,50,0.72) 0%, rgba(70,52,36,0.82) 100%)',
      }} />

      {/* ─── КОНТЕНТ ─── */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* Spacer под navbar */}
        <div style={{ height: 'clamp(100px, 15vw, 140px)' }} />

        {/* ─── ЗАГОЛОВОК СЕКЦИИ ─── */}
        <div style={{
          textAlign: 'center',
          padding: '0 clamp(20px, 5vw, 48px)',
          marginBottom: 'clamp(16px, 3vw, 24px)',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(9px, 1.2vw, 11px)',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            TENGRI YURT
          </p>
          <h1 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(38px, 8vw, 96px)',
            color: 'rgba(255,255,255,0.93)',
            fontWeight: 400,
            lineHeight: 1,
            marginBottom: '16px',
          }}>
            {t('title')}
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(10px, 1.5vw, 12px)',
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.38)',
            textTransform: 'uppercase',
          }}>
            {t('subtitle')}
          </p>
        </div>

        {/* ─── Вкладки: Юрты | Аксессуары ─── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0',
          marginBottom: 'clamp(24px, 4vw, 40px)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          padding: '0 clamp(16px, 4vw, 48px)',
        }}>
          {(['yurts', 'accessories'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
              style={{
                padding: 'clamp(14px, 2.5vw, 16px) clamp(20px, 4vw, 24px)',
                minHeight: '44px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(11px, 1.5vw, 12px)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: activeTab === tab ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid rgba(168,149,120,0.8)' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1px',
                touchAction: 'manipulation',
              }}
            >
              {tab === 'yurts' ? t('yurtsTab') : t('accessoriesTab')}
            </button>
          ))}
        </div>

        {activeTab === 'accessories' ? (
          <>
            {/* ─── РАЗДЕЛИТЕЛЬ ─── */}
            <div style={{
              width: '1px',
              height: 'clamp(40px, 6vw, 64px)',
              background: 'rgba(255,255,255,0.2)',
              margin: '0 auto',
              marginBottom: 'clamp(32px, 5vw, 56px)',
            }} />

            {/* ─── ФИЛЬТРЫ КАТЕГОРИЙ ─── */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(8px, 2vw, 20px)',
              padding: '0 clamp(20px, 5vw, 48px)',
              marginBottom: 'clamp(40px, 7vw, 80px)',
              flexWrap: 'wrap',
            }}>
              {[
                { key: 'all' as const, label: t('filterAll') },
                { key: 'carpet' as const, label: t('categoryCarpet') },
                { key: 'furniture' as const, label: t('categoryFurniture') },
                { key: 'cover' as const, label: t('categoryCover') },
                { key: 'other' as const, label: t('categoryOther') },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={(e) => { e.stopPropagation(); setAccessoryFilter(f.key); }}
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: accessoryFilter === f.key
                      ? '1px solid rgba(255,255,255,0.8)'
                      : '1px solid rgba(255,255,255,0.2)',
                    color: accessoryFilter === f.key
                      ? 'rgba(255,255,255,0.95)'
                      : 'rgba(255,255,255,0.45)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(9px, 1.2vw, 11px)',
                    fontWeight: accessoryFilter === f.key ? 500 : 300,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    padding: 'clamp(10px, 2vw, 12px) clamp(14px, 3vw, 28px)',
                    minHeight: '44px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    touchAction: 'manipulation',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* ─── СЧЁТЧИК РЕЗУЛЬТАТОВ ─── */}
            <div style={{
              textAlign: 'center',
              marginBottom: 'clamp(24px, 4vw, 40px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
            }}>
              {filteredAccessories.length} {filteredAccessories.length === 1 ? 'item' : 'items'}
            </div>

            {/* ─── ГРИД КАРТОЧЕК АКСЕССУАРОВ ─── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
              gap: 'clamp(8px, 1.5vw, 16px)',
              padding: '0 clamp(16px, 4vw, 48px)',
              maxWidth: '1600px',
              margin: '0 auto',
            }}>
              {filteredAccessories.map((accessory, index) => (
                <AccessoryCard
                  key={accessory.id}
                  accessory={accessory}
                  displayName={(accessory.name_i18n && accessory.name_i18n[locale]) || accessory.name}
                  locale={locale}
                  photo={accessory.photos?.[0] || '/images/background.jpg'}
                  isHovered={hoveredId === accessory.id}
                  onHover={() => setHoveredId(accessory.id)}
                  onLeave={() => setHoveredId(null)}
                  index={index}
                  t={t}
                  supplierName={getSupplierDisplayName(accessory.suppliers)}
                  addToCart={() => addAccessory({ id: accessory.id, name: accessory.name, slug: accessory.slug, price_usd: accessory.price_usd, quantity: 1, photo: accessory.photos?.[0] ?? null, supplier_id: accessory.supplier_id ?? 'default' })}
                  addToCartLabel={t('addToCart')}
                />
              ))}
            </div>

            {/* Пустой каталог */}
            {filteredAccessories.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: 'clamp(60px, 10vw, 120px) 24px',
                fontFamily: 'EB Garamond, serif',
                fontSize: 'clamp(20px, 4vw, 32px)',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 400,
              }}>
                {t('accessoriesPlaceholder')}
              </div>
            )}

            {/* Footer spacer */}
            <div style={{ height: 'clamp(60px, 10vw, 120px)' }} />
          </>
        ) : (
          <>
        {/* ─── РАЗДЕЛИТЕЛЬ ─── */}
        <div style={{
          width: '1px',
          height: 'clamp(40px, 6vw, 64px)',
          background: 'rgba(255,255,255,0.2)',
          margin: '0 auto',
          marginBottom: 'clamp(32px, 5vw, 56px)',
        }} />

        {/* ─── ФИЛЬТРЫ ─── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(8px, 2vw, 20px)',
          padding: '0 clamp(20px, 5vw, 48px)',
          marginBottom: 'clamp(40px, 7vw, 80px)',
          flexWrap: 'wrap',
        }}>
          {filters.map(f => (
            <button
              key={f.key}
              onClick={(e) => { e.stopPropagation(); setFilter(f.key); }}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: filter === f.key
                  ? '1px solid rgba(255,255,255,0.8)'
                  : '1px solid rgba(255,255,255,0.2)',
                color: filter === f.key
                  ? 'rgba(255,255,255,0.95)'
                  : 'rgba(255,255,255,0.45)',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(9px, 1.2vw, 11px)',
                fontWeight: filter === f.key ? 500 : 300,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: 'clamp(10px, 2vw, 12px) clamp(14px, 3vw, 28px)',
                minHeight: '44px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                appearance: 'none',
                WebkitAppearance: 'none',
                touchAction: 'manipulation',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ─── СЧЁТЧИК РЕЗУЛЬТАТОВ ─── */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(24px, 4vw, 40px)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
        }}>
          {filtered.length} {filtered.length === 1 ? 'model' : 'models'}
        </div>

        {/* ─── ГРИД КАРТОЧЕК ─── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
          gap: 'clamp(8px, 1.5vw, 16px)',
          padding: '0 clamp(16px, 4vw, 48px)',
          maxWidth: '1600px',
          margin: '0 auto',
        }}>
          {filtered.map((yurt, index) => (
            <YurtCard
              key={yurt.id}
              yurt={yurt}
              displayName={yurtNames[yurt.slug] || yurt.name}
              locale={locale}
              photo={getPhoto(yurt)}
              isHovered={hoveredId === yurt.id}
              onHover={() => setHoveredId(yurt.id)}
              onLeave={() => setHoveredId(null)}
              index={index}
              t={t}
              supplierName={getSupplierDisplayName(yurt.suppliers)}
              onRent={() => setRentYurt(yurt)}
              rentLabel={t('rent')}
              rentalPrice={yurt.rental_price_usd}
            />
          ))}
        </div>

        {/* Пустой каталог */}
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'clamp(60px, 10vw, 120px) 24px',
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(20px, 4vw, 32px)',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 400,
          }}>
            {t('noYurts')}
          </div>
        )}

        {/* Footer spacer */}
        <div style={{ height: 'clamp(60px, 10vw, 120px)' }} />
          </>
        )}
      </div>
    </div>
  )
}

/* ─── КОМПОНЕНТ КАРТОЧКИ ЮРТЫ ─── */
function YurtCard({
  yurt, displayName, locale, photo, isHovered, onHover, onLeave, index, t, supplierName, onRent, rentLabel, rentalPrice,
}: {
  yurt: Yurt
  displayName: string
  locale: string
  photo: string
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  index: number
  t: ReturnType<typeof useTranslations<'catalog'>>
  supplierName: string
  onRent: () => void
  rentLabel: string
  rentalPrice?: number | null
}) {
  const productionLabel = yurt.production_days_min === yurt.production_days_max
    ? `${yurt.production_days_min}d`
    : `${yurt.production_days_min}–${yurt.production_days_max}d`

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        background: isHovered
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(0,0,0,0.25)',
        transition: 'background 0.4s ease',
        animation: 'cardReveal 0.6s ease forwards',
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <Link
        href={`/yurt/${yurt.slug}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
      {/* Фото юрты */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '72%',
        overflow: 'hidden',
      }}>
        <img
          src={photo}
          alt={yurt.name}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            filter: isHovered ? 'brightness(0.85)' : 'brightness(0.75)',
          }}
        />

        {/* Номер модели */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Цена — верхний правый */}
        {yurt.price_usd > 0 && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(15px, 2vw, 19px)',
            color: 'rgba(255,255,255,0.95)',
            fontWeight: 500,
            letterSpacing: '0.03em',
            background: 'rgba(0,0,0,0.4)',
            padding: '8px 14px',
            borderRadius: '8px',
            backdropFilter: 'blur(6px)',
            textAlign: 'right',
          }}>
            <PriceUsdKzt usd={yurt.price_usd} usdMax={yurt.price_usd_max} fromPrefix />
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              margin: '4px 0 0',
              lineHeight: 1.2,
            }}>
              {t('customPricing')}
            </p>
          </div>
        )}

        {/* Градиент снизу */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
        }} />

        {/* Название на фото */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          right: '24px',
        }}>
          <h2 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(22px, 3.5vw, 34px)',
            color: 'rgba(255,255,255,0.95)',
            fontWeight: 400,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            {displayName}
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(10px, 1.3vw, 12px)',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '6px',
          }}>
            Ø {yurt.diameter_m}m · {yurt.kanat} {t('kanat')}
          </p>
        </div>
      </div>
      </Link>

      {/* ─── НИЖНЯЯ ЧАСТЬ: характеристики, поставщик, кнопки ─── */}
      <div style={{
        padding: 'clamp(16px, 2.5vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Характеристики в одну строку */}
        <div style={{
          display: 'flex',
          gap: 'clamp(20px, 4vw, 32px)',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: 0, marginBottom: '2px' }}>
              {t('filterCapacity')}
            </p>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(15px, 1.8vw, 20px)', color: 'rgba(255,255,255,0.9)', fontWeight: 400, margin: 0 }}>
              {yurt.capacity_min}–{yurt.capacity_max}
            </p>
          </div>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: 0, marginBottom: '2px' }}>
              {t('productionDays')}
            </p>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(15px, 1.8vw, 20px)', color: 'rgba(255,255,255,0.9)', fontWeight: 400, margin: 0 }}>
              {productionLabel}
            </p>
          </div>
        </div>

        {supplierName && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: 0 }}>
            {t('supplierBy', { name: supplierName })}
          </p>
        )}

        {/* Кнопки */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginTop: '4px',
        }}>
          <a
            href={`https://wa.me/77477777888?text=${encodeURIComponent(`Hi, I'm interested in ${displayName}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation(); }}
            style={{
              height: '44px',
              padding: '0 12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.5)',
              color: 'rgba(255,255,255,0.98)',
              background: 'rgba(255,255,255,0.12)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            {t('inquire')}
          </a>
          <Link
            href={`/yurt/${yurt.slug}`}
            style={{
              gridColumn: '1 / -1',
              height: '44px',
              padding: '0 16px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.4)',
              color: 'rgba(255,255,255,0.98)',
              background: 'transparent',
              transition: 'all 0.2s ease',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            {t('viewDetails')}
          </Link>
        </div>
      </div>

      {/* Hover линия снизу */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0,
        height: '2px',
        width: isHovered ? '100%' : '0%',
        background: 'rgba(255,255,255,0.4)',
        transition: 'width 0.4s ease',
      }} />

    </div>
  )
}

/* ─── КОМПОНЕНТ КАРТОЧКИ АКСЕССУАРА ─── */
function AccessoryCard({
  accessory, displayName, locale, photo, isHovered, onHover, onLeave, index, t, supplierName, addToCart, addToCartLabel
}: {
  accessory: Accessory
  displayName: string
  locale: string
  photo: string
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  index: number
  t: ReturnType<typeof useTranslations<'catalog'>>
  supplierName: string
  addToCart: () => void
  addToCartLabel: string
}) {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      carpet: t('categoryCarpet'),
      furniture: t('categoryFurniture'),
      cover: t('categoryCover'),
      other: t('categoryOther'),
    }
    return labels[category] || category
  }

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        background: isHovered
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(0,0,0,0.25)',
        transition: 'background 0.4s ease',
        animation: 'cardReveal 0.6s ease forwards',
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <Link
        href={`/accessory/${accessory.slug}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
      {/* Фото аксессуара */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '72%',
        overflow: 'hidden',
      }}>
        <img
          src={photo}
          alt={accessory.name}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            filter: isHovered ? 'brightness(0.85)' : 'brightness(0.75)',
          }}
        />

        {/* Номер */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Цена — верхний правый */}
        {accessory.price_usd != null && accessory.price_usd > 0 && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(15px, 2vw, 19px)',
            color: 'rgba(255,255,255,0.95)',
            fontWeight: 500,
            letterSpacing: '0.03em',
            background: 'rgba(0,0,0,0.4)',
            padding: '8px 14px',
            borderRadius: '8px',
            backdropFilter: 'blur(6px)',
          }}>
            <PriceUsdKzt usd={accessory.price_usd} />
          </div>
        )}

        {/* Градиент снизу */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
        }} />

        {/* Название на фото */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          right: '24px',
        }}>
          <h2 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(22px, 3.5vw, 34px)',
            color: 'rgba(255,255,255,0.95)',
            fontWeight: 400,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            {displayName}
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(10px, 1.3vw, 12px)',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '6px',
          }}>
            {getCategoryLabel(accessory.category)}
          </p>
        </div>
      </div>
      </Link>

      {/* ─── НИЖНЯЯ ЧАСТЬ: наличие, поставщик, кнопки ─── */}
      <div style={{
        padding: 'clamp(16px, 2.5vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: 0, marginBottom: '2px' }}>
            {t('stockLabel')}
          </p>
          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(15px, 1.8vw, 20px)', color: 'rgba(255,255,255,0.9)', fontWeight: 400, margin: 0 }}>
            {accessory.stock_quantity > 0 ? `${accessory.stock_quantity}` : t('onOrder')}
          </p>
        </div>

        {supplierName && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: 0 }}>
            {t('supplierBy', { name: supplierName })}
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '4px',
        }}>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(); }}
            style={{
              height: '44px',
              padding: '0 16px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.5)',
              color: 'rgba(255,255,255,0.98)',
              background: 'rgba(255,255,255,0.12)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {addToCartLabel}
          </button>
          <Link
            href={`/accessory/${accessory.slug}`}
            style={{
              height: '44px',
              padding: '0 16px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.4)',
              color: 'rgba(255,255,255,0.98)',
              background: 'transparent',
              transition: 'all 0.2s ease',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            {t('viewDetails')}
          </Link>
        </div>
      </div>

      {/* Hover линия снизу */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0,
        height: '2px',
        width: isHovered ? '100%' : '0%',
        background: 'rgba(255,255,255,0.4)',
        transition: 'width 0.4s ease',
      }} />

    </div>
  )
}
