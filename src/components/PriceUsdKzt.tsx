'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useExchangeRateContext } from '@/components/ExchangeRateContext'
import { formatPrice } from '@/utils/formatPrice'

const SWITCH_DELAY_MS = 3500

type Props = {
  usd: number
  /** If set and locale is kk, show this KZT instead of converting (e.g. from DB) */
  kzt?: number | null
  /** Compact: only one line; default true */
  compact?: boolean
  className?: string
  /** Show "from" prefix (e.g. "from $3 200") */
  fromPrefix?: boolean
  /** If true, cycle USD → secondary currency every few seconds; default true */
  cycleCurrency?: boolean
}

export function PriceUsdKzt({
  usd,
  kzt: kztFixed,
  compact = true,
  className = '',
  fromPrefix = false,
  cycleCurrency = true,
}: Props) {
  const locale = useLocale()
  const ctx = useExchangeRateContext()
  const [showSecondary, setShowSecondary] = useState(false)

  const prefix = fromPrefix ? 'from ' : ''
  const usdFormatted = formatPrice(Number(usd) || 0)
  const currency = ctx?.getSecondaryCurrency(locale) ?? 'KZT'

  const secondaryAmount =
    currency === 'KZT' && kztFixed != null
      ? kztFixed
      : ctx?.usdToSecondary(Number(usd) || 0, locale) ?? null

  const secondaryStr =
    secondaryAmount != null ? ctx?.formatSecondary(secondaryAmount, currency) ?? null : null

  useEffect(() => {
    if (!cycleCurrency || secondaryStr == null) return
    const t = setInterval(() => setShowSecondary((prev) => !prev), SWITCH_DELAY_MS)
    const start = setTimeout(() => setShowSecondary(true), SWITCH_DELAY_MS)
    return () => {
      clearInterval(t)
      clearTimeout(start)
    }
  }, [cycleCurrency, secondaryStr])

  const showSecondaryNow = cycleCurrency && secondaryStr != null && showSecondary

  if (ctx?.error && secondaryAmount == null) {
    return (
      <span className={className}>
        {prefix}$ {usdFormatted}
      </span>
    )
  }

  if (cycleCurrency && showSecondaryNow && secondaryStr) {
    return (
      <span className={className} style={{ transition: 'opacity 0.3s ease' }}>
        {secondaryStr}
      </span>
    )
  }

  if (!cycleCurrency && secondaryStr != null) {
    if (compact) {
      return (
        <span className={className}>
          {prefix}$ {usdFormatted} <span className="opacity-80">({secondaryStr})</span>
        </span>
      )
    }
    return (
      <span className={className}>
        {prefix}$ {usdFormatted}
        <br />
        <span className="opacity-90 text-sm">{secondaryStr}</span>
      </span>
    )
  }

  return (
    <span className={className}>
      {prefix}$ {usdFormatted}
    </span>
  )
}
