import { NextResponse } from 'next/server'

const CACHE_MAX_AGE = 60 * 15 // 15 minutes
const FALLBACK_RATES = {
  KZT: 500,
  GBP: 0.79,
  RUB: 95,
  CNY: 7.24,
}

let cached: { rates: Record<string, number>; updatedAt: number } | null = null

export async function GET() {
  const now = Date.now()
  if (cached && now - cached.updatedAt < CACHE_MAX_AGE * 1000) {
    return NextResponse.json({
      rates: cached.rates,
      updatedAt: new Date(cached.updatedAt).toISOString(),
    })
  }

  try {
    const res = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { next: { revalidate: CACHE_MAX_AGE } }
    )
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data = await res.json()
    const rates = data?.rates ?? {}
    const result = {
      KZT: typeof rates.KZT === 'number' ? rates.KZT : FALLBACK_RATES.KZT,
      GBP: typeof rates.GBP === 'number' ? rates.GBP : FALLBACK_RATES.GBP,
      RUB: typeof rates.RUB === 'number' ? rates.RUB : FALLBACK_RATES.RUB,
      CNY: typeof rates.CNY === 'number' ? rates.CNY : FALLBACK_RATES.CNY,
    }
    cached = { rates: result, updatedAt: now }
    return NextResponse.json({
      rates: result,
      updatedAt: new Date(now).toISOString(),
    })
  } catch (err) {
    const rates = cached?.rates ?? FALLBACK_RATES
    return NextResponse.json({
      rates,
      updatedAt: cached ? new Date(cached.updatedAt).toISOString() : new Date(now).toISOString(),
      fromCache: !!cached,
    })
  }
}
