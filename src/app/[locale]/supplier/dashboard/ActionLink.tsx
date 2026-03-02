'use client'

import Link from 'next/link'
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
        padding: '16px 20px',
        border: '1px solid rgba(168,149,120,0.15)',
        textDecoration: 'none',
        color: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        letterSpacing: '0.05em',
        transition: 'all 0.2s',
        background: isHovered ? 'rgba(168,149,120,0.06)' : 'transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ fontFamily: 'monospace', fontSize: '16px', color: 'rgba(168,149,120,0.5)' }}>
        {icon}
      </span>
      {label}
    </Link>
  )
}
