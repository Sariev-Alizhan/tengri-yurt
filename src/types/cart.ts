export type LogisticsOption = 'air' | 'sea'

export type CartYurtItem = {
  type: 'yurt'
  id: string
  name: string
  slug: string
  price_usd: number
  quantity: number
  photo?: string | null
  supplier_id: string
  /** Chosen at add-to-cart: air 3–10 days, sea 30–60 days */
  logistics?: LogisticsOption
}

export type CartAccessoryItem = {
  type: 'accessory'
  id: string
  name: string
  slug: string
  price_usd: number | null
  price_kzt: number | null
  quantity: number
  photo?: string | null
  supplier_id: string
}

export type CartItem = CartYurtItem | CartAccessoryItem

export function isYurtItem(item: CartItem): item is CartYurtItem {
  return item.type === 'yurt'
}

export function isAccessoryItem(item: CartItem): item is CartAccessoryItem {
  return item.type === 'accessory'
}
