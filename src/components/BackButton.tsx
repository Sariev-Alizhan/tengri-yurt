'use client'

import { useRouter } from '@/i18n/navigation'

export function BackButton({ label }: { label?: string }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="fixed top-[calc(env(safe-area-inset-top,0px)+clamp(56px,10vw,80px))] left-[max(12px,env(safe-area-inset-left,0px))] z-50 flex items-center gap-2 px-4 py-2.5 font-inter text-xs uppercase tracking-wider text-white/80 hover:text-white transition-all duration-200 min-h-[44px]"
      style={{
        background: 'rgba(15, 13, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label ?? 'Back'}
    </button>
  )
}
