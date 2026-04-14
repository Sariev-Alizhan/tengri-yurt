'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

const textStyle: React.CSSProperties = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 'clamp(16px, 3.5vw, 18px)',
  fontWeight: 400,
  color: 'rgba(255,255,255,0.8)',
  lineHeight: '1.85',
  marginBottom: '20px',
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: 'EB Garamond, serif',
  fontSize: '22px',
  color: 'rgba(255,255,255,0.9)',
  fontWeight: 400,
  marginTop: '32px',
  marginBottom: '12px',
};

export function HistoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations('modal');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitOverflowScrolling: 'touch' }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        className="absolute inset-0"
        style={{ background: 'rgba(30, 25, 18, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        aria-label="Close"
      />
      <div
        className="relative overflow-y-auto scrollbar-hide my-auto"
        style={{
          width: '92%',
          maxWidth: '720px',
          maxHeight: 'min(88dvh, calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 32px))',
          background: '#a89578',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: 'clamp(24px, 5vw, 64px)',
          animation: 'historyModalIn 0.3s ease forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-[28px] cursor-pointer leading-none p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,1)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
          aria-label="Close"
        >
          ×
        </button>

        <h2
          className="font-garamond font-normal mb-8"
          style={{ fontSize: 'clamp(24px, 5vw, 42px)', color: 'rgba(255,255,255,0.95)', lineHeight: 1.2 }}
        >
          {t('title')}
        </h2>

        <p style={textStyle}>{t('intro')}</p>

        <h3 style={subtitleStyle}>{t('origins_title')}</h3>
        <p style={textStyle}>{t('origins_text')}</p>

        <h3 style={subtitleStyle}>{t('history_title')}</h3>
        <p style={textStyle}>{t('history_text')}</p>

        <h3 style={subtitleStyle}>{t('structure_title')}</h3>
        <p style={textStyle}>{t('structure_text')}</p>

        <h3 style={subtitleStyle}>{t('modern_title')}</h3>
        <p style={textStyle}>{t('modern_text')}</p>

        <p style={{ ...textStyle, marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '24px' }}>
          {t('conclusion')}
        </p>
      </div>
    </div>
  );
}
