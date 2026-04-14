'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type QuizQuestion = {
  q: string
  options: string[]
  correct: number
  explain: string
}

export function YurtQuizClient({ locale }: { locale: string }) {
  const t = useTranslations('quiz')
  const questions = (t.raw('questions') as QuizQuestion[]) ?? []
  const [step, setStep] = useState<'intro' | 'play' | 'result'>('intro')
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showExplain, setShowExplain] = useState(false)

  const total = questions.length
  const current = questions[index]
  const isLast = index === total - 1
  const progress = total ? ((index + (showExplain ? 1 : 0)) / total) * 100 : 0

  const handleStart = () => {
    setStep('play')
    setIndex(0)
    setScore(0)
    setSelected(null)
    setShowExplain(false)
  }

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null) return
    setSelected(optionIndex)
    if (optionIndex === current.correct) setScore((s) => s + 1)
    setShowExplain(true)
  }

  const handleNext = () => {
    if (isLast) {
      setStep('result')
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setShowExplain(false)
  }

  const getResultMessage = () => {
    const pct = total ? (score / total) * 100 : 0
    if (pct >= 90) return t('resultGreat')
    if (pct >= 60) return t('resultGood')
    return t('resultLearn')
  }

  const getResultLabel = () => {
    const pct = total ? (score / total) * 100 : 0
    if (pct >= 90) return 'Master of the steppe'
    if (pct >= 60) return 'Nomadic scholar'
    return 'Keep exploring'
  }

  const getRecommendedYurt = () => {
    const pct = total ? (score / total) * 100 : 0
    if (pct >= 90) return { slug: 'spacious', name: 'Grand', diameter: '9m', kanat: '12-kanat', desc: 'For true connoisseurs of nomadic culture' }
    if (pct >= 70) return { slug: 'spacious', name: 'Spacious', diameter: '7m', kanat: '8-kanat', desc: 'Perfect for families and events' }
    if (pct >= 50) return { slug: 'classic', name: 'Classic', diameter: '6m', kanat: '6-kanat', desc: 'The timeless choice for any setting' }
    return { slug: 'cozy', name: 'Cozy', diameter: '5m', kanat: '4-kanat', desc: 'Intimate and warm — ideal for beginners' }
  }

  if (step === 'intro') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(100px, 15vw, 140px) 24px clamp(60px, 10vw, 100px)',
        background: 'var(--bg-main)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/picture/yurt_shanyraq.jpeg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.08,
        }} />
        <div style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', maxWidth: '560px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(201,168,110,0.7)', marginBottom: '20px',
          }}>
            Discover & play
          </p>
          <h1 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(36px, 7vw, 64px)',
            color: 'rgba(255,255,255,0.93)',
            fontWeight: 400, lineHeight: 1.1, margin: '0 0 20px',
          }}>
            {t('title')}
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '15px',
            color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
            fontWeight: 300, margin: '0 0 48px',
          }}>
            {t('subtitle')}
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', marginBottom: '24px',
          }}>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
            }}>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '11px',
                color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em',
              }}>
                {total} questions
              </span>
            </div>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
            }}>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '11px',
                color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em',
              }}>
                ~5 min
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '15px 44px',
              background: 'rgba(201,168,110,0.12)',
              border: '1px solid rgba(201,168,110,0.5)',
              color: 'rgba(201,168,110,0.95)',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: '4px',
              marginBottom: '32px',
            }}
          >
            {t('start')}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <br />
          <Link
            href="/"
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: '12px',
              color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
              letterSpacing: '0.05em',
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'result') {
    const pct = total ? Math.round((score / total) * 100) : 0
    const rec = getRecommendedYurt()
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(100px, 15vw, 140px) 24px clamp(60px, 10vw, 100px)',
        background: 'var(--bg-main)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '520px', width: '100%' }}>
          {/* Score ring */}
          <div style={{
            width: '100px', height: '100px',
            border: '1px solid rgba(201,168,110,0.3)',
            borderRadius: '50%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px',
            background: 'rgba(201,168,110,0.06)',
          }}>
            <span style={{
              fontFamily: 'EB Garamond, serif', fontSize: '32px',
              color: 'rgba(201,168,110,0.95)', lineHeight: 1,
            }}>
              {score}
            </span>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '10px',
              color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
            }}>
              / {total}
            </span>
          </div>

          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(201,168,110,0.7)', marginBottom: '12px',
          }}>
            {getResultLabel()}
          </p>

          <h2 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(28px, 5vw, 42px)',
            color: 'rgba(255,255,255,0.93)',
            fontWeight: 400, margin: '0 0 16px',
          }}>
            {t('score')}: {pct}%
          </h2>

          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '14px',
            color: 'rgba(255,255,255,0.5)', lineHeight: 1.75,
            fontWeight: 300, margin: '0 0 40px',
          }}>
            {getResultMessage()}
          </p>

          {/* Recommended yurt card */}
          <Link
            href={`/yurt/${rec.slug}`}
            style={{ textDecoration: 'none', display: 'block', marginBottom: '32px' }}
          >
            <div style={{
              background: 'rgba(201,168,110,0.06)',
              border: '1px solid rgba(201,168,110,0.2)',
              borderRadius: '4px',
              padding: '20px 24px',
              textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '20px',
              transition: 'border-color 0.2s',
            }}>
              <div style={{
                width: '56px', height: '56px', flexShrink: 0,
                border: '1px solid rgba(201,168,110,0.3)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(201,168,110,0.08)',
              }}>
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                  <path d="M11 1L1 8h2v9h16V8h2L11 1Z" stroke="rgba(201,168,110,0.8)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                  <circle cx="11" cy="5" r="1.5" fill="rgba(201,168,110,0.6)"/>
                </svg>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: 'rgba(201,168,110,0.7)', marginBottom: '4px',
                }}>
                  Recommended for you
                </p>
                <p style={{
                  fontFamily: 'EB Garamond, serif', fontSize: '22px',
                  color: 'rgba(255,255,255,0.9)', margin: '0 0 4px', fontWeight: 400,
                }}>
                  {rec.name} · {rec.diameter}
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '12px',
                  color: 'rgba(255,255,255,0.4)', margin: 0,
                }}>
                  {rec.kanat} · {rec.desc}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'rgba(201,168,110,0.5)' }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleStart}
              style={{
                padding: '13px 28px',
                background: 'rgba(201,168,110,0.1)',
                border: '1px solid rgba(201,168,110,0.4)',
                color: 'rgba(201,168,110,0.9)',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', borderRadius: '4px',
              }}
            >
              {t('playAgain')}
            </button>
            <Link
              href="/catalog"
              style={{
                display: 'inline-block', padding: '13px 28px',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: '4px',
              }}
            >
              Browse yurts →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>No questions loaded.</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      padding: 'clamp(100px, 15vw, 140px) 24px clamp(60px, 10vw, 100px)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', flex: 1 }}>

        {/* Progress bar */}
        <div style={{
          height: '2px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '1px',
          marginBottom: '32px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'rgba(201,168,110,0.7)',
            borderRadius: '1px',
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '40px',
        }}>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px',
            color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {index + 1} / {total}
          </span>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: '13px',
            color: 'rgba(201,168,110,0.85)', letterSpacing: '0.05em',
          }}>
            Score: {score}
          </span>
        </div>

        {/* Question */}
        <h2 style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: 'clamp(22px, 4vw, 30px)',
          color: 'rgba(255,255,255,0.92)',
          fontWeight: 400, lineHeight: 1.4,
          margin: '0 0 32px',
        }}>
          {current.q}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {current.options.map((option, i) => {
            const isChosen = selected === i
            const isCorrect = i === current.correct
            const showRight = showExplain && isCorrect
            const showWrong = showExplain && isChosen && !isCorrect

            let bg = 'rgba(255,255,255,0.04)'
            let border = 'rgba(255,255,255,0.12)'
            let color = 'rgba(255,255,255,0.8)'

            if (showRight) {
              bg = 'rgba(100,200,120,0.1)'
              border = 'rgba(100,200,120,0.5)'
              color = 'rgba(150,230,160,0.9)'
            } else if (showWrong) {
              bg = 'rgba(220,80,80,0.1)'
              border = 'rgba(220,80,80,0.4)'
              color = 'rgba(255,130,130,0.9)'
            } else if (isChosen) {
              bg = 'rgba(201,168,110,0.08)'
              border = 'rgba(201,168,110,0.4)'
              color = 'rgba(201,168,110,0.9)'
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '16px 20px',
                  background: bg,
                  border: `1px solid ${border}`,
                  color,
                  fontFamily: 'Inter, sans-serif', fontSize: '14px',
                  lineHeight: 1.5, fontWeight: 400,
                  cursor: selected !== null ? 'default' : 'pointer',
                  borderRadius: '4px',
                  transition: 'background 0.2s, border-color 0.2s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  minHeight: '52px',
                }}
              >
                <span style={{
                  fontFamily: 'EB Garamond, serif', fontSize: '16px',
                  color: 'rgba(255,255,255,0.3)', flexShrink: 0, lineHeight: 1.5,
                }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplain && (
          <div style={{
            marginTop: '20px',
            padding: '16px 20px',
            background: 'rgba(201,168,110,0.05)',
            border: '1px solid rgba(201,168,110,0.2)',
            borderRadius: '4px',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '13px',
              color: 'rgba(255,255,255,0.65)', lineHeight: 1.75,
              fontWeight: 300, margin: 0,
            }}>
              {current.explain}
            </p>
          </div>
        )}

        {showExplain && (
          <button
            type="button"
            onClick={handleNext}
            style={{
              marginTop: '24px', width: '100%',
              padding: '14px',
              background: 'rgba(201,168,110,0.1)',
              border: '1px solid rgba(201,168,110,0.4)',
              color: 'rgba(201,168,110,0.9)',
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: '4px',
            }}
          >
            {isLast ? t('seeResults') : t('next')} →
          </button>
        )}

        <Link
          href="/"
          style={{
            display: 'block', marginTop: '32px', textAlign: 'center',
            fontFamily: 'Inter, sans-serif', fontSize: '12px',
            color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
