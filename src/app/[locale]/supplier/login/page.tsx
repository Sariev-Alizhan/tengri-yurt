'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

// Локализованный контент для правой панели
const rightPanelContent = {
  en: {
    label: 'SUPPLIER PORTAL · TENGRI YURT',
    quote: '"Tradition is not something to preserve. It is something to pass forward."',
    subtitle: 'Join our network of artisan yurt makers shipping worldwide',
    stats: ['12+ Suppliers', '40+ Countries', 'Since 2010'],
  },
  ru: {
    label: 'ПОРТАЛ ПОСТАВЩИКА · TENGRI YURT',
    quote: '«Традиция — это не то, что нужно сохранять. Это то, что нужно передавать дальше.»',
    subtitle: 'Присоединяйтесь к нашей сети мастеров, доставляющих юрты по всему миру',
    stats: ['12+ поставщиков', '40+ стран', 'С 2010 года'],
  },
  kk: {
    label: 'ЖЕТКІЗУШІ ПОРТАЛЫ · TENGRI YURT',
    quote: '«Дәстүр — сақталатын нәрсе емес. Ол болашаққа берілетін нәрсе.»',
    subtitle: 'Әлем бойынша жеткізетін шебер киіз үй жасаушылар желісіне қосылыңыз',
    stats: ['12+ жеткізуші', '40+ ел', '2010 жылдан'],
  },
  zh: {
    label: '供应商门户 · TENGRI YURT',
    quote: '「传统不是需要保存的东西，而是需要传承的东西。」',
    subtitle: '加入我们全球工匠蒙古包制造商网络',
    stats: ['12+ 供应商', '40+ 国家', '自2010年'],
  },
}

export default function SupplierLoginPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('supplier')
  const content = rightPanelContent[locale as keyof typeof rightPanelContent] || rightPanelContent.en

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.querySelector<HTMLInputElement>('input[name="email"]')?.value ?? '').trim().toLowerCase()
    const password = (form.querySelector<HTMLInputElement>('input[name="password"]')?.value ?? '').trim()
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Login failed')
        return
      }
      if (data.success) {
        await new Promise((r) => setTimeout(r, 300))
        const pathname = window.location.pathname || ''
        const dashboardPath = pathname.replace(/\/supplier\/login.*$/i, '/supplier/dashboard')
        window.location.href = dashboardPath !== pathname ? dashboardPath : `/${locale}/supplier/dashboard`
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-root" style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* ─── ЛЕВАЯ ПАНЕЛЬ — форма; на мобильных на весь экран без картинки справа ─── */}
      <div className="login-form-panel" style={{
        width: '100%',
        maxWidth: '380px',
        flexShrink: 0,
        background: '#0f0d0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
      }}>

        {/* Логотип — по центру */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '40px',
          width: '100%',
          textAlign: 'center',
        }}>
          <img
            src="/images/logo_white.png"
            alt="Tengri Yurt"
            style={{
              height: '52px',
              width: 'auto',
              display: 'block',
              margin: '0 auto 12px',
            }}
          />
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(168,149,120,0.45)',
            margin: 0,
          }}>
            {t('portalTitle')}
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}>
          {(['en', 'ru', 'kk', 'zh'] as const).map((loc) => (
            <a
              key={loc}
              href={`/${loc}/supplier/login`}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: locale === loc ? 600 : 400,
                letterSpacing: '0.1em',
                color: locale === loc ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              {loc === 'en' ? 'EN' : loc === 'ru' ? 'RU' : loc === 'kk' ? 'KZ' : 'CN'}
            </a>
          ))}
        </div>

        {/* Заголовок */}
        <h1 style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: '36px',
          color: 'rgba(255,255,255,0.88)',
          fontWeight: 400,
          textAlign: 'center',
          marginBottom: '36px',
          width: '100%',
        }}>
          {t('signIn')}
        </h1>

        {/* Форма входа — onSubmit для надёжной отправки по клику на кнопку */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <input type="hidden" name="locale" value={locale} />

          <div>
            <label style={{
              display: 'block',
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(168,149,120,0.5)',
              marginBottom: '8px',
            }}>
              {t('email')}
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              style={{
                width: '100%',
                background: 'rgba(168,149,120,0.06)',
                border: '1px solid rgba(168,149,120,0.15)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '14px',
                padding: '12px 16px',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(168,149,120,0.5)',
              marginBottom: '8px',
            }}>
              {t('password')}
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                background: 'rgba(168,149,120,0.06)',
                border: '1px solid rgba(168,149,120,0.15)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '14px',
                padding: '12px 16px',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{
              fontSize: '12px',
              color: 'rgba(255,120,120,0.85)',
              textAlign: 'center',
              padding: '10px 14px',
              background: 'rgba(255,80,80,0.06)',
              border: '1px solid rgba(255,80,80,0.15)',
              margin: 0,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              background: loading ? 'rgba(168,149,120,0.15)' : 'rgba(168,149,120,0.2)',
              border: '1px solid rgba(168,149,120,0.5)',
              color: 'rgba(255,255,255,0.95)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              padding: '14px 20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease',
              position: 'relative',
              zIndex: 1,
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(168,149,120,0.12)'
                e.currentTarget.style.borderColor = 'rgba(168,149,120,0.8)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(168,149,120,0.5)'
            }}
          >
            {loading ? t('signInProgress') : t('signIn').toUpperCase()}
          </button>

        </form>

        {/* Ссылка на регистрацию */}
        <p style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)',
          textAlign: 'center',
          marginTop: '28px',
        }}>
          <Link href="/supplier/register" style={{
            color: 'rgba(168,149,120,0.65)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}>
            {t('noAccountRegister')}
          </Link>
        </p>

        {/* Ссылка домой */}
        <Link href="/" style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '9px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)' }}
        >
          {t('backToSite')}
        </Link>

      </div>

      {/* ─── ПРАВАЯ ПАНЕЛЬ — фото + текст (скрыта на мобильных) ─── */}
      <div className="login-right-panel" style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* Фоновое фото */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />

        {/* Оверлей */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(20,14,8,0.75) 0%, rgba(10,8,5,0.55) 100%)',
        }} />

        {/* Контент по центру */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 clamp(40px, 8vw, 100px)',
          maxWidth: '640px',
        }}>

          {/* Лейбл */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(168,149,120,0.55)',
            marginBottom: '32px',
          }}>
            {content.label}
          </p>

          {/* Разделитель */}
          <div style={{
            width: '40px',
            height: '1px',
            background: 'rgba(168,149,120,0.3)',
            margin: '0 auto 32px',
          }} />

          {/* Цитата */}
          <blockquote style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(22px, 3.5vw, 36px)',
            color: 'rgba(255,255,255,0.88)',
            fontWeight: 400,
            lineHeight: 1.5,
            fontStyle: 'italic',
            margin: '0 0 32px',
          }}>
            {content.quote}
          </blockquote>

          {/* Подзаголовок */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(12px, 1.5vw, 14px)',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 300,
            lineHeight: 1.7,
            letterSpacing: '0.03em',
            marginBottom: '48px',
          }}>
            {content.subtitle}
          </p>

          {/* Статистика */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(24px, 5vw, 56px)',
          }}>
            {content.stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'EB Garamond, serif',
                  fontSize: 'clamp(18px, 2.5vw, 26px)',
                  color: 'rgba(168,149,120,0.85)',
                  fontWeight: 400,
                  margin: '0 0 4px',
                }}>
                  {stat}
                </p>
                {i < content.stats.length - 1 && (
                  <span style={{
                    display: 'none',
                  }} />
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Копирайт внизу */}
        <p style={{
          position: 'absolute',
          bottom: '24px',
          right: '32px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '9px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.18)',
        }}>
          © 2025 Tengri Yurt
        </p>

      </div>

    </div>
  )
}
