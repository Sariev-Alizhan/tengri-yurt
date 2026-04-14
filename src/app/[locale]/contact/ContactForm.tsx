'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface ContactFormLabels {
  name: string
  email: string
  subject: string
  country: string
  message: string
  send: string
  sending: string
  error: string
  successTitle: string
  successText: string
  namePlaceholder: string
  emailPlaceholder: string
  countryPlaceholder: string
  messagePlaceholder: string
}

interface ContactFormProps {
  labels?: ContactFormLabels
  subjects?: string[]
}

const DEFAULT_SUBJECTS = [
  'Ordering a yurt',
  'Custom / large order',
  'Yurt Hammam',
  'Event / glamping rental',
  'Supplier / partnership',
  'Press inquiry',
  'Other',
]

const DEFAULT_LABELS: ContactFormLabels = {
  name: 'Full name',
  email: 'Email',
  subject: 'Subject',
  country: 'Country',
  message: 'Message',
  send: 'Send message',
  sending: 'Sending…',
  error: 'Something went wrong. Please try WhatsApp or email us directly.',
  successTitle: 'Message sent',
  successText: "Thank you, {name}. We'll get back to you at {email} within 24 hours.",
  namePlaceholder: 'Your name',
  emailPlaceholder: 'your@email.com',
  countryPlaceholder: 'Where are you?',
  messagePlaceholder: 'Tell us what you have in mind — model, size, delivery location, timeline...',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px',
  color: 'rgba(255,255,255,0.9)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, sans-serif',
  fontSize: '10px',
  fontWeight: 500,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '8px',
}

export function ContactForm({ labels = DEFAULT_LABELS, subjects = DEFAULT_SUBJECTS }: ContactFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: subjects[0] ?? DEFAULT_SUBJECTS[0],
    country: '',
    message: '',
  })
  const [status, setStatus] = useState<Status>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const successText = labels.successText
    .replace('{name}', form.name)
    .replace('{email}', form.email)

  if (status === 'sent') {
    return (
      <div style={{
        padding: '48px',
        background: 'rgba(100,200,120,0.05)',
        border: '1px solid rgba(100,200,120,0.2)',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '52px', height: '52px',
          border: '1px solid rgba(100,200,120,0.4)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="22" height="22" fill="none" stroke="rgba(100,200,120,0.9)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 style={{
          fontFamily: 'EB Garamond, serif', fontSize: '26px',
          color: 'rgba(255,255,255,0.9)', fontWeight: 400, margin: '0 0 12px',
        }}>
          {labels.successTitle}
        </h3>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '14px',
          color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
          fontWeight: 300,
        }}>
          {successText}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
        className="contact-form-row"
      >
        <div>
          <label htmlFor="cf-name" style={labelStyle}>{labels.name} *</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder={labels.namePlaceholder}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,110,0.5)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
          />
        </div>
        <div>
          <label htmlFor="cf-email" style={labelStyle}>{labels.email} *</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder={labels.emailPlaceholder}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,110,0.5)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
        className="contact-form-row"
      >
        <div>
          <label htmlFor="cf-subject" style={labelStyle}>{labels.subject} *</label>
          <select
            id="cf-subject"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            style={{
              ...inputStyle,
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '36px',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,110,0.5)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            {subjects.map(s => (
              <option key={s} value={s} style={{ background: '#1a1510', color: 'rgba(255,255,255,0.9)' }}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cf-country" style={labelStyle}>{labels.country}</label>
          <input
            id="cf-country"
            name="country"
            type="text"
            value={form.country}
            onChange={handleChange}
            placeholder={labels.countryPlaceholder}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,110,0.5)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" style={labelStyle}>{labels.message} *</label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder={labels.messagePlaceholder}
          style={{
            ...inputStyle,
            resize: 'vertical',
            minHeight: '140px',
            lineHeight: 1.6,
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(201,168,110,0.5)' }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
        />
      </div>

      {status === 'error' && (
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '13px',
          color: 'rgba(220,80,80,0.9)', margin: 0,
        }}>
          {labels.error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          padding: '15px 36px',
          background: status === 'sending' ? 'rgba(201,168,110,0.06)' : 'rgba(201,168,110,0.12)',
          border: '1px solid rgba(201,168,110,0.4)',
          color: 'rgba(201,168,110,0.9)',
          fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          alignSelf: 'flex-start',
          transition: 'background 0.2s, opacity 0.2s',
          opacity: status === 'sending' ? 0.6 : 1,
        }}
      >
        {status === 'sending' ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round"/>
            </svg>
            {labels.sending}
          </>
        ) : (
          labels.send
        )}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .contact-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  )
}
