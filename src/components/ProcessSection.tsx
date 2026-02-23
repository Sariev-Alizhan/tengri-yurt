'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

type Step = { number: string; title: string; desc: string }

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1px 1fr',
        gap: '0 32px',
        padding: '32px 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        cursor: 'default',
        transition: 'all 0.3s ease',
        paddingLeft: hover ? '8px' : '0',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p
        style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: '48px',
          color: hover ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.12)',
          fontWeight: 400,
          lineHeight: 1,
          alignSelf: 'start',
          transition: 'color 0.3s ease',
        }}
      >
        {number}
      </p>
      <div
        style={{
          background: hover ? 'rgba(168,149,120,0.5)' : 'rgba(255,255,255,0.1)',
          alignSelf: 'stretch',
          transition: 'background 0.3s ease',
        }}
      />
      <div>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: '12px',
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

export function ProcessSection() {
  const t = useTranslations('process')
  const steps = (t.raw('steps') as Step[]) || []

  return (
    <section className="py-16 md:py-20 lg:py-24 px-6 md:px-10" style={{ background: '#a89578' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-20 lg:mb-[80px]">
          <h2
            className="font-garamond font-normal mb-4"
            style={{
              fontSize: 'clamp(40px, 8vw, 96px)',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1,
            }}
          >
            {t('title')}
          </h2>
          <p
            className="font-inter font-medium uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {t('subtitle')}
          </p>
        </div>
        <div className="space-y-0">
          {steps.map((step) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.desc}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
