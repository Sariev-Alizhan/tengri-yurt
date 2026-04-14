'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isNight = theme === 'night'

  return (
    <button
      onClick={toggle}
      aria-label={isNight ? 'Switch to day mode' : 'Switch to night mode'}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.75)',
        transition: 'background 0.2s, border-color 0.2s, color 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.14)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'
        e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
        e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
      }}
    >
      {isNight ? (
        // Sun icon (switch to day)
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.25" fill="none"/>
          <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
        </svg>
      ) : (
        // Moon icon (switch to night)
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M13 9.5a6 6 0 0 1-7.5-7.5 6.5 6.5 0 1 0 7.5 7.5Z" stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}
