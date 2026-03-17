'use client'

import { formatPrice } from '@/utils/formatPrice'

type Props = {
  usd: number
  className?: string
  fromPrefix?: boolean
}

export function PriceUsdKzt({
  usd,
  className = '',
  fromPrefix = false,
}: Props) {
  const prefix = fromPrefix ? 'from ' : ''
  const usdFormatted = formatPrice(Number(usd) || 0)

  return (
    <span className={className}>
      {prefix}$ {usdFormatted}
    </span>
  )
}
