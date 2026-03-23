export type LogisticsOption = 'air' | 'sea'

export type FloorWallsOption = 'felt' | 'carpolan'

export type CartYurtAddon = {
  id: string
  name: string
  slug: string
  price_usd: number
  quantity: number
}

export type YurtDealType = 'purchase' | 'rent'

export type CartYurtItem = {
  type: 'yurt'
  id: string
  /** When this row is a bundle (yurt + addons), id is unique row id and yurtId is the yurt being ordered */
  yurtId?: string
  /** purchase = buy; rent = rental line (price_usd = rental starting price) */
  dealType?: YurtDealType
  name: string
  slug: string
  price_usd: number
  quantity: number
  photo?: string | null
  supplier_id: string
  /** Chosen at add-to-cart: air 3–10 days, sea 30–60 days */
  logistics?: LogisticsOption
  /** Floor & walls: felt (1 month) or carpolan (in stock) */
  floorWalls?: FloorWallsOption
  /** Exclusive custom interior (on order) */
  customInterior?: boolean
  /** Optional message for this yurt */
  note?: string
  /** Add-ons (cover, pillows, korpe, bed, traditional) — one cart row = yurt + these */
  addons?: CartYurtAddon[]
}

export type CartAccessoryItem = {
  type: 'accessory'
  id: string
  name: string
  slug: string
  price_usd: number | null
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
