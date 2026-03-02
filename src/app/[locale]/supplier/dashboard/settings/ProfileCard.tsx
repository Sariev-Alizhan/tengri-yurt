'use client';

import { ReactNode } from 'react';

export function ProfileCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(168,149,120,0.06)',
        border: '1px solid rgba(168,149,120,0.2)',
        padding: '28px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(168,149,120,0.08)';
        e.currentTarget.style.borderColor = 'rgba(168,149,120,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(168,149,120,0.06)';
        e.currentTarget.style.borderColor = 'rgba(168,149,120,0.2)';
      }}
    >
      {children}
    </div>
  );
}
