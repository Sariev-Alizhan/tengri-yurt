'use client';

import Image from 'next/image';
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
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(100px, 14vw, 180px) clamp(24px, 6vw, 64px)',
      }}
    >
      {/* Photo background — same treatment as footer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/images/background.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15, 10, 5, 0.82)',
        }} />
      </div>

      {/* Decorative circles — Kazakh geometric */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        borderRadius: '50%', border: '1px solid rgba(201,168,110,0.08)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', width: '820px', height: '820px',
        borderRadius: '50%', border: '1px solid rgba(201,168,110,0.04)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, ...revealStyle(visible) }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.3em',
          color: 'rgba(201,168,110,0.7)',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          {label ?? t('label')}
        </p>

        <h2 className="font-garamond" style={{
          fontSize: 'clamp(32px, 7vw, 72px)',
          color: 'rgba(255,255,255,0.93)',
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          marginBottom: '20px',
        }}>
          {title ?? t('title')}
        </h2>

        <p className="font-garamond italic" style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'rgba(255,255,255,0.55)',
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
