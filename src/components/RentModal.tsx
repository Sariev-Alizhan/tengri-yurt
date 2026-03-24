'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCart } from '@/components/CartContext'

export function RentModal({
  yurtId,
  yurtSlug,
  yurtName,
  rentalPrice,
  supplierId,
  photo,
  locale,
  onClose,
}: {
  yurtId: string
  yurtSlug: string
  yurtName: string
  rentalPrice?: number | null
  supplierId: string
  photo?: string | null
  locale: string
  onClose: () => void
}) {
  const t = useTranslations('catalog')
  const { addYurt } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [added, setAdded] = useState(false)

  const priceUsd = rentalPrice != null && rentalPrice > 0 ? rentalPrice : 0

  const handleAddToCart = () => {
    addYurt({
      id: yurtId,
      yurtId: yurtId,
      name: `${yurtName} (${t('rentLineBadge')})`,
      slug: yurtSlug,
      price_usd: priceUsd,
      quantity,
      supplier_id: supplierId,
      photo: photo ?? null,
      dealType: 'rent',
      note: note.trim() || undefined,
    })
    setAdded(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#fff',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        paddingTop: 'max(16px, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(16px, env(safe-area-inset-right, 0px))',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          marginTop: 'auto',
          marginBottom: 'auto',
          maxHeight: 'min(90dvh, calc(100dvh - max(32px, env(safe-area-inset-top, 0px)) - max(32px, env(safe-area-inset-bottom, 0px))))',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: '#1a1714',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: 'clamp(24px, 5vw, 32px)',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: 'clamp(22px, 4vw, 28px)',
          color: 'rgba(255,255,255,0.95)',
          fontWeight: 400,
          margin: '0 0 4px',
        }}>
          {t('rentTitle')}
        </h2>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.05em',
          margin: '0 0 8px',
        }}>
          {t('rentSubtitleCart')}
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: 'rgba(168,149,120,0.8)',
          margin: '0 0 6px',
        }}>
          {yurtName}
        </p>
        {priceUsd > 0 && (
          <p style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            margin: '0 0 20px',
          }}>
            from $ {priceUsd.toLocaleString('en-US')} / {t('rentUnit')}
          </p>
        )}
        {priceUsd <= 0 && <div style={{ marginBottom: '18px' }} />}

        {added ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6,
            }}>
              {t('rentAddedToCart')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <Link
                href={`/${locale}/cart`}
                onClick={onClose}
                style={{
                  padding: '14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#1a1714',
                  background: 'rgba(168,149,120,0.9)',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                {t('rentGoToCart')}
              </Link>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.6)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {t('rentContinueShopping')}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(168,149,120,0.6)', marginBottom: '8px' }}>
                {t('rentQuantity')}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: '44px',
                    height: '44px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontSize: '18px',
                  }}
                >
                  −
                </button>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', color: '#fff', minWidth: '32px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: '44px',
                    height: '44px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontSize: '18px',
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <textarea
              placeholder={t('rentMessagePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(168,149,120,0.5)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            />

            <button
              type="button"
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#1a1714',
                background: 'rgba(168,149,120,0.9)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              {t('rentAddToCart')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
