'use client'

import { useEffect } from 'react'

/**
 * Forces dark (night) theme while inside the supplier dashboard.
 * Saves the user's current theme preference on mount and restores it on unmount.
 */
export function SupplierThemeEnforcer() {
  useEffect(() => {
    const prev = document.documentElement.getAttribute('data-theme') ?? 'day'
    document.documentElement.setAttribute('data-theme', 'night')
    return () => {
      document.documentElement.setAttribute('data-theme', prev)
    }
  }, [])

  return null
}
