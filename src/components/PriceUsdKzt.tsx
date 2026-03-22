'use client'

import { formatPrice } from '@/utils/formatPrice'

type Props = {
  usd: number
  usdMax?: number | null
  className?: string
  fromPrefix?: boolean
}

export function PriceUsdKzt({
  usd,
  usdMax,
  className = '',
  fromPrefix = false,
}: Props) {
  const lo = formatPrice(Number(usd) || 0)

  if (usdMax && usdMax > usd) {
    const hi = formatPrice(Number(usdMax) || 0)
    return (
      <span className={className}>
        $ {lo} – {hi}
      </span>
    )
  }

  const prefix = fromPrefix ? 'from ' : ''
  return (
    <span className={className}>
      {prefix}$ {lo}
    </span>
  )
}
