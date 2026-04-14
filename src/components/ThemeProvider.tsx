'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'day' | 'night'
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'day', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('day')

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'day'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'day' ? 'night' : 'day'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
