'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const REFRESH_MS = 10 * 60 * 1000 // 10 min — real-time refresh

export type SecondaryCurrency = 'KZT' | 'GBP' | 'RUB' | 'CNY'

const LOCALE_TO_CURRENCY: Record<string, SecondaryCurrency> = {
  kk: 'KZT',
  en: 'GBP',
  ru: 'RUB',
  zh: 'CNY',
}

const CURRENCY_SYMBOL: Record<SecondaryCurrency, string> = {
  KZT: '₸',
  GBP: '£',
  RUB: '₽',
  CNY: '¥',
}

type ExchangeRateContextValue = {
  rates: Record<SecondaryCurrency, number | null>
  updatedAt: Date | null
  error: string | null
  refetch: () => Promise<void>
  usdToKzt: (usd: number) => number | null
  /** Convert USD to the secondary currency for the given locale (kk→KZT, en→GBP, ru→RUB, zh→CNY) */
  usdToSecondary: (usd: number, locale: string) => number | null
  /** Get secondary currency code for locale */
  getSecondaryCurrency: (locale: string) => SecondaryCurrency
  /** Format secondary amount for display */
  formatSecondary: (amount: number, currency: SecondaryCurrency) => string
  formatUsdAndKzt: (usd: number) => string
}

const ExchangeRateContext = createContext<ExchangeRateContextValue | null>(null)

export function ExchangeRateProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = useState<Record<SecondaryCurrency, number | null>>({
    KZT: null,
    GBP: null,
    RUB: null,
    CNY: null,
  })
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/exchange-rate')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch rates')
      const r = data?.rates ?? {}
      setRates({
        KZT: typeof r.KZT === 'number' ? r.KZT : null,
        GBP: typeof r.GBP === 'number' ? r.GBP : null,
        RUB: typeof r.RUB === 'number' ? r.RUB : null,
        CNY: typeof r.CNY === 'number' ? r.CNY : null,
      })
      setUpdatedAt(data.updatedAt ? new Date(data.updatedAt) : null)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Exchange rate unavailable')
      setRates({ KZT: null, GBP: null, RUB: null, CNY: null })
    }
  }, [])

  useEffect(() => {
    refetch()
    const interval = setInterval(refetch, REFRESH_MS)
    return () => clearInterval(interval)
  }, [refetch])

  const usdToKzt = useCallback(
    (usd: number) => (rates.KZT != null ? Math.round(usd * rates.KZT) : null),
    [rates.KZT]
  )

  const getSecondaryCurrency = useCallback((locale: string): SecondaryCurrency => {
    return LOCALE_TO_CURRENCY[locale] ?? 'KZT'
  }, [])

  const usdToSecondary = useCallback(
    (usd: number, locale: string): number | null => {
      const currency = getSecondaryCurrency(locale)
      const rate = rates[currency]
      if (rate == null) return null
      if (currency === 'KZT') return Math.round(usd * rate)
      return Math.round(usd * rate * 100) / 100
    },
    [rates, getSecondaryCurrency]
  )

  const formatSecondary = useCallback((amount: number, currency: SecondaryCurrency): string => {
    const sym = CURRENCY_SYMBOL[currency]
    if (currency === 'KZT') return amount.toLocaleString('ru-RU') + ' ' + sym
    if (currency === 'RUB') return amount.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ' + sym
    if (currency === 'CNY') return sym + amount.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return sym + amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }, [])

  const formatUsdAndKzt = useCallback(
    (usd: number) => {
      const kzt = usdToKzt(usd)
      const usdStr = usd.toLocaleString('en-US', { maximumFractionDigits: 0 })
      if (kzt != null) {
        return `$${usdStr} (${kzt.toLocaleString('ru-RU')} ₸)`
      }
      return `$${usdStr}`
    },
    [usdToKzt]
  )

  const value: ExchangeRateContextValue = {
    rates,
    updatedAt,
    error,
    refetch,
    usdToKzt,
    usdToSecondary,
    getSecondaryCurrency,
    formatSecondary,
    formatUsdAndKzt,
  }

  return (
    <ExchangeRateContext.Provider value={value}>
      {children}
    </ExchangeRateContext.Provider>
  )
}

export function useExchangeRateContext() {
  const ctx = useContext(ExchangeRateContext)
  return ctx
}
