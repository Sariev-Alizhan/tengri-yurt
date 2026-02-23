'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

type Props = {
  label?: string;
  title?: string;
  subtitle?: string;
};

export function BookNowCTA({ label, title, subtitle }: Props) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('cta');
  const { ref, visible } = useScrollReveal();

  return (
    <section
      ref={ref}
      style={{
        background: '#a89578',
        padding: 'clamp(60px, 10vw, 140px) clamp(20px, 5vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.04)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ textAlign: 'center', position: 'relative', ...revealStyle(visible) }}>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.45)',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          {label ?? t('label')}
        </p>

        <h2
          style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(32px, 7vw, 80px)',
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '20px',
          }}
        >
          {title ?? t('title')}
        </h2>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 2vw, 16px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '100%',
            margin: '0 auto 40px',
            lineHeight: '1.8',
          }}
        >
          {subtitle ?? t('subtitle')}
        </p>

        <Link
          href={`/${locale}/catalog`}
          style={{
            display: 'inline-block',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.55)',
            color: 'rgba(255,255,255,0.9)',
            padding: 'clamp(10px, 2vw, 14px) clamp(24px, 5vw, 48px)',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(10px, 1.5vw, 12px)',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 0,
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#7a6a54';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
          }}
        >
          {t('button')}
        </Link>
      </div>
    </section>
  );
}
