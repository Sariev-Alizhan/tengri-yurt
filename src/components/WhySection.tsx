'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

type WhyItem = { title: string; desc: string };

function WhyCard({
  item,
  index,
}: {
  item: WhyItem;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [hover, setHover] = useState(false);
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
      className="cursor-default transition-colors duration-300 relative overflow-hidden"
      style={{
        background: '#a89578',
        padding: 'clamp(24px, 4vw, 44px)',
        ...revealStyle(cardVisible, index * 0.1),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#b5a088';
        setHover(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#a89578';
        setHover(false);
      }}
    >
      <span
        className="font-garamond absolute top-4 right-4 transition-opacity duration-300 pointer-events-none"
        style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          opacity: hover ? 1 : 0,
        }}
        aria-hidden
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3
        className="font-garamond font-normal mb-3"
        style={{
          fontSize: 'clamp(18px, 2.5vw, 26px)',
          color: 'rgba(255,255,255,0.9)',
        }}
      >
        {item.title}
      </h3>
      <p
        className="font-inter font-light"
        style={{
          fontSize: 'clamp(13px, 1.5vw, 14px)',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.7,
        }}
      >
        {item.desc}
      </p>
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
        background: '#a89578',
        padding: 'clamp(64px, 10vw, 120px) 0',
      }}
    >
      <div className="max-w-[1200px] mx-auto" style={{ padding: '0 clamp(24px, 5vw, 48px)' }}>
        <h2
          className="font-garamond font-normal mb-6"
          style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1,
            ...revealStyle(visible),
          }}
        >
          {t('title')}
        </h2>
        <p
          className="font-inter font-light max-w-[600px] mb-12 md:mb-16"
          style={{
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8,
            ...revealStyle(visible, 0.1),
          }}
        >
          {t('subtitle')}
        </p>

        {/* Animated stats bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(32px, 8vw, 80px)',
            padding: '48px 0',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '60px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { num: '15+', label: 'Years of craft' },
            { num: '10+', label: 'Countries' },
            { num: '200+', label: 'Yurts built' },
            { num: '40+', label: 'Artisans' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 'clamp(32px, 5vw, 56px)',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 400,
                margin: '0 0 6px',
                letterSpacing: '-0.02em',
              }}>
                {stat.num}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div
          className="grid gap-px"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: '1px',
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          {items.map((item, i) => (
            <WhyCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
