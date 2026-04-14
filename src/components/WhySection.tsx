'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

type WhyItem = { title: string; desc: string };

function WhyCard({ item, index }: { item: WhyItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setCardVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        padding: 'clamp(28px, 5vw, 48px)',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        gap: 'clamp(16px, 3vw, 32px)',
        alignItems: 'flex-start',
        ...revealStyle(cardVisible, index * 0.08),
      }}
    >
      {/* Number */}
      <span className="font-garamond" style={{
        fontSize: 'clamp(28px, 4vw, 40px)',
        fontWeight: 300,
        color: 'rgba(168,149,120,0.4)',
        lineHeight: 1,
        flexShrink: 0,
        width: '48px',
      }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      <div>
        <h3 className="font-garamond" style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          color: 'var(--text-1)',
          fontWeight: 400,
          marginBottom: '8px',
          lineHeight: 1.2,
        }}>
          {item.title}
        </h3>
        <p style={{
          fontSize: 'clamp(14px, 1.6vw, 15px)',
          color: 'var(--text-2)',
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          {item.desc}
        </p>
      </div>
    </div>
  );
}

export function WhySection() {
  const t = useTranslations('why');
  const { ref, visible } = useScrollReveal();
  const items = (t.raw('items') as WhyItem[]) || [];

  return (
    <section
      ref={ref}
      style={{
        background: 'var(--bg-alt)',
        padding: 'clamp(80px, 12vw, 140px) 0',
      }}
    >
      <div className="max-w-5xl mx-auto" style={{ padding: '0 clamp(24px, 5vw, 48px)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(40px, 8vw, 80px)', textAlign: 'center', ...revealStyle(visible) }}>
          <p style={{
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '20px',
          }}>
            Why Tengri Yurt
          </p>
          <h2 className="font-garamond" style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            color: 'var(--text-1)',
            lineHeight: 1,
            fontWeight: 300,
            letterSpacing: '-0.02em',
          }}>
            {t('title')}
          </h2>
        </div>

        {/* Stats — clean horizontal */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(40px, 8vw, 80px)',
          padding: 'clamp(32px, 6vw, 48px) 0',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          marginBottom: 'clamp(40px, 8vw, 64px)',
          flexWrap: 'wrap',
          ...revealStyle(visible, 0.15),
        }}>
          {((t.raw('stats') as { num: string; label: string }[]) || [
            { num: '15+', label: 'Years of craft' },
            { num: '10+', label: 'Countries' },
            { num: '200+', label: 'Yurts built' },
            { num: '40+', label: 'Artisans' },
          ]).map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p className="font-garamond" style={{
                fontSize: 'clamp(36px, 6vw, 56px)',
                color: 'var(--text-1)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '6px',
              }}>
                {stat.num}
              </p>
              <p style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-3)',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Feature list — vertical, editorial */}
        <div className="max-w-2xl mx-auto">
          {items.map((item, i) => (
            <WhyCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
