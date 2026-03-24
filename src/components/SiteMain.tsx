'use client'

/** flex-1: заполняет пространство между навбаром и музыкальным футером (CartLayout).
 *  Плеер в потоке документа под main — не перекрывает контент на ноуте и телефоне.
 *  Без z-index на main: fixed-модалки остаются поверх остального UI. */
export function SiteMain({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-0 w-full flex-1 overflow-x-hidden">
      {children}
    </main>
  )
}
