'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse?format=json'

declare global {
  interface Window {
    L?: typeof import('leaflet')
  }
}

export type DeliveryLocation = {
  lat: number
  lng: number
  displayAddress?: string
  city?: string
  country?: string
  postalCode?: string
}

type DeliveryMapProps = {
  onLocationSelect: (loc: DeliveryLocation) => void
  initialLat?: number
  initialLng?: number
  height?: string
  useMyLocationLabel: string
  mapHint: string
  loadingText: string
}

function reverseGeocode(lat: number, lng: number): Promise<DeliveryLocation> {
  return fetch(
    `${NOMINATIM_URL}&lat=${lat}&lon=${lng}`,
    { headers: { 'Accept-Language': 'en' } }
  )
    .then((r) => r.json())
    .then((data: {
      address?: {
        city?: string
        town?: string
        village?: string
        state?: string
        country?: string
        postcode?: string
        road?: string
        house_number?: string
      }
      display_name?: string
    }) => {
      const a = data?.address ?? {}
      const city = a.city ?? a.town ?? a.village ?? a.state ?? ''
      const country = a.country ?? ''
      const postalCode = a.postcode ?? ''
      const street = [a.house_number, a.road].filter(Boolean).join(' ')
      const displayAddress = ([street, city, postalCode, country].filter(Boolean).join(', ') || data?.display_name) ?? ''
      return {
        lat,
        lng,
        displayAddress: displayAddress || undefined,
        city: city || undefined,
        country: country || undefined,
        postalCode: postalCode || undefined,
      }
    })
    .catch(() => ({ lat, lng }))
}

export function DeliveryMap({
  onLocationSelect,
  initialLat = 43.238,
  initialLng = 76.945,
  height = '280px',
  useMyLocationLabel,
  mapHint,
  loadingText,
}: DeliveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const markerRef = useRef<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setMarker = useCallback(
    (lat: number, lng: number) => {
      if (!mapRef.current || typeof window === 'undefined') return
      const L = window.L
      if (!L) return
      if (markerRef.current && typeof (markerRef.current as { setLatLng?: (c: [number, number]) => void }).setLatLng === 'function') {
        (markerRef.current as { setLatLng: (c: [number, number]) => void }).setLatLng([lat, lng])
      } else {
        const icon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
        markerRef.current = L.marker([lat, lng], { icon }).addTo(mapRef.current as import('leaflet').Map)
      }
      ;(mapRef.current as { setView: (c: [number, number], z: number) => void }).setView([lat, lng], (mapRef.current as { getZoom: () => number }).getZoom())
    },
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return
    let cancelled = false
    import('leaflet').then((mod) => {
      if (cancelled || !containerRef.current) return
      const L = mod.default
      window.L = L
      if (mapRef.current) return
      const map = L.map(containerRef.current!).setView([initialLat, initialLng], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map)

    map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng
      setMarker(lat, lng)
      setLoading(true)
      setError(null)
      reverseGeocode(lat, lng)
        .then((loc) => {
          onLocationSelect(loc)
        })
        .catch(() => onLocationSelect({ lat, lng }))
        .finally(() => setLoading(false))
    })

    mapRef.current = map
    })
    return () => {
      cancelled = true
      if (mapRef.current && typeof (mapRef.current as { remove?: () => void }).remove === 'function') {
        (mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [initialLat, initialLng, onLocationSelect, setMarker])

  const handleUseMyLocation = () => {
    setError(null)
    setLoading(true)
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setMarker(lat, lng)
        reverseGeocode(lat, lng)
          .then((loc) => {
            onLocationSelect(loc)
          })
          .catch(() => onLocationSelect({ lat, lng }))
          .finally(() => setLoading(false))
      },
      () => {
        setError('Location access denied')
        setLoading(false)
      }
    )
  }

  return (
    <div className="delivery-map-wrap">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <p className="font-inter text-white/60 text-xs uppercase tracking-wider">{mapHint}</p>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={loading}
          className="font-inter text-xs uppercase tracking-wider text-amber-400 hover:text-amber-300 disabled:opacity-50 border border-amber-400/50 hover:border-amber-300/50 px-3 py-1.5 rounded transition-colors"
        >
          {loading ? loadingText : useMyLocationLabel}
        </button>
      </div>
      {error && (
        <p className="font-inter text-red-400/90 text-xs mb-2" role="alert">
          {error}
        </p>
      )}
      <div
        ref={containerRef}
        style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden', background: '#1a1714' }}
      />
    </div>
  )
}
