'use client'

import { usePathname } from 'next/navigation'

/** Отступ снизу под фиксированный музыкальный футер (высота из MusicPlayer → --music-foundation-height).
 *  Без z-index на main: fixed-модалки выше плеера (z-15), не прячутся под ним. */
export function SiteMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideMusic = pathname?.includes('/supplier/')

  return (
    <main
      className={
        hideMusic
          ? 'relative min-h-0 w-full flex-1 overflow-x-hidden'
          : 'relative min-h-0 w-full flex-1 overflow-x-hidden pb-[var(--music-foundation-height,72px)]'
      }
    >
      {children}
    </main>
  )
}
