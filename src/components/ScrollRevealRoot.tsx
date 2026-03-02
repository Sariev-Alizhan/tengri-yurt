'use client'

import { useEffect } from 'react'

function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

export function ScrollRevealRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (isInViewport(el)) el.classList.add('revealed')
      })
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed')
        })
      },
      { threshold: 0.01, rootMargin: '0px' }
    )
    const els = document.querySelectorAll('.reveal')
    els.forEach((el) => observer.observe(el))
    reveal()
    const t1 = setTimeout(reveal, 150)
    const t2 = setTimeout(reveal, 500)
    return () => {
      observer.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])
  return <>{children}</>
}
