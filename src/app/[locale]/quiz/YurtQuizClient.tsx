'use client'

import { useState } from 'react'
import Link from 'next/link'
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

  if (step === 'intro') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          paddingTop: 'clamp(100px, 15vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 100px)',
          background: 'linear-gradient(180deg, rgba(15,13,10,0.97) 0%, rgba(40,32,24,0.98) 100%)',
        }}
      >
        <p className="font-inter text-amber-500/80 text-xs uppercase tracking-[0.3em] mb-4">
          Discover & play
        </p>
        <h1 className="font-garamond text-white text-4xl md:text-6xl text-center mb-4">
          {t('title')}
        </h1>
        <p className="font-inter text-white/70 text-center max-w-md mb-10">
          {t('subtitle')}
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="border-2 border-amber-500/70 text-amber-400 px-8 py-4 font-inter text-sm uppercase tracking-widest hover:bg-amber-500/15 transition-colors"
        >
          {t('start')}
        </button>
        <Link
          href={`/${locale}`}
          className="mt-8 font-inter text-white/50 text-sm hover:text-white/80 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    )
  }

  if (step === 'result') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          paddingTop: 'clamp(100px, 15vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 100px)',
          background: 'linear-gradient(180deg, rgba(15,13,10,0.97) 0%, rgba(40,32,24,0.98) 100%)',
        }}
      >
        <h2 className="font-garamond text-white text-3xl md:text-4xl mb-2">
          {t('score')}: {score} / {total}
        </h2>
        <p className="font-inter text-white/80 text-center max-w-lg mb-10 leading-relaxed">
          {getResultMessage()}
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="border-2 border-amber-500/70 text-amber-400 px-8 py-4 font-inter text-sm uppercase tracking-widest hover:bg-amber-500/15 transition-colors mb-6"
        >
          {t('playAgain')}
        </button>
        <Link
          href={`/${locale}/catalog`}
          className="font-inter text-white/60 text-sm hover:text-white transition-colors"
        >
          Browse yurts →
        </Link>
      </div>
    )
  }

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-inter text-white/70">No questions loaded.</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col px-4"
      style={{
        paddingTop: 'clamp(100px, 15vw, 140px)',
        paddingBottom: 'clamp(60px, 10vw, 100px)',
        background: 'linear-gradient(180deg, rgba(15,13,10,0.97) 0%, rgba(40,32,24,0.98) 100%)',
      }}
    >
      <div className="max-w-xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <span className="font-inter text-white/50 text-xs uppercase tracking-wider">
            Question {index + 1} of {total}
          </span>
          <span className="font-inter text-amber-400/90 text-sm">
            Score: {score}
          </span>
        </div>

        <h2 className="font-garamond text-white text-2xl md:text-3xl mb-8 leading-snug">
          {current.q}
        </h2>

        <ul className="space-y-3">
          {current.options.map((option, i) => {
            const isChosen = selected === i
            const isCorrect = i === current.correct
            const showRight = showExplain && isCorrect
            const showWrong = showExplain && isChosen && !isCorrect
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`w-full text-left font-inter py-4 px-5 border-2 transition-all min-h-[52px] ${
                    showRight
                      ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-200'
                      : showWrong
                        ? 'border-red-400/50 bg-red-500/10 text-red-200'
                        : isChosen
                          ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                          : 'border-white/20 bg-white/5 text-white/90 hover:border-white/40 hover:bg-white/10'
                  } ${selected !== null ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className="inline-block mr-2 opacity-70">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              </li>
            )
          })}
        </ul>

        {showExplain && (
          <div className="mt-6 p-4 border border-amber-500/30 bg-amber-500/5">
            <p className="font-inter text-white/80 text-sm leading-relaxed">
              {current.explain}
            </p>
          </div>
        )}

        {showExplain && (
          <button
            type="button"
            onClick={handleNext}
            className="mt-8 w-full border-2 border-amber-500/70 text-amber-400 py-3 font-inter text-sm uppercase tracking-widest hover:bg-amber-500/15 transition-colors"
          >
            {isLast ? t('seeResults') : t('next')}
          </button>
        )}

        <Link
          href={`/${locale}`}
          className="block mt-6 text-center font-inter text-white/50 text-sm hover:text-white/80"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
