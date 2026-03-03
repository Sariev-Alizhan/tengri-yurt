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
      className="supplier-action-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        textDecoration: 'none',
        color: isHovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.04em',
        background: 'rgba(26,21,16,0.6)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ fontFamily: 'monospace', fontSize: '18px', color: 'rgba(168,149,120,0.7)', width: '28px', textAlign: 'center' }}>
        {icon}
      </span>
      {label}
    </Link>
  )
}
