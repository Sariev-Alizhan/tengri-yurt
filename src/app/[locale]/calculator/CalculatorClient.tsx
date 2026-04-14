'use client'

import { useState, useMemo } from 'react'
import { Link } from '@/i18n/navigation'

const MODELS = [
  { slug: 'intimate',  name: 'Intimate',   diameter: 4,  kanat: 3, basePrice: 8500,  desc: '2–4 people' },
  { slug: 'cozy',      name: 'Cozy',        diameter: 5,  kanat: 4, basePrice: 12000, desc: '4–6 people' },
  { slug: 'classic',   name: 'Classic',     diameter: 6,  kanat: 6, basePrice: 16000, desc: '6–8 people' },
  { slug: 'spacious',  name: 'Spacious',    diameter: 7,  kanat: 8, basePrice: 22000, desc: '8–12 people' },
  { slug: 'grand',     name: 'Grand',       diameter: 9,  kanat: 12, basePrice: 32000, desc: '12–18 people' },
  { slug: 'monumental',name: 'Monumental',  diameter: 12, kanat: 16, basePrice: 55000, desc: '20+ people' },
]

const ACCESSORIES = [
  { id: 'korpe',    name: 'Korpe set',          price: 800,  desc: 'Traditional felt rugs' },
  { id: 'hammam',   name: 'Hammam module',      price: 12000, desc: 'Hot & cold plunge' },
  { id: 'heating',  name: 'Central heating',    price: 3500, desc: 'Underfloor + radiators' },
  { id: 'lighting', name: 'Ambient lighting',   price: 1200, desc: 'LED + lantern set' },
  { id: 'furniture',name: 'Furniture package',  price: 2800, desc: 'Beds, tables, seating' },
  { id: 'kitchen',  name: 'Kitchen module',     price: 4500, desc: 'Stove, sink, storage' },
]

const SHIPPING = [
  { id: 'air',  name: 'Air freight',  days: '3–10 days',   multiplier: 1.08 },
  { id: 'sea',  name: 'Sea freight',  days: '30–60 days',  multiplier: 1.02 },
  { id: 'land', name: 'Land / truck', days: '7–21 days',   multiplier: 1.04 },
]

const INTERIOR = [
  { id: 'standard',  name: 'Standard',          extra: 0 },
  { id: 'premium',   name: 'Premium felt',       extra: 3000 },
  { id: 'exclusive', name: 'Exclusive custom',   extra: 8000 },
]

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString()
}

const gold = 'rgba(201,168,110,0.9)'
const goldDim = 'rgba(201,168,110,0.15)'
const goldBorder = 'rgba(201,168,110,0.3)'
const textDim = 'rgba(255,255,255,0.45)'
const textMain = 'rgba(255,255,255,0.88)'

export function CalculatorClient({ locale }: { locale: string }) {
  const [model, setModel] = useState(MODELS[2])
  const [accessories, setAccessories] = useState<string[]>([])
  const [shipping, setShipping] = useState(SHIPPING[0])
  const [interior, setInterior] = useState(INTERIOR[0])
  const [qty, setQty] = useState(1)

  const toggleAcc = (id: string) =>
    setAccessories(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])

  const { subtotal, accTotal, interiorExtra, shippingFee, total, totalMax } = useMemo(() => {
    const subtotal = model.basePrice * qty
    const accTotal = accessories.reduce((s, id) => s + (ACCESSORIES.find(a => a.id === id)?.price ?? 0), 0)
    const interiorExtra = interior.extra * qty
    const base = subtotal + accTotal + interiorExtra
    const shippingFee = Math.round(base * (shipping.multiplier - 1))
    const total = base + shippingFee
    const totalMax = Math.round(total * 1.12)
    return { subtotal, accTotal, interiorExtra, shippingFee, total, totalMax }
  }, [model, accessories, shipping, interior, qty])

  const waText = `Hi, I used the price calculator. ${qty}x ${model.name} yurt — estimated ${fmt(total)}. Can you give me a precise quote?`

  return (
    <main style={{ minHeight: '100vh', background: '#1a1510', paddingTop: '88px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px,6vw,80px) clamp(20px,4vw,48px)' }}>

        {/* Header */}
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: goldDim.replace('0.15','0.7'), marginBottom: '16px' }}>
          Price Estimator
        </p>
        <h1 style={{ fontFamily: 'EB Garamond,serif', fontSize: 'clamp(36px,6vw,64px)', color: textMain, fontWeight: 400, margin: '0 0 8px', lineHeight: 1.1 }}>
          Build your yurt
        </h1>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: textDim, fontWeight: 300, margin: '0 0 56px', lineHeight: 1.7 }}>
          Select size, accessories and delivery to get an instant estimate. Final price confirmed after consultation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }} className="calc-grid">

          {/* LEFT — configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* Step 1: Model */}
            <Section label="01" title="Choose size">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }} className="model-grid">
                {MODELS.map(m => (
                  <button
                    key={m.slug}
                    type="button"
                    onClick={() => setModel(m)}
                    style={{
                      padding: '14px 10px',
                      border: `1px solid ${m.slug === model.slug ? goldBorder : 'rgba(255,255,255,0.08)'}`,
                      background: m.slug === model.slug ? goldDim : 'rgba(255,255,255,0.02)',
                      borderRadius: '2px', cursor: 'pointer', textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <p style={{ fontFamily: 'EB Garamond,serif', fontSize: '20px', color: m.slug === model.slug ? gold : textMain, margin: 0 }}>{m.diameter}m</p>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: textDim, margin: '4px 0 0' }}>{m.name}</p>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '10px', color: textDim, margin: '2px 0 0' }}>{m.desc}</p>
                  </button>
                ))}
              </div>
            </Section>

            {/* Step 2: Quantity */}
            <Section label="02" title="Quantity">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQty(n)}
                    style={{
                      width: '44px', height: '44px',
                      border: `1px solid ${n === qty ? goldBorder : 'rgba(255,255,255,0.1)'}`,
                      background: n === qty ? goldDim : 'transparent',
                      color: n === qty ? gold : textDim,
                      fontFamily: 'EB Garamond,serif', fontSize: '18px',
                      borderRadius: '2px', cursor: 'pointer',
                    }}
                  >
                    {n}
                  </button>
                ))}
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: textDim }}>yurts</span>
              </div>
            </Section>

            {/* Step 3: Interior */}
            <Section label="03" title="Interior finish">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {INTERIOR.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setInterior(opt)}
                    style={{
                      padding: '14px 18px',
                      border: `1px solid ${opt.id === interior.id ? goldBorder : 'rgba(255,255,255,0.07)'}`,
                      background: opt.id === interior.id ? goldDim : 'rgba(255,255,255,0.02)',
                      borderRadius: '2px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: opt.id === interior.id ? textMain : textDim }}>{opt.name}</span>
                    <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: opt.extra > 0 ? gold : textDim }}>
                      {opt.extra > 0 ? `+${fmt(opt.extra * qty)}` : 'Included'}
                    </span>
                  </button>
                ))}
              </div>
            </Section>

            {/* Step 4: Accessories */}
            <Section label="04" title="Add-ons & accessories">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {ACCESSORIES.map(acc => {
                  const on = accessories.includes(acc.id)
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => toggleAcc(acc.id)}
                      style={{
                        padding: '14px 16px',
                        border: `1px solid ${on ? goldBorder : 'rgba(255,255,255,0.07)'}`,
                        background: on ? goldDim : 'rgba(255,255,255,0.02)',
                        borderRadius: '2px', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: on ? textMain : textDim, margin: 0, fontWeight: on ? 500 : 400 }}>{acc.name}</p>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: textDim, margin: '2px 0 0' }}>{acc.desc}</p>
                      <p style={{ fontFamily: 'EB Garamond,serif', fontSize: '16px', color: on ? gold : 'rgba(255,255,255,0.35)', margin: '6px 0 0' }}>+{fmt(acc.price)}</p>
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* Step 5: Shipping */}
            <Section label="05" title="Delivery method">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SHIPPING.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShipping(s)}
                    style={{
                      padding: '14px 18px',
                      border: `1px solid ${s.id === shipping.id ? goldBorder : 'rgba(255,255,255,0.07)'}`,
                      background: s.id === shipping.id ? goldDim : 'rgba(255,255,255,0.02)',
                      borderRadius: '2px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: s.id === shipping.id ? textMain : textDim, margin: 0 }}>{s.name}</p>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: textDim, margin: '2px 0 0' }}>{s.days}</p>
                    </div>
                    <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: textDim }}>
                      {shippingFee > 0 && s.id === shipping.id ? `+${fmt(shippingFee)}` : `~${Math.round((s.multiplier - 1) * 100)}%`}
                    </span>
                  </button>
                ))}
              </div>
            </Section>
          </div>

          {/* RIGHT — sticky summary */}
          <div style={{ position: 'sticky', top: '104px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              {/* Price header */}
              <div style={{
                padding: '28px 28px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(201,168,110,0.04)',
              }}>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: textDim, margin: '0 0 8px' }}>
                  Estimated Total
                </p>
                <p style={{ fontFamily: 'EB Garamond,serif', fontSize: 'clamp(28px,3vw,36px)', color: gold, margin: 0, lineHeight: 1 }}>
                  {fmt(total)}
                </p>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: textDim, margin: '4px 0 0' }}>
                  up to {fmt(totalMax)} depending on customisation
                </p>
              </div>

              {/* Line items */}
              <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <LineItem label={`${model.name} × ${qty}`} value={fmt(subtotal)} />
                {interior.extra > 0 && <LineItem label={`${interior.name} interior`} value={`+${fmt(interiorExtra)}`} />}
                {accessories.length > 0 && <LineItem label={`${accessories.length} add-on${accessories.length > 1 ? 's' : ''}`} value={`+${fmt(accTotal)}`} />}
                {shippingFee > 0 && <LineItem label={`${shipping.name}`} value={`+${fmt(shippingFee)}`} />}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', fontWeight: 600, color: textMain, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Total</span>
                  <span style={{ fontFamily: 'EB Garamond,serif', fontSize: '20px', color: gold }}>{fmt(total)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ padding: '8px 28px 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={`https://wa.me/77477777888?text=${encodeURIComponent(waText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px',
                    background: 'rgba(201,168,110,0.12)',
                    border: '1px solid rgba(201,168,110,0.4)',
                    color: gold,
                    fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    textDecoration: 'none', borderRadius: '2px',
                  }}
                >
                  Get exact quote
                </a>
                <Link
                  href={`/yurt/${model.slug}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '13px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: textDim,
                    fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 500,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    textDecoration: 'none', borderRadius: '2px',
                  }}
                >
                  View {model.name} details
                </Link>
              </div>

              {/* Disclaimer */}
              <div style={{ padding: '0 28px 20px' }}>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                  * Estimates only. Final price confirmed after consultation. Excludes customs duties and local taxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .model-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </main>
  )
}

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontFamily: 'EB Garamond,serif', fontSize: '20px', color: 'rgba(201,168,110,0.45)' }}>{label}</span>
        <h2 style={{ fontFamily: 'EB Garamond,serif', fontSize: '22px', color: 'rgba(255,255,255,0.88)', fontWeight: 400, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function LineItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{value}</span>
    </div>
  )
}
