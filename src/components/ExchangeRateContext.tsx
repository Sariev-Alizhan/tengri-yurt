'use client'

import React from 'react'

export function ExchangeRateProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useExchangeRateContext() {
  return null
}
