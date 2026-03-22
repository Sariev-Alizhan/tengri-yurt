'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function RentModal({
  yurtSlug,
  yurtName,
  rentalPrice,
  onClose,
}: {
  yurtSlug: string
  yurtName: string
  rentalPrice?: number | null
  onClose: () => void
}) {
  const t = useTranslations('catalog')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const canSubmit = name.trim().length > 0 && phone.trim().length >= 6

  const handleSubmit = async () => {
    if (!canSubmit || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yurtSlug,
          yurtName,
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
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
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#1a1714',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: 'clamp(24px, 5vw, 32px)',
          position: 'relative',
        }}
      >
        {/* Close */}
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

        {/* Title */}
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
          {t('rentSubtitle')}
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: 'rgba(168,149,120,0.8)',
          margin: '0 0 6px',
        }}>
          {yurtName}
        </p>
        {rentalPrice != null && rentalPrice > 0 && (
          <p style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            margin: '0 0 20px',
          }}>
            from $ {rentalPrice.toLocaleString('en-US')}
          </p>
        )}
        {(!rentalPrice || rentalPrice <= 0) && <div style={{ marginBottom: '18px' }} />}

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6,
            }}>
              {t('rentSuccess')}
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{
                marginTop: '20px',
                padding: '12px 32px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#1a1714',
                background: 'rgba(168,149,120,0.9)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              OK
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="text"
              placeholder={t('rentName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(168,149,120,0.5)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            />
            <input
              type="tel"
              placeholder={t('rentPhone')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(168,149,120,0.5)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            />
            <textarea
              placeholder={t('rentMessagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(168,149,120,0.5)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            />

            {status === 'error' && (
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#e57373',
                margin: 0,
              }}>
                {t('rentError')}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || status === 'loading'}
              style={{
                width: '100%',
                padding: '14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#1a1714',
                background: canSubmit ? 'rgba(168,149,120,0.9)' : 'rgba(168,149,120,0.3)',
                border: 'none',
                borderRadius: '10px',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
                marginTop: '4px',
              }}
            >
              {status === 'loading' ? '...' : t('rentSubmit')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
