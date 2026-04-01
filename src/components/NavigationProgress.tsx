'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from '@/i18n/navigation'

/**
 * Thin progress bar at top of page during Next.js navigation.
 * Shows immediately on route change, completes when new page loads.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const prevPath = useRef(pathname)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    // pathname changed = navigation started, now completing
    if (prevPath.current !== pathname) {
      // Complete the bar
      setProgress(100)
      const hide = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)
      prevPath.current = pathname
      if (timerRef.current) clearInterval(timerRef.current)
      return () => clearTimeout(hide)
    }
  }, [pathname])

  // Intercept clicks on links to start the bar before navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || anchor.hasAttribute('download')) return
      // Internal navigation — start progress
      setVisible(true)
      setProgress(20)
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + (90 - prev) * 0.1
        })
      }, 200)
    }
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!visible && progress === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '2px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, rgba(168,149,120,0.6), rgba(168,149,120,0.9))',
          transition: progress === 100 ? 'width 0.2s ease-out, opacity 0.3s ease 0.1s' : 'width 0.4s ease',
          opacity: progress === 100 ? 0 : 1,
          boxShadow: '0 0 8px rgba(168,149,120,0.4)',
        }}
      />
    </div>
  )
}
