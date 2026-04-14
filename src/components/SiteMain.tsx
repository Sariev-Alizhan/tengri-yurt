export function SiteMain({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-0 w-full flex-1 overflow-x-hidden">
      {children}
    </main>
  )
}
