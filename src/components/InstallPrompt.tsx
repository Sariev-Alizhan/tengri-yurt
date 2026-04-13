'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const LABELS: Record<string, {
  title: string;
  iosInstruction: string;
  installBtn: string;
  dismiss: string;
}> = {
  en: {
    title: 'Add to Home Screen',
    iosInstruction: 'Tap the Share button, then "Add to Home Screen"',
    installBtn: 'Install App',
    dismiss: 'Not now',
  },
  ru: {
    title: 'Добавить на рабочий стол',
    iosInstruction: 'Нажмите «Поделиться», затем «На экран «Домой»»',
    installBtn: 'Установить',
    dismiss: 'Не сейчас',
  },
  kk: {
    title: 'Жұмыс үстеліне қосу',
    iosInstruction: '«Бөлісу» батырмасын басыңыз, содан кейін «Басты экранға қосу»',
    installBtn: 'Орнату',
    dismiss: 'Кейінірек',
  },
  zh: {
    title: '添加到主屏幕',
    iosInstruction: '点击"分享"按钮，然后选择"添加到主屏幕"',
    installBtn: '安装应用',
    dismiss: '暂不',
  },
  ar: {
    title: 'أضف إلى الشاشة الرئيسية',
    iosInstruction: 'اضغط على زر "مشاركة"، ثم "إضافة إلى الشاشة الرئيسية"',
    installBtn: 'تثبيت التطبيق',
    dismiss: 'ليس الآن',
  },
};

export function InstallPrompt() {
  const locale = useLocale();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const l = LABELS[locale] || LABELS.en;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('pwa-dismissed')) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    if (isIOS && isSafari) {
      const timer = setTimeout(() => setShowIOS(true), 5000);
      return () => clearTimeout(timer);
    }

    // Android/Desktop — listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
    else handleDismiss();
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    setShowIOS(false);
    setDeferredPrompt(null);
    localStorage.setItem('pwa-dismissed', '1');
  }, []);

  if (dismissed) return null;
  if (!deferredPrompt && !showIOS) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: showIOS ? '90px' : '90px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 45,
        width: 'min(calc(100% - 32px), 380px)',
        padding: '16px 20px',
        background: '#1A1510',
        border: '1px solid rgba(168,149,120,0.3)',
        borderRadius: '2px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          className="font-garamond"
          style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)' }}
        >
          {l.title}
        </span>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          &times;
        </button>
      </div>

      {showIOS ? (
        <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
          {l.iosInstruction}
          <span style={{ display: 'inline-block', margin: '0 4px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(168,149,120,0.8)" strokeWidth="1.5">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </p>
      ) : (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleInstall}
            className="font-inter"
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'rgba(168,149,120,0.2)',
              border: '1px solid rgba(168,149,120,0.4)',
              color: 'rgba(255,255,255,0.9)',
              cursor: 'pointer',
              borderRadius: '2px',
            }}
          >
            {l.installBtn}
          </button>
          <button
            onClick={handleDismiss}
            className="font-inter"
            style={{
              padding: '10px 16px',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              borderRadius: '2px',
            }}
          >
            {l.dismiss}
          </button>
        </div>
      )}
    </div>
  );
}
