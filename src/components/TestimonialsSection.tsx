'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

type TestimonialItem = { text: string; name: string; role: string };

function TestimonialCard({
  quote,
  name,
  role,
  index,
}: {
  quote: string;
  name: string;
  role: string;
  index: number;
}) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <blockquote
      ref={ref}
      className="relative transition-[border-color,background] duration-300"
      style={{
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: hover ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(8px)',
        borderColor: hover ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
        ...revealStyle(visible, index * 0.15),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p
        className="font-garamond pointer-events-none select-none"
        style={{
          fontSize: '80px',
          lineHeight: 0.8,
          color: 'rgba(255,255,255,0.06)',
          marginBottom: '20px',
          fontStyle: 'normal',
        }}
        aria-hidden
      >
        &ldquo;
      </p>
      <p
        className="font-garamond italic relative z-10"
        style={{
          fontSize: '18px',
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.8,
          marginBottom: '32px',
        }}
      >
        {quote}
      </p>
      <div
        style={{
          width: '32px',
          height: '1px',
          background: 'rgba(255,255,255,0.2)',
          marginBottom: '20px',
        }}
      />
      <p
        className="font-inter"
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '4px',
        }}
      >
        {name}
      </p>
      <p
        className="font-inter"
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.05em',
        }}
      >
        {role}
      </p>
    </blockquote>
  );
}

export function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const { ref, visible } = useScrollReveal();
  const items = (t.raw('items') as TestimonialItem[]) || [];

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 lg:py-24 px-6 md:px-10"
      style={{ background: '#a89578' }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <p
          className="font-inter text-xs uppercase mb-2"
          style={{
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.5)',
            ...revealStyle(visible),
          }}
        >
          {t('label')}
        </p>
        <h2
          className="font-garamond mb-12 md:mb-16"
          style={{
            fontSize: 'clamp(36px, 6vw, 60px)',
            color: 'rgba(255,255,255,0.95)',
            ...revealStyle(visible, 0.1),
          }}
        >
          {t('title')}
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 'clamp(20px, 4vw, 40px)',
          }}
        >
          {items.map((tst, i) => (
            <TestimonialCard
              key={tst.name}
              quote={tst.text}
              name={tst.name}
              role={tst.role}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
