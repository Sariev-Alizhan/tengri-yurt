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
        padding: 'clamp(20px, 5vw, 40px)',
        border: `1px solid ${hover ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)'}`,
        background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        ...revealStyle(visible, index * 0.15),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p
        className="font-garamond pointer-events-none select-none"
        style={{
          fontSize: 'clamp(40px, 10vw, 80px)',
          lineHeight: 0.8,
          color: 'rgba(255,255,255,0.15)',
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
          fontSize: 'clamp(14px, 2.5vw, 18px)',
          fontStyle: 'italic',
          color: 'var(--text-2)',
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
          background: 'var(--border)',
          marginBottom: '20px',
        }}
      />
      <p
        className=""
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-3)',
          marginBottom: '4px',
        }}
      >
        {name}
      </p>
      <p
        className=""
        style={{
          fontSize: '11px',
          color: 'var(--text-4)',
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
      style={{ background: 'var(--bg-alt)' }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <p
          className="text-xs uppercase mb-2"
          style={{
            letterSpacing: '0.15em',
            color: 'var(--text-2)',
            ...revealStyle(visible),
          }}
        >
          {t('label')}
        </p>
        <h2
          className="font-garamond mb-12 md:mb-16"
          style={{
            fontSize: 'clamp(36px, 6vw, 60px)',
            color: 'var(--text-1)',
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
