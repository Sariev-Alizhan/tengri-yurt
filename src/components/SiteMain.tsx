'use client'

import { usePathname } from 'next/navigation'

/** Отступ снизу под фиксированный музыкальный фундамент (кроме кабинета поставщика). */
export function SiteMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideMusic = pathname?.includes('/supplier/')

  return (
    <main
      className={
        hideMusic
          ? 'relative z-10 min-h-screen overflow-x-hidden'
          : 'relative z-10 min-h-screen overflow-x-hidden pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-[calc(72px+env(safe-area-inset-bottom,0px))]'
      }
    >
      {children}
    </main>
  )
}
