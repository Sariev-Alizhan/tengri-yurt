'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/navigation'
import { useCart } from '@/components/CartContext'
import { isYurtItem } from '@/types/cart'
import type { DeliveryLocation } from '@/components/DeliveryMap'

function DeliveryMapLoading() {
  const t = useTranslations('checkout')
  return (
    <div className="h-[200px] md:h-[280px] bg-white/5 rounded-lg flex items-center justify-center font-inter text-white/50 text-sm">
      {t('loadingMap')}
    </div>
  )
}

const DeliveryMap = dynamic(
  () => import('@/components/DeliveryMap').then((m) => m.DeliveryMap),
  { ssr: false, loading: () => <DeliveryMapLoading /> }
)

export function CartCheckoutClient({
  locale,
  translations,
}: {
  locale: string
  translations: Record<string, string>
}) {
  const router = useRouter()
  const { items, totalUsd, clear } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [message, setMessage] = useState('')
  const [agreement, setAgreement] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const handleLocationSelect = useCallback((loc: DeliveryLocation) => {
    if (loc.country) setCountry(loc.country)
    if (loc.city) setCity(loc.city)
    if (loc.postalCode) setPostalCode(loc.postalCode)
    if (loc.displayAddress) setAddress(loc.displayAddress)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !email.trim() || !phone.trim() || !country.trim() || !city.trim()) {
      setError(translations.errorRequired)
      return
    }
    if (!agreement) {
      setError(translations.errorAgreement)
      return
    }
    if (items.length === 0) {
      setError('Cart is empty')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          buyerName: name.trim(),
          buyerEmail: email.trim(),
          buyerPhone: phone.trim(),
          deliveryCountry: country.trim(),
          deliveryCity: city.trim(),
          deliveryAddress: address.trim() || undefined,
          deliveryPostalCode: postalCode.trim() || undefined,
          deliveryNotes: deliveryNotes.trim() || undefined,
          message: message.trim() || undefined,
          shippingMethod: (items.find((i) => isYurtItem(i)) as { logistics?: 'air' | 'sea' } | undefined)?.logistics ?? 'air',
          locale,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || translations.errorSubmit)
      clear()
      const orderNumbers = data.orderNumbers as string[]
      const query = orderNumbers.length ? `?orders=${orderNumbers.join(',')}` : ''
      router.push(`/order/success${query}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : translations.errorSubmit)
      setLoading(false)
    }
  }

  if (items.length === 0 && !loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ paddingTop: 'clamp(120px, 20vw, 160px)', paddingBottom: 'clamp(60px, 10vw, 100px)' }}
      >
        <h1 className="font-garamond text-white text-3xl md:text-4xl mb-4">{translations.title}</h1>
        <p className="font-inter text-white/70 mb-8">{translations.emptyCart}</p>
        <Link
          href="/cart"
          className="inline-block border border-white/70 text-white py-3 px-8 uppercase font-inter text-sm font-medium tracking-widest hover:bg-white hover:text-[#7a6a54] transition-all min-h-[44px] flex items-center justify-center"
        >
          {translations.backToCart}
        </Link>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ paddingTop: 'clamp(100px, 16vw, 140px)', paddingBottom: 'clamp(48px, 8vw, 80px)' }}
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <h1 className="font-garamond text-white text-3xl md:text-4xl mb-8">{translations.title}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="font-inter text-red-300 text-sm" role="alert">
              {error}
            </p>
          )}

          <div>
            <label className="block font-inter text-white/70 text-sm uppercase tracking-wider mb-2">
              {translations.name} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent border-b border-white/30 py-3 px-0 font-inter text-white placeholder-white/40 focus:border-white/80 outline-none min-h-[44px]"
              placeholder={translations.name}
            />
          </div>
          <div>
            <label className="block font-inter text-white/70 text-sm uppercase tracking-wider mb-2">
              {translations.email} *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-white/30 py-3 px-0 font-inter text-white placeholder-white/40 focus:border-white/80 outline-none min-h-[44px]"
              placeholder={translations.email}
            />
          </div>
          <div>
            <label className="block font-inter text-white/70 text-sm uppercase tracking-wider mb-2">
              {translations.phone} *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-transparent border-b border-white/30 py-3 px-0 font-inter text-white placeholder-white/40 focus:border-white/80 outline-none min-h-[44px]"
              placeholder={translations.phone}
            />
          </div>
          <div>
            <label className="block font-inter text-white/70 text-sm uppercase tracking-wider mb-2">
              {translations.country} *
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full bg-transparent border-b border-white/30 py-3 px-0 font-inter text-white placeholder-white/40 focus:border-white/80 outline-none min-h-[44px]"
              placeholder={translations.country}
            />
          </div>
          <div>
            <label className="block font-inter text-white/70 text-sm uppercase tracking-wider mb-2">
              {translations.city} *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full bg-transparent border-b border-white/30 py-3 px-0 font-inter text-white placeholder-white/40 focus:border-white/80 outline-none min-h-[44px]"
              placeholder={translations.city}
            />
          </div>
          <div>
            <label className="block font-inter text-white/70 text-sm uppercase tracking-wider mb-2">
              {translations.address}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 py-3 px-0 font-inter text-white placeholder-white/40 focus:border-white/80 outline-none min-h-[44px]"
              placeholder={translations.address}
            />
          </div>
          <div>
            <label className="block font-inter text-white/70 text-sm uppercase tracking-wider mb-2">
              {translations.postalCode}
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 py-3 px-0 font-inter text-white placeholder-white/40 focus:border-white/80 outline-none min-h-[44px]"
              placeholder={translations.postalCode}
            />
          </div>
          <div>
            <label className="block font-inter text-white/70 text-sm uppercase tracking-wider mb-2">
              {translations.deliveryNotes}
            </label>
            <input
              type="text"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 py-3 px-0 font-inter text-white placeholder-white/40 focus:border-white/80 outline-none min-h-[44px]"
              placeholder={translations.deliveryNotes}
            />
          </div>

          {/* Карта: выбор места доставки */}
          <div className="border border-white/15 rounded-lg p-4 bg-white/5 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMap((s) => !s)}
              className="w-full flex items-center justify-between font-inter text-white/80 text-sm uppercase tracking-wider mb-2"
            >
              <span>{translations.deliveryMapTitle}</span>
              <span className="text-white/50">{showMap ? '−' : '+'}</span>
            </button>
            {showMap && (
              <DeliveryMap
                onLocationSelect={handleLocationSelect}
                useMyLocationLabel={translations.useMyLocation}
                mapHint={translations.mapHint}
                loadingText={translations.loadingMap}
              />
            )}
          </div>

          <div>
            <label className="block font-inter text-white/70 text-sm uppercase tracking-wider mb-2">
              {translations.message}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full bg-transparent border-b border-white/30 py-3 px-0 font-inter text-white placeholder-white/40 focus:border-white/80 outline-none resize-y min-h-[80px]"
              placeholder={translations.message}
            />
          </div>

          {/* Trust / security note */}
          <p className="font-inter text-white/50 text-xs text-center">
            🔒 Secure form · Your data is only used to process this order
          </p>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/30 bg-white/5 accent-amber-600 flex-shrink-0"
              />
              <span className="font-inter text-white/80 text-sm leading-relaxed">
                {translations.agreement}
              </span>
            </label>
          </div>

          <div className="pt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-4 items-center">
            <Link
              href="/cart"
              className="font-inter text-white/70 text-sm uppercase tracking-wider hover:text-white transition-colors min-h-[44px] flex items-center"
            >
              ← {translations.backToCart ?? 'Back to cart'}
            </Link>
            <button
              type="submit"
              disabled={loading || !agreement}
              className={`w-full sm:w-auto border py-3 px-8 uppercase font-inter text-sm font-medium tracking-widest transition-all min-h-[44px] flex items-center justify-center touch-manipulation ${
                agreement
                  ? 'border-white/70 text-white hover:bg-white hover:text-[#7a6a54] cursor-pointer'
                  : 'border-white/20 text-white/30 cursor-not-allowed'
              }`}
              style={{ opacity: loading ? 0.5 : undefined }}
            >
              {loading ? '...' : translations.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
