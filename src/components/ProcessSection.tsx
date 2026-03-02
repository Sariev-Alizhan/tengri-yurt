'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

type Step = { number: string; title: string; desc: string }

function ProcessStep({
  number,
  title,
  description,
  isLast,
}: {
  number: string
  title: string
  description: string
  isLast: boolean
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        gap: '40px',
        padding: '0 0 64px 0',
        cursor: 'default',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Left side - number, dot, and line */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Number */}
        <p
          style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 400,
            lineHeight: 1,
            paddingTop: '4px',
          }}
        >
          {number}
        </p>
        
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          {!isLast && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '16px',
                bottom: '-64px',
                width: '1px',
                background: 'rgba(255,255,255,0.2)',
                transform: 'translateX(-50%)',
              }}
            />
          )}
          {/* Dot */}
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: hover ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
              marginTop: '6px',
              position: 'relative',
              zIndex: 1,
              transition: 'all 0.3s ease',
              border: '2px solid #a89578',
            }}
          />
        </div>
      </div>

      {/* Right side - content */}
      <div style={{ paddingTop: '0' }}>
        <h3
          style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(20px, 3vw, 28px)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '16px',
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(14px, 1.8vw, 16px)',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.8,
            fontWeight: 300,
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
        <div className="mb-12 md:mb-20 lg:mb-[80px] text-center">
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
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.desc}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
