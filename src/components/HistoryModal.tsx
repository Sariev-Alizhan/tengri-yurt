'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

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
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'historyOverlayIn 0.35s ease forwards',
      }}
    >
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        aria-label="Close"
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10, 8, 5, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          cursor: 'pointer',
        }}
      />

      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: 'min(85dvh, 800px)',
          background: '#13100d',
          border: '1px solid rgba(168,149,120,0.18)',
          borderRadius: '2px',
          display: 'flex',
          flexDirection: 'column',
          animation: 'historyModalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,149,120,0.06)',
        }}
      >
        {/* Top accent line */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(168,149,120,0.6) 30%, rgba(168,149,120,0.6) 70%, transparent)',
          borderRadius: '2px 2px 0 0',
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: 'clamp(28px, 4vw, 48px) clamp(24px, 4vw, 48px) 0',
          flexShrink: 0,
        }}>
          <div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(168,149,120,0.65)',
              marginBottom: '12px',
            }}>
              Heritage · 3000 Years
            </p>
            <h2 style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.15,
              margin: 0,
            }}>
              {t('title')}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              marginLeft: '24px',
              marginTop: '4px',
              flexShrink: 0,
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '20px',
              lineHeight: 1,
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(168,149,120,0.5)';
              e.currentTarget.style.color = 'rgba(168,149,120,0.9)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            ×
          </button>
        </div>

        {/* Divider */}
        <div style={{
          margin: '24px clamp(24px, 4vw, 48px) 0',
          height: '1px',
          background: 'linear-gradient(90deg, rgba(168,149,120,0.3), transparent)',
          flexShrink: 0,
        }} />

        {/* Scrollable content */}
        <div style={{
          overflowY: 'auto',
          padding: 'clamp(20px, 3vw, 32px) clamp(24px, 4vw, 48px) clamp(28px, 4vw, 48px)',
          WebkitOverflowScrolling: 'touch' as const,
        }}>
          <p style={bodyStyle}>{t('intro')}</p>

          <SectionBlock title={t('origins_title')} text={t('origins_text')} />
          <SectionBlock title={t('history_title')} text={t('history_text')} />
          <SectionBlock title={t('structure_title')} text={t('structure_text')} />
          <SectionBlock title={t('modern_title')} text={t('modern_text')} />

          <p style={{
            ...bodyStyle,
            marginTop: '32px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.55)',
          }}>
            {t('conclusion')}
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes historyOverlayIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes historyModalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}

const bodyStyle: React.CSSProperties = {
  fontFamily: 'EB Garamond, serif',
  fontSize: 'clamp(15px, 2vw, 17px)',
  fontWeight: 400,
  color: 'rgba(255,255,255,0.72)',
  lineHeight: 1.85,
  marginBottom: '16px',
};

function SectionBlock({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ marginTop: '28px' }}>
      <h3 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(168,149,120,0.7)',
        marginBottom: '10px',
      }}>
        {title}
      </h3>
      <p style={bodyStyle}>{text}</p>
    </div>
  );
}
