'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

type Step = 1 | 2 | 3 | 4 | 5

type Translations = {
  step1Title: string; step1Subtitle: string
  step2Title: string; step2Subtitle: string
  step3Title: string; step3Subtitle: string
  step4Title: string; step4Subtitle: string
  purposeRetreat: string; purposeResort: string; purposeEvent: string
  purposePrivate: string; purposeOther: string
  sizeIntimate: string; sizeCozy: string; sizeClassic: string
  sizeGrand: string; sizeNotSure: string
  namePlaceholder: string; emailPlaceholder: string; phonePlaceholder: string
  messagePlaceholder: string; countryPlaceholder: string
  next: string; back: string; submit: string
  successTitle: string; successSubtitle: string; successBack: string
}

const PURPOSE_OPTIONS = [
  { key: 'retreat', icon: 'mountains' },
  { key: 'resort', icon: 'hotel' },
  { key: 'event', icon: 'celebration' },
  { key: 'private', icon: 'home' },
  { key: 'other', icon: 'sparkle' },
] as const

const SIZE_OPTIONS = [
  { key: 'intimate', kanat: 6, diameter: '5m', guests: '15–20' },
  { key: 'cozy', kanat: 8, diameter: '6m', guests: '25–30' },
  { key: 'classic', kanat: 12, diameter: '8m', guests: '35–55' },
  { key: 'grand', kanat: 16, diameter: '9m', guests: '60–80' },
  { key: 'notSure', kanat: 0, diameter: '', guests: '' },
] as const

function Icon({ name }: { name: string }) {
  const s = { width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'mountains': return <svg viewBox="0 0 24 24" {...s}><path d="M8 21l4.5-9 3.5 5 4-7" /><path d="M2 21h20" /><circle cx="18" cy="5" r="2" /></svg>
    case 'hotel': return <svg viewBox="0 0 24 24" {...s}><rect x="4" y="5" width="16" height="16" rx="1" /><path d="M9 21V9h6v12" /><path d="M4 9h16" /><path d="M12 5V2" /></svg>
    case 'celebration': return <svg viewBox="0 0 24 24" {...s}><path d="M12 2v4M5.6 5.6l2.8 2.8M2 12h4M5.6 18.4l2.8-2.8M12 18v4M18.4 18.4l-2.8-2.8M22 12h-4M18.4 5.6l-2.8 2.8" /></svg>
    case 'home': return <svg viewBox="0 0 24 24" {...s}><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><path d="M9 21v-7h6v7" /></svg>
    case 'sparkle': return <svg viewBox="0 0 24 24" {...s}><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" /></svg>
    default: return null
  }
}

export function InquiryWizard({
  translations: t,
  preselectedYurt,
}: {
  translations: Translations
  preselectedYurt?: string
}) {
  const locale = useLocale()
  const [step, setStep] = useState<Step>(1)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [purpose, setPurpose] = useState('')
  const [size, setSize] = useState(preselectedYurt || '')
  const [country, setCountry] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to top on step change
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  const goNext = () => {
    setDirection('forward')
    setStep(s => Math.min(s + 1, 5) as Step)
  }
  const goBack = () => {
    setDirection('back')
    setStep(s => Math.max(s - 1, 1) as Step)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose, size, country, name, email, phone, message, locale }),
      })
      if (!res.ok) throw new Error('Failed')
      setDirection('forward')
      setStep(5)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const purposeLabels: Record<string, string> = {
    retreat: t.purposeRetreat, resort: t.purposeResort,
    event: t.purposeEvent, private: t.purposePrivate, other: t.purposeOther,
  }
  const sizeLabels: Record<string, string> = {
    intimate: t.sizeIntimate, cozy: t.sizeCozy,
    classic: t.sizeClassic, grand: t.sizeGrand, notSure: t.sizeNotSure,
  }

  const canProceed = (s: Step): boolean => {
    if (s === 1) return !!purpose
    if (s === 2) return !!size
    if (s === 3) return country.trim().length >= 2
    if (s === 4) return name.trim().length >= 2 && (email.includes('@') || phone.length >= 7)
    return false
  }

  return (
    <div
      ref={formRef}
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #1a1510 0%, #2a1f14 50%, #1a1510 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(80px, 12vh, 120px) clamp(20px, 6vw, 48px) clamp(40px, 8vh, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Progress bar */}
      {step < 5 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '3px',
          background: 'rgba(255,255,255,0.05)',
        }}>
          <div style={{
            height: '100%', background: 'var(--beige)',
            width: `${((step) / 4) * 100}%`,
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
      )}

      {/* Step counter */}
      {step < 5 && (
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '11px',
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(168,149,120,0.6)', marginBottom: '32px',
        }}>
          {step} / 4
        </p>
      )}

      {/* Content */}
      <div
        key={step}
        style={{
          width: '100%', maxWidth: '480px',
          animation: `${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both`,
        }}
      >
        {/* Step 1: Purpose */}
        {step === 1 && (
          <StepContainer title={t.step1Title} subtitle={t.step1Subtitle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PURPOSE_OPTIONS.map(({ key, icon }) => (
                <button
                  key={key}
                  onClick={() => { setPurpose(key); setTimeout(goNext, 300) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '18px 20px',
                    background: purpose === key ? 'rgba(168,149,120,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${purpose === key ? 'rgba(168,149,120,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px', cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    touchAction: 'manipulation',
                    minHeight: '56px',
                  }}
                >
                  <span style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: purpose === key ? 'rgba(168,149,120,0.3)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: purpose === key ? 'rgba(168,149,120,0.9)' : 'rgba(255,255,255,0.35)',
                    flexShrink: 0, transition: 'all 0.25s ease',
                  }}>
                    <Icon name={icon} />
                  </span>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '15px',
                    fontWeight: purpose === key ? 500 : 400,
                    color: purpose === key ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
                    letterSpacing: '0.01em', textAlign: 'left',
                  }}>
                    {purposeLabels[key]}
                  </span>
                </button>
              ))}
            </div>
          </StepContainer>
        )}

        {/* Step 2: Size */}
        {step === 2 && (
          <StepContainer title={t.step2Title} subtitle={t.step2Subtitle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SIZE_OPTIONS.map(({ key, kanat, diameter, guests }) => (
                <button
                  key={key}
                  onClick={() => { setSize(key); setTimeout(goNext, 300) }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 20px',
                    background: size === key ? 'rgba(168,149,120,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${size === key ? 'rgba(168,149,120,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px', cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    touchAction: 'manipulation',
                    minHeight: '56px',
                  }}
                >
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '15px',
                    fontWeight: size === key ? 500 : 400,
                    color: size === key ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
                  }}>
                    {sizeLabels[key]}
                  </span>
                  {diameter && (
                    <span style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '12px',
                      color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em',
                    }}>
                      {diameter} · {guests}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </StepContainer>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <StepContainer title={t.step3Title} subtitle={t.step3Subtitle}>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={t.countryPlaceholder}
              autoFocus
              style={inputStyle}
            />
            <NavButtons
              backLabel={t.back} nextLabel={t.next}
              onBack={goBack} onNext={goNext}
              canProceed={canProceed(3)}
            />
          </StepContainer>
        )}

        {/* Step 4: Contact */}
        {step === 4 && (
          <StepContainer title={t.step4Title} subtitle={t.step4Subtitle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text" value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                autoFocus style={inputStyle}
              />
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                style={inputStyle}
              />
              <input
                type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                style={inputStyle}
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
                rows={3}
                style={{ ...inputStyle, resize: 'none', minHeight: '80px' }}
              />
            </div>
            {error && (
              <p style={{ color: '#e5534b', fontSize: '13px', marginTop: '12px' }}>{error}</p>
            )}
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button onClick={goBack} style={backBtnStyle}>
                {t.back}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canProceed(4) || submitting}
                style={{
                  ...primaryBtnStyle,
                  opacity: canProceed(4) && !submitting ? 1 : 0.4,
                  flex: 2,
                }}
              >
                {submitting ? '...' : t.submit}
              </button>
            </div>
          </StepContainer>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(168,149,120,0.2)', border: '1px solid rgba(168,149,120,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
              animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(168,149,120,0.9)" strokeWidth="2" strokeLinecap="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-garamond" style={{
              fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 300,
              color: 'rgba(255,255,255,0.9)', lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              {t.successTitle}
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '15px',
              color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
              maxWidth: '360px', margin: '0 auto 40px',
            }}>
              {t.successSubtitle}
            </p>
            <Link href="/" style={{
              ...primaryBtnStyle, display: 'inline-flex',
              padding: '14px 40px',
            }}>
              {t.successBack}
            </Link>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

function StepContainer({ title, subtitle, children }: {
  title: string; subtitle: string; children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="font-garamond" style={{
        fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 300,
        color: 'rgba(255,255,255,0.9)', lineHeight: 1.2,
        marginBottom: '10px',
      }}>
        {title}
      </h2>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '14px',
        color: 'rgba(255,255,255,0.4)', lineHeight: 1.6,
        marginBottom: '32px',
      }}>
        {subtitle}
      </p>
      {children}
    </div>
  )
}

function NavButtons({ backLabel, nextLabel, onBack, onNext, canProceed }: {
  backLabel: string; nextLabel: string
  onBack: () => void; onNext: () => void; canProceed: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
      <button onClick={onBack} style={backBtnStyle}>{backLabel}</button>
      <button onClick={onNext} disabled={!canProceed} style={{
        ...primaryBtnStyle, opacity: canProceed ? 1 : 0.4, flex: 2,
      }}>
        {nextLabel}
      </button>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '16px 18px',
  fontFamily: 'Inter, sans-serif', fontSize: '15px',
  color: 'rgba(255,255,255,0.9)',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', outline: 'none',
  transition: 'border-color 0.2s ease',
}

const primaryBtnStyle: React.CSSProperties = {
  flex: 2, height: '50px',
  fontFamily: 'Inter, sans-serif', fontSize: '13px',
  fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
  color: '#1a1510', background: 'var(--beige)',
  border: 'none', borderRadius: '10px', cursor: 'pointer',
  transition: 'all 0.25s ease', touchAction: 'manipulation',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  textDecoration: 'none',
}

const backBtnStyle: React.CSSProperties = {
  flex: 1, height: '50px',
  fontFamily: 'Inter, sans-serif', fontSize: '13px',
  fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.5)', background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', cursor: 'pointer',
  transition: 'all 0.25s ease', touchAction: 'manipulation',
}
