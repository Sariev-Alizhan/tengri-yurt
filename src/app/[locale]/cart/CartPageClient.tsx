'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/CartContext'
import { isYurtItem, isAccessoryItem } from '@/types/cart'
import { PriceUsdKzt } from '@/components/PriceUsdKzt'

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
        <h1 className="font-garamond text-white text-3xl md:text-4xl mb-4">{translations.title}</h1>
        <p className="font-inter text-white/70 mb-8">{translations.empty}</p>
        <Link
          href={`/${locale}/catalog`}
          className="inline-block border border-white/70 text-white py-3 px-8 uppercase font-inter text-sm font-medium tracking-widest hover:bg-white hover:text-[#7a6a54] transition-all min-h-[44px] flex items-center justify-center"
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
        <h1 className="font-garamond text-white text-3xl md:text-4xl mb-8">{translations.title}</h1>

        <ul className="space-y-4 mb-10">
          {items.map((item) => (
            <li
              key={`${item.type}-${item.id}`}
              className="flex flex-wrap items-center gap-4 p-4 border border-white/15 bg-white/5"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex-shrink-0 bg-white/10 overflow-hidden">
                {item.photo ? (
                  <Image src={item.photo} alt={item.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-white/40 text-xs">
                    —
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter text-white/90 font-medium truncate">{item.name}</p>
                <p className="font-inter text-white/50 text-sm uppercase tracking-wider mt-0.5">
                  {item.type === 'yurt' ? translations.yurt : translations.accessory}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-white/25">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.type, item.id, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors touch-manipulation min-w-[44px] min-h-[44px]"
                    aria-label="-"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-inter text-white/90 text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.type, item.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors touch-manipulation min-w-[44px] min-h-[44px]"
                    aria-label="+"
                  >
                    +
                  </button>
                </div>
                <p className="font-garamond text-white text-lg text-right min-w-[120px]">
                  <PriceUsdKzt usd={(isYurtItem(item) ? item.price_usd : (item.price_usd ?? 0)) * item.quantity} compact cycleCurrency={false} />
                </p>
                <button
                  type="button"
                  onClick={() => remove(item.type, item.id)}
                  className="font-inter text-white/50 text-xs uppercase tracking-wider hover:text-red-300 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={translations.remove}
                >
                  {translations.remove}
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-8">
          <Link
            href={`/${locale}/catalog`}
            className="font-inter text-white/70 text-sm uppercase tracking-wider hover:text-white transition-colors min-h-[44px] flex items-center"
          >
            ← {translations.continueShopping}
          </Link>
          <div className="flex items-center gap-8">
            <p className="font-inter text-white/60 uppercase text-sm tracking-wider">
              {translations.total}: <span className="font-garamond text-white text-2xl ml-2"><PriceUsdKzt usd={totalUsd} compact cycleCurrency={false} /></span>
            </p>
            <Link
              href={`/${locale}/cart/checkout`}
              className="inline-block border border-white/70 text-white py-3 px-8 uppercase font-inter text-sm font-medium tracking-widest hover:bg-white hover:text-[#7a6a54] transition-all min-h-[44px] flex items-center justify-center touch-manipulation"
            >
              {translations.checkout}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
