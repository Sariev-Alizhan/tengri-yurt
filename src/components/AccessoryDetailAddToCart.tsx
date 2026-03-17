'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartContext'

type Props = {
  accessoryId: string
  name: string
  slug: string
  price_usd: number | null
  supplier_id: string
  photo?: string | null
  addToCartLabel: string
  quantityLabel: string
}

export function AccessoryDetailAddToCart({
  accessoryId,
  name,
  slug,
  price_usd,
  supplier_id,
  photo,
  addToCartLabel,
  quantityLabel,
}: Props) {
  const { addAccessory } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addAccessory({
      id: accessoryId,
      name,
      slug,
      price_usd,
      quantity,
      photo: photo ?? null,
      supplier_id,
    })
    setAdded(true)
    setQuantity(1)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <label className="flex items-center gap-2 font-inter text-white/80">
        <span className="text-white/60 uppercase text-xs tracking-wider">{quantityLabel}</span>
        <input
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(String(e.target.value), 10) || 1)))}
          className="w-16 rounded border border-white/30 bg-white/5 px-2 py-2 text-center font-inter text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </label>
      <button
        type="button"
        onClick={handleAdd}
        className="inline-block border border-white bg-white/10 py-3 px-8 font-inter text-sm font-medium uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-white hover:text-black"
      >
        {added ? '✓ ' : ''}{addToCartLabel}
      </button>
    </div>
  )
}
