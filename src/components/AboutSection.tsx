'use client';

import { useState } from 'react';
import { HistoryModal } from './HistoryModal';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

export function AboutSection({
  aboutTitle,
  aboutText,
  discoverBtnLabel,
}: {
  aboutTitle: string;
  aboutText: string;
  discoverBtnLabel: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { ref, visible } = useScrollReveal();

  return (
    <>
      <section
        ref={ref}
        style={{
          padding: 'clamp(80px, 14vw, 160px) clamp(24px, 6vw, 64px)',
          background: '#a89578',
          position: 'relative',
        }}
      >
        {/* Subtle geometric pattern — Kazakh ornament feel */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(
            60deg,
            rgba(255,255,255,0.015) 0px,
            rgba(255,255,255,0.015) 1px,
            transparent 1px,
            transparent 40px
          )`,
          pointerEvents: 'none',
        }} />

        <div className="max-w-4xl mx-auto text-center relative" style={revealStyle(visible)}>
          {/* Eyebrow */}
          <p style={{
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '24px',
          }}>
            Heritage
          </p>

          <h2 className="font-garamond" style={{
            fontSize: 'clamp(36px, 7vw, 72px)',
            color: 'rgba(255,255,255,0.95)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            {aboutTitle}
          </h2>

          {/* Gold divider */}
          <div style={{
            width: '60px', height: '1px',
            background: 'rgba(168,149,120,0.6)',
            margin: '32px auto',
          }} />

          <p className="font-garamond" style={{
            fontSize: 'clamp(16px, 2.2vw, 19px)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8,
            maxWidth: '600px',
            margin: '0 auto 48px',
            fontWeight: 300,
            fontStyle: 'italic',
          }}>
            {aboutText}
          </p>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn-book"
          >
            {discoverBtnLabel}
          </button>
        </div>
      </section>
      <HistoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
