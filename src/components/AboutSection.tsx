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
          padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 48px)',
          background: '#a89578',
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.02) 0px,
            rgba(255,255,255,0.02) 1px,
            transparent 1px,
            transparent 16px
          )`,
        }}
      >
        <div className="max-w-6xl mx-auto text-center" style={revealStyle(visible)}>
          <h2 className="font-garamond mb-6" style={{ fontSize: 'clamp(36px, 7vw, 80px)', color: 'rgba(255,255,255,0.95)' }}>
            {aboutTitle}
          </h2>
          <p className="font-inter font-light max-w-3xl mx-auto mb-10 leading-relaxed" style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'rgba(255,255,255,0.7)' }}>
            {aboutText}
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={{
              border: '1px solid rgba(255,255,255,0.5)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.85)',
              padding: '12px 36px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: 0,
              transition: 'all 0.2s ease',
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {discoverBtnLabel}
          </button>
        </div>
      </section>
      <HistoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
