'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

type Props = {
  label?: string;
  title?: string;
  subtitle?: string;
};

export function BookNowCTA({ label, title, subtitle }: Props) {
  const t = useTranslations('cta');
  const { ref, visible } = useScrollReveal();

  return (
    <section
      ref={ref}
      style={{
        background: '#a89578',
        padding: 'clamp(100px, 14vw, 180px) clamp(24px, 6vw, 64px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles — subtle Kazakh geometric */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        borderRadius: '50%', border: '1px solid rgba(168,149,120,0.08)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '800px', height: '800px',
        borderRadius: '50%', border: '1px solid rgba(168,149,120,0.04)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', ...revealStyle(visible) }}>
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.3em',
          color: 'rgba(168,149,120,0.6)',
          textTransform: 'uppercase',
          marginBottom: '28px',
        }}>
          {label ?? t('label')}
        </p>

        <h2 className="font-garamond" style={{
          fontSize: 'clamp(32px, 7vw, 72px)',
          color: 'rgba(255,255,255,0.92)',
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          marginBottom: '24px',
        }}>
          {title ?? t('title')}
        </h2>

        <p className="font-garamond italic" style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'rgba(255,255,255,0.75)',
          maxWidth: '480px',
          margin: '0 auto 48px',
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          {subtitle ?? t('subtitle')}
        </p>

        <Link href="/catalog" className="btn-book">
          {t('button')}
        </Link>
      </div>
    </section>
  );
}
