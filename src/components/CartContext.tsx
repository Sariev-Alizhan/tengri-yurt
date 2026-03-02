'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem, CartYurtItem, CartAccessoryItem, LogisticsOption } from '@/types/cart'

const STORAGE_KEY = 'tengri-cart'

type CartContextValue = {
  items: CartItem[]
  addYurt: (item: Omit<CartYurtItem, 'type'> & { logistics?: LogisticsOption }) => void
  addAccessory: (item: Omit<CartAccessoryItem, 'type'>) => void
  remove: (type: 'yurt' | 'accessory', id: string) => void
  updateQuantity: (type: 'yurt' | 'accessory', id: string, quantity: number) => void
  clear: () => void
  totalItems: number
  totalUsd: number
}

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(loadCart())
  }, [])

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addYurt = useCallback((item: Omit<CartYurtItem, 'type'> & { logistics?: LogisticsOption }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.type === 'yurt' && i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.type === 'yurt' && i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1), logistics: item.logistics ?? i.logistics }
            : i
        )
      }
      return [...prev, { ...item, type: 'yurt' as const, quantity: item.quantity || 1, logistics: item.logistics }]
    })
  }, [])

  const addAccessory = useCallback((item: Omit<CartAccessoryItem, 'type'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.type === 'accessory' && i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.type === 'accessory' && i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      }
      return [...prev, { ...item, type: 'accessory' as const, quantity: item.quantity || 1 }]
    })
  }, [])

  const remove = useCallback((type: 'yurt' | 'accessory', id: string) => {
    setItems((prev) => prev.filter((i) => !(i.type === type && i.id === id)))
  }, [])

  const updateQuantity = useCallback((type: 'yurt' | 'accessory', id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => !(i.type === type && i.id === id)))
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.type === type && i.id === id ? { ...i, quantity } : i
      )
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const totalUsd = useMemo(() => {
    return items.reduce((sum, i) => {
      const price = i.type === 'yurt' ? i.price_usd : (i.price_usd ?? 0)
      return sum + price * i.quantity
    }, 0)
  }, [items])

  const value = useMemo(
    () => ({
      items,
      addYurt,
      addAccessory,
      remove,
      updateQuantity,
      clear,
      totalItems,
      totalUsd,
    }),
    [items, addYurt, addAccessory, remove, updateQuantity, clear, totalItems, totalUsd]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
