'use client'

import { Link } from '@/i18n/navigation'
import { useState } from 'react'

export function ActionLink({
  href,
  icon,
  label
}: {
  href: string
  icon: string
  label: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        textDecoration: 'none',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 500,
        background: isHovered ? 'var(--sp-surface-2)' : 'var(--sp-surface)',
        border: '1px solid var(--sp-border)',
        borderRadius: '10px',
        color: isHovered ? 'var(--sp-text-1)' : 'var(--sp-text-2)',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{
        fontFamily: 'monospace',
        fontSize: '16px',
        color: 'var(--sp-gold)',
        width: '20px',
        textAlign: 'center',
        flexShrink: 0,
        opacity: 0.75,
      }}>
        {icon}
      </span>
      {label}
    </Link>
  )
}
