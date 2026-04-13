'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

type FAQItem = { question: string; answer: string };

function FAQCard({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.3s ease',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: 'clamp(16px, 3vw, 24px) 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          className="font-garamond"
          style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          {item.question}
        </span>
        <span
          style={{
            fontSize: '20px',
            color: 'rgba(168,149,120,0.6)',
            transition: 'transform 0.3s ease',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? '300px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <p
          className="font-inter"
          style={{
            fontSize: 'clamp(13px, 1.6vw, 15px)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8,
            fontWeight: 300,
            paddingBottom: 'clamp(16px, 3vw, 24px)',
            maxWidth: '600px',
          }}
        >
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const t = useTranslations('faq');
  const { ref, visible } = useScrollReveal();

  let items: FAQItem[] = [];
  try {
    items = t.raw('items') as FAQItem[];
  } catch {
    return null;
  }

  if (!items?.length) return null;

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 lg:py-24 px-6 md:px-10"
      style={{ background: '#a89578' }}
    >
      <div className="max-w-3xl mx-auto" style={revealStyle(visible)}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)' }}>
          <p
            className="font-inter"
            style={{
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '16px',
            }}
          >
            FAQ
          </p>
          <h2
            className="font-garamond"
            style={{
              fontSize: 'clamp(32px, 6vw, 56px)',
              color: 'rgba(255,255,255,1)',
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            {t('title')}
          </h2>
        </div>

        <div>
          {items.map((item, i) => (
            <FAQCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
