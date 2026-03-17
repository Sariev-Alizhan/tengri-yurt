'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/CartContext'
import { isYurtItem, isAccessoryItem } from '@/types/cart'
import { PriceUsdKzt } from '@/components/PriceUsdKzt'

function rowTotalUsd(item: import('@/types/cart').CartItem): number {
  if (item.type === 'yurt') {
    const base = item.price_usd * item.quantity
    const addonsSum = (item.addons ?? []).reduce((s, a) => s + a.price_usd * a.quantity, 0) * item.quantity
    return base + addonsSum
  }
  return (item.price_usd ?? 0) * item.quantity
}

export function CartPageClient({
  locale,
  translations,
}: {
  locale: string
  translations: Record<string, string>
}) {
  const { items, remove, updateQuantity, totalItems, totalUsd } = useCart()

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ paddingTop: 'clamp(120px, 20vw, 160px)', paddingBottom: 'clamp(60px, 10vw, 100px)' }}
      >
        <h1 className="font-garamond text-white text-2xl sm:text-3xl md:text-4xl mb-4 font-medium">{translations.title}</h1>
        <p className="font-inter text-white/75 text-sm sm:text-base mb-8">{translations.empty}</p>
        <Link
          href={`/${locale}/catalog`}
          className="inline-block border border-white/80 text-white py-3 px-6 sm:px-8 uppercase font-inter text-sm font-medium tracking-widest hover:bg-white hover:text-[#7a6a54] transition-all min-h-[48px] flex items-center justify-center rounded-lg"
        >
          {translations.continueShopping}
        </Link>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ paddingTop: 'clamp(100px, 16vw, 140px)', paddingBottom: 'clamp(48px, 8vw, 80px)' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-garamond text-white text-2xl sm:text-3xl md:text-4xl mb-6 md:mb-8 font-medium">{translations.title}</h1>

        <ul className="space-y-5 mb-10">
          {items.map((item) => {
            const total = rowTotalUsd(item)
            return (
              <li
                key={`${item.type}-${item.id}`}
                className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start gap-4 sm:gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex-shrink-0 rounded-lg bg-white/10 overflow-hidden">
                    {item.photo ? (
                      <Image src={item.photo} alt={item.name} fill className="object-cover" sizes="96px" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-white/40 text-xs">{translations.noImage}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-white font-medium text-base sm:text-lg">{item.name}</p>
                    <p className="font-inter text-white/55 text-xs uppercase tracking-wider mt-1">
                      {item.type === 'yurt' ? translations.yurt : translations.accessory}
                    </p>
                    {isYurtItem(item) && (item.addons?.length ?? 0) > 0 && (
                      <ul className="mt-2 space-y-1">
                        {item.addons!.map((a) => (
                          <li key={a.id} className="font-inter text-white/75 text-sm">
                            {a.name} × {a.quantity} — <PriceUsdKzt usd={a.price_usd * a.quantity} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-shrink-0">
                    <div className="flex items-center rounded border border-white/25 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.type, item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors touch-manipulation min-w-[44px] min-h-[44px]"
                        aria-label={translations.decreaseQty}
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-inter text-white text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.type, item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors touch-manipulation min-w-[44px] min-h-[44px]"
                        aria-label={translations.increaseQty}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-garamond text-white text-lg sm:text-xl text-right min-w-[100px] sm:min-w-[120px]">
                      <PriceUsdKzt usd={total} />
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(item.type, item.id)}
                      className="font-inter text-white/50 text-xs uppercase tracking-wider hover:text-red-300 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded"
                      aria-label={translations.remove}
                    >
                      {translations.remove}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-8">
          <Link
            href={`/${locale}/catalog`}
            className="font-inter text-white/75 text-sm uppercase tracking-wider hover:text-white transition-colors min-h-[48px] flex items-center"
          >
            ← {translations.continueShopping}
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <p className="font-inter text-white/65 uppercase text-sm tracking-wider">
              {translations.total}: <span className="font-garamond text-white text-xl sm:text-2xl ml-2 font-medium"><PriceUsdKzt usd={totalUsd} /></span>
            </p>
            <Link
              href={`/${locale}/cart/checkout`}
              className="inline-block border border-white/80 text-white py-3 px-6 sm:px-8 uppercase font-inter text-sm font-medium tracking-widest hover:bg-white hover:text-[#7a6a54] transition-all min-h-[48px] flex items-center justify-center touch-manipulation rounded-lg"
            >
              {translations.checkout}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
