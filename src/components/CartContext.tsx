'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem, CartYurtItem, CartAccessoryItem, LogisticsOption, YurtDealType } from '@/types/cart'

const STORAGE_KEY = 'tengri-cart'

type CartContextValue = {
  items: CartItem[]
  addYurt: (item: Omit<CartYurtItem, 'type'> & { logistics?: LogisticsOption; dealType?: YurtDealType }) => void
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

  const addYurt = useCallback((item: Omit<CartYurtItem, 'type'> & { logistics?: LogisticsOption; dealType?: YurtDealType }) => {
    setItems((prev) => {
      const dealType: YurtDealType = item.dealType ?? 'purchase'
      const isRent = dealType === 'rent'
      const hasAddons = (item.addons?.length ?? 0) > 0
      const realYurtId = item.yurtId ?? item.id

      let rowId: string
      let bundleYurtId: string | undefined

      if (hasAddons) {
        rowId = `bundle-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        bundleYurtId = item.id
      } else if (isRent) {
        rowId = `rent-${realYurtId}`
        bundleYurtId = realYurtId
      } else {
        rowId = item.id
        bundleYurtId = undefined
      }

      const newItem: CartYurtItem = {
        ...item,
        type: 'yurt',
        id: rowId,
        yurtId: bundleYurtId,
        dealType,
        quantity: item.quantity || 1,
        addons: item.addons ?? [],
      }

      if (!hasAddons) {
        const existing = prev.find((i) => {
          if (i.type !== 'yurt') return false
          if (isRent) return i.id === rowId && (i as CartYurtItem).dealType === 'rent'
          return i.id === item.id && ((i as CartYurtItem).dealType ?? 'purchase') === 'purchase'
        })
        if (existing) {
          return prev.map((i) => {
            if (i.type !== 'yurt') return i
            const sameRow = isRent ? i.id === rowId : i.id === item.id
            if (!sameRow) return i
            const yi = i as CartYurtItem
            if (isRent && yi.dealType !== 'rent') return i
            if (!isRent && (yi.dealType ?? 'purchase') !== 'purchase') return i
            return {
              ...yi,
              quantity: yi.quantity + (item.quantity || 1),
              logistics: item.logistics ?? yi.logistics,
              keregeColor: item.keregeColor ?? yi.keregeColor,
              customInterior: item.customInterior ?? yi.customInterior,
              note: item.note ?? yi.note,
            }
          })
        }
      }
      return [...prev, newItem]
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
      if (i.type === 'yurt') {
        const base = i.price_usd * i.quantity
        const addonsTotal = (i.addons ?? []).reduce((s, a) => s + a.price_usd * a.quantity, 0)
        return sum + base + addonsTotal
      }
      return sum + (i.price_usd ?? 0) * i.quantity
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
