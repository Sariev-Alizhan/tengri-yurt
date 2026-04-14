import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Tengri Yurt'
  const sub = searchParams.get('sub') ?? 'Traditional Kazakh Yurts'
  const price = searchParams.get('price') ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: '#1a1510',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Background gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #2a1f14 0%, #1a1510 50%, #0f0d0a 100%)',
          display: 'flex',
        }} />

        {/* Gold top line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,110,0.8), transparent)',
          display: 'flex',
        }} />

        {/* Decorative pattern */}
        <div style={{
          position: 'absolute', right: '80px', top: '80px',
          width: '300px', height: '300px',
          borderRadius: '50%',
          border: '1px solid rgba(201,168,110,0.08)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', right: '120px', top: '120px',
          width: '220px', height: '220px',
          borderRadius: '50%',
          border: '1px solid rgba(201,168,110,0.06)',
          display: 'flex',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          padding: '64px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>
          {/* Eyebrow */}
          <div style={{
            fontSize: '14px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,110,0.7)',
            marginBottom: '16px',
            display: 'flex',
          }}>
            Tengri Yurt · Est. 2024
          </div>

          {/* Title */}
          <div style={{
            fontSize: title.length > 20 ? '64px' : '80px',
            fontWeight: 400,
            lineHeight: 1.0,
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '16px',
            display: 'flex',
            maxWidth: '700px',
          }}>
            {title}
          </div>

          {/* Sub */}
          <div style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 300,
            marginBottom: price ? '20px' : '0px',
            display: 'flex',
          }}>
            {sub}
          </div>

          {/* Price */}
          {price && (
            <div style={{
              fontSize: '28px',
              color: 'rgba(201,168,110,0.9)',
              fontWeight: 400,
              display: 'flex',
            }}>
              {price}
            </div>
          )}
        </div>

        {/* Bottom right: domain */}
        <div style={{
          position: 'absolute', bottom: '40px', right: '80px',
          fontSize: '16px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.15em',
          display: 'flex',
        }}>
          tengri-camp.kz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
