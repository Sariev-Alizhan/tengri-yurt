'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

type Yurt = {
  id: string
  name: string
  slug: string
  diameter_m: number
  kanat: number
  capacity_min: number
  capacity_max: number
  price_usd: number
  production_days_min: number
  production_days_max: number
  description: string | null
  photos: string[] | null
}

export function CatalogClient({
  yurts,
  locale,
}: {
  yurts: Yurt[]
  locale: string
}) {
  const t = useTranslations('catalog')
  const [activeTab, setActiveTab] = useState<'yurts' | 'accessories'>('yurts')
  const [filter, setFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'all') return yurts
    if (filter === 'small') return yurts.filter(y => y.diameter_m <= 5)
    if (filter === 'medium') return yurts.filter(y => y.diameter_m > 5 && y.diameter_m <= 7)
    if (filter === 'large') return yurts.filter(y => y.diameter_m > 7)
    return yurts
  }, [yurts, filter])

  const getPhoto = (yurt: Yurt) => {
    const first = yurt.photos?.[0]
    return first || '/images/background.jpg'
  }

  const filters = [
    { key: 'all' as const, label: t('filterAll') },
    { key: 'small' as const, label: '≤ 5m' },
    { key: 'medium' as const, label: '5–7m' },
    { key: 'large' as const, label: '7m+' },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>

      {/* ─── ФОН — background.jpg на всю страницу ─── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
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
          gap: '0',
          marginBottom: 'clamp(24px, 4vw, 40px)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          padding: '0 clamp(20px, 5vw, 48px)',
        }}>
          {(['yurts', 'accessories'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: activeTab === tab ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid rgba(168,149,120,0.8)' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              {tab === 'yurts' ? t('yurtsTab') : t('accessoriesTab')}
            </button>
          ))}
        </div>

        {activeTab === 'accessories' ? (
          <div style={{
            textAlign: 'center',
            padding: 'clamp(48px, 10vw, 120px) clamp(24px, 5vw, 48px)',
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(14px, 2vw, 18px)',
          }}>
            <p style={{ marginBottom: '16px' }}>{t('accessoriesTab')}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              {t('accessoriesPlaceholder')}
            </p>
          </div>
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
              onClick={() => setFilter(f.key)}
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
                padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 28px)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                appearance: 'none',
                WebkitAppearance: 'none',
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
          gap: '1px',
          padding: '0 clamp(16px, 4vw, 48px)',
          maxWidth: '1600px',
          margin: '0 auto',
        }}>
          {filtered.map((yurt, index) => (
            <YurtCard
              key={yurt.id}
              yurt={yurt}
              locale={locale}
              photo={getPhoto(yurt)}
              isHovered={hoveredId === yurt.id}
              onHover={() => setHoveredId(yurt.id)}
              onLeave={() => setHoveredId(null)}
              index={index}
              t={t}
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
            No yurts in this category yet
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
  yurt, locale, photo, isHovered, onHover, onLeave, index, t
}: {
  yurt: Yurt
  locale: string
  photo: string
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  index: number
  t: ReturnType<typeof useTranslations<'catalog'>>
}) {
  const productionLabel = yurt.production_days_min === yurt.production_days_max
    ? `${yurt.production_days_min}d`
    : `${yurt.production_days_min}–${yurt.production_days_max}d`

  return (
    <Link
      href={`/${locale}/yurt/${yurt.slug}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        background: isHovered
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(0,0,0,0.25)',
        transition: 'background 0.4s ease',
        cursor: 'pointer',
        animation: 'cardReveal 0.6s ease forwards',
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
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
            top: '20px',
            right: '20px',
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 400,
            letterSpacing: '0.05em',
            background: 'rgba(0,0,0,0.35)',
            padding: '4px 10px',
            backdropFilter: 'blur(4px)',
          }}>
            {t('from')} ${yurt.price_usd.toLocaleString()}
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
            {yurt.name}
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(10px, 1.3vw, 12px)',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '6px',
          }}>
            Ø {yurt.diameter_m}m · {yurt.kanat} kanat
          </p>
        </div>
      </div>

      {/* ─── НИЖНЯЯ ЧАСТЬ КАРТОЧКИ ─── */}
      <div style={{
        padding: 'clamp(20px, 3vw, 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>

        {/* Характеристики */}
        <div style={{
          display: 'flex',
          gap: 'clamp(16px, 3vw, 32px)',
          flexWrap: 'wrap',
        }}>
          {/* Вместимость */}
          <div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '4px',
            }}>
              Capacity
            </p>
            <p style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(16px, 2vw, 22px)',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 400,
            }}>
              {yurt.capacity_min}–{yurt.capacity_max}
            </p>
          </div>

          {/* Производство */}
          <div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '4px',
            }}>
              Production
            </p>
            <p style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(16px, 2vw, 22px)',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 400,
            }}>
              {productionLabel}
            </p>
          </div>
        </div>

        {/* Кнопка */}
        <div style={{
          flexShrink: 0,
          border: '1px solid rgba(255,255,255,0.35)',
          color: 'rgba(255,255,255,0.8)',
          padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 2.5vw, 24px)',
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(9px, 1.2vw, 11px)',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
          transition: 'all 0.25s ease',
        }}>
          {t('viewDetails')}
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

    </Link>
  )
}
