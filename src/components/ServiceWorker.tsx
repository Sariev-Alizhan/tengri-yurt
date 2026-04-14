'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

const MSGS: Record<string, { update: string; refresh: string; dismiss: string }> = {
  en: { update: 'New version available', refresh: 'Refresh', dismiss: '✕' },
  ru: { update: 'Доступна новая версия', refresh: 'Обновить', dismiss: '✕' },
  kk: { update: 'Жаңа нұсқа қол жетімді', refresh: 'Жаңарту', dismiss: '✕' },
  zh: { update: '新版本可用', refresh: '刷新', dismiss: '✕' },
  ar: { update: 'إصدار جديد متاح', refresh: 'تحديث', dismiss: '✕' },
};

export function ServiceWorker() {
  const locale = useLocale();
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    let refreshing = false;

    // When the new SW takes control, reload the page
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        // Check for a waiting worker on first load (e.g. returning user)
        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          setShowUpdate(true);
        }

        // Watch for new SW installing
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;

          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available — show the toast
              setWaitingWorker(installing);
              setShowUpdate(true);
            }
          });
        });

        // Periodically check for updates (every 30 min)
        const interval = setInterval(() => reg.update(), 30 * 60 * 1000);
        return () => clearInterval(interval);
      })
      .catch(() => {
        // SW registration failed silently (localhost http, incognito, etc.)
      });
  }, []);

  const handleRefresh = () => {
    waitingWorker?.postMessage('skipWaiting');
    setShowUpdate(false);
  };

  const m = MSGS[locale] ?? MSGS.en;

  if (!showUpdate) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 16px 11px 20px',
        background: '#1A1510',
        border: '1px solid rgba(201,168,110,0.4)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        borderRadius: '2px',
        whiteSpace: 'nowrap',
        maxWidth: 'calc(100vw - 32px)',
        animation: 'slideDownIn 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Dot indicator */}
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'rgba(100,220,130,0.9)',
        flexShrink: 0,
        boxShadow: '0 0 6px rgba(100,220,130,0.6)',
      }} />

      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.85)',
        fontWeight: 400,
      }}>
        {m.update}
      </span>

      <button
        onClick={handleRefresh}
        style={{
          padding: '5px 14px',
          background: 'rgba(201,168,110,0.14)',
          border: '1px solid rgba(201,168,110,0.45)',
          color: 'rgba(201,168,110,0.95)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          borderRadius: '2px',
          transition: 'background 0.15s',
        }}
      >
        {m.refresh}
      </button>

      <button
        onClick={() => setShowUpdate(false)}
        aria-label="Dismiss"
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '4px',
          lineHeight: 1,
        }}
      >
        {m.dismiss}
      </button>

      <style>{`
        @keyframes slideDownIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
