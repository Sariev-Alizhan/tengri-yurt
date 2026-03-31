'use client'

import { useState } from 'react'

export type Rental = {
  id: string
  yurt_slug: string
  yurt_name: string
  client_name: string
  client_phone: string
  message: string | null
  status: string
  created_at: string
}

const STATUSES = ['new', 'contacted', 'confirmed', 'cancelled']

export function RentalsList({
  rentals,
  statusLabels,
  noRentalsLabel,
  clientLabel,
  phoneLabel,
  yurtLabel,
  messageLabel,
  dateLabel,
}: {
  rentals: Rental[]
  statusLabels: Record<string, string>
  noRentalsLabel: string
  clientLabel: string
  phoneLabel: string
  yurtLabel: string
  messageLabel: string
  dateLabel: string
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/rent/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (!res.ok) throw new Error()
      window.location.reload()
    } catch {
      setUpdatingId(null)
    }
  }

  if (rentals.length === 0) {
    return (
      <div style={{
        padding: '48px 24px',
        textAlign: 'center',
        border: '1px solid rgba(168,149,120,0.15)',
        background: 'rgba(168,149,120,0.03)',
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.05em',
        }}>
          {noRentalsLabel}
        </p>
      </div>
    )
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const statusColor = (s: string) => {
    if (s === 'new') return { text: 'rgba(100,200,255,0.85)', border: 'rgba(100,200,255,0.3)', bg: 'rgba(100,200,255,0.08)' }
    if (s === 'contacted') return { text: 'rgba(255,200,100,0.85)', border: 'rgba(255,200,100,0.3)', bg: 'rgba(255,200,100,0.08)' }
    if (s === 'confirmed') return { text: 'rgba(100,255,150,0.85)', border: 'rgba(100,255,150,0.3)', bg: 'rgba(100,255,150,0.08)' }
    return { text: 'rgba(255,100,100,0.7)', border: 'rgba(255,100,100,0.3)', bg: 'rgba(255,100,100,0.08)' }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {rentals.map((r) => {
        const sc = statusColor(r.status)
        return (
          <div
            key={r.id}
            style={{
              background: 'rgba(168,149,120,0.04)',
              border: '1px solid rgba(168,149,120,0.15)',
              padding: '24px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(168,149,120,0.06)'
              e.currentTarget.style.borderColor = 'rgba(168,149,120,0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(168,149,120,0.04)'
              e.currentTarget.style.borderColor = 'rgba(168,149,120,0.15)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                {/* Yurt name */}
                <h2 style={{
                  fontFamily: 'EB Garamond, serif',
                  fontSize: '22px',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 400,
                  marginBottom: '4px',
                }}>
                  {r.yurt_name}
                </h2>

                {/* Status badge */}
                <span style={{
                  display: 'inline-block',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: sc.text,
                  padding: '4px 10px',
                  border: `1px solid ${sc.border}`,
                  background: sc.bg,
                  marginBottom: '16px',
                }}>
                  {statusLabels[r.status] ?? r.status}
                </span>

                {/* Client info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '12px', borderTop: '1px solid rgba(168,149,120,0.1)' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(168,149,120,0.75)', minWidth: '70px' }}>
                      {clientLabel}
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                      {r.client_name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(168,149,120,0.75)', minWidth: '70px' }}>
                      {phoneLabel}
                    </span>
                    <a
                      href={`tel:${r.client_phone}`}
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(168,149,120,0.9)', textDecoration: 'none' }}
                    >
                      {r.client_phone}
                    </a>
                  </div>
                  {r.message && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(168,149,120,0.75)', minWidth: '70px' }}>
                        {messageLabel}
                      </span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                        {r.message}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginTop: '4px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(168,149,120,0.75)', minWidth: '70px' }}>
                      {dateLabel}
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', minWidth: '180px' }}>
                <select
                  value={r.status}
                  disabled={!!updatingId}
                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    padding: '10px 16px',
                    background: 'rgba(168,149,120,0.08)',
                    border: '1px solid rgba(168,149,120,0.3)',
                    color: 'rgba(255,255,255,0.85)',
                    cursor: updatingId ? 'not-allowed' : 'pointer',
                    opacity: updatingId ? 0.5 : 1,
                    outline: 'none',
                    width: '100%',
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} style={{ background: '#0f0d0a', color: 'rgba(255,255,255,0.85)' }}>
                      {statusLabels[s] ?? s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
