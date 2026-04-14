'use client'

const MARQUEE_ITEMS = [
  '42 Countries', '·', 'UNESCO Heritage 2018', '·', '200+ Yurts Delivered', '·',
  'Founded Almaty 2010', '·', '14-Year Warranty', '·', '40+ Master Ustalar', '·',
  '6 Continents', '·', 'Hand-built. No Factory.', '·', 'Worldwide Assembly', '·',
  '42 Countries', '·', 'UNESCO Heritage 2018', '·', '200+ Yurts Delivered', '·',
  'Founded Almaty 2010', '·', '14-Year Warranty', '·', '40+ Master Ustalar',
]

export function MarqueeSection() {
  return (
    <div
      style={{
        overflow: 'hidden',
        padding: '20px 0',
        background: '#1a1510',
        borderTop: '1px solid rgba(168,149,120,0.12)',
        borderBottom: '1px solid rgba(168,149,120,0.12)',
        marginBottom: '80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '48px',
          animation: 'marquee 20s linear infinite',
          width: 'max-content',
        }}
      >
        {MARQUEE_ITEMS.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(14px, 2.5vw, 20px)',
              fontStyle: item === '·' ? 'normal' : 'italic',
              color: item === '·' ? 'rgba(168,149,120,0.35)' : 'rgba(200,175,140,0.85)',
              whiteSpace: 'nowrap',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
