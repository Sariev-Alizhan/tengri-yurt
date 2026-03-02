'use client'

import { useState, useEffect, useCallback } from 'react'

const REFRESH_MS = 10 * 60 * 1000 // 10 min

export function useExchangeRate() {
  const [rate, setRate] = useState<number | null>(null)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchRate = useCallback(async () => {
    try {
      const res = await fetch('/api/exchange-rate')
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch rate')
      setRate(Number(data.rate))
      setUpdatedAt(data.updatedAt ? new Date(data.updatedAt) : null)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Exchange rate unavailable')
      setRate(null)
    }
  }, [])

  useEffect(() => {
    fetchRate()
    const interval = setInterval(fetchRate, REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchRate])

  return { rate, updatedAt, error, refetch: fetchRate }
}
