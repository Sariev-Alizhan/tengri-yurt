'use client'

const MARQUEE_ITEMS = [
  'Traditional Craftsmanship', '·', 'Master Artisans', '·', 'Kazakhstan', '·',
  'Since 2010', '·', 'Global Delivery', '·', 'Premium Materials', '·',
  'Traditional Craftsmanship', '·', 'Master Artisans', '·', 'Kazakhstan', '·',
  'Since 2010', '·', 'Global Delivery', '·', 'Premium Materials',
]

export function MarqueeSection() {
  return (
    <div
      style={{
        overflow: 'hidden',
        padding: '20px 0',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
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
              fontSize: '20px',
              fontStyle: item === '·' ? 'normal' : 'italic',
              color: item === '·' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.35)',
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
