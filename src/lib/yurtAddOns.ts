/**
 * Add-ons and recommendations when adding a yurt to cart.
 * Covers (white/silver 1M KZT), pillows 10–30, korpe (blankets) 10–30, bed.
 * Recommendations per yurt size: how many pillows and blankets are recommended.
 */

export type LogisticsOption = 'air' | 'sea'

export const LOGISTICS = {
  air: { daysMin: 3, daysMax: 10 },
  sea: { daysMin: 30, daysMax: 60 },
} as const

export const INSTALLATION_DESC =
  'A team of 1–3 people arrives for installation. Yurt installation takes 1–3 days.'

/** Recommendation for pillows and korpe (blankets) per yurt slug */
export const YURT_RECOMMENDATIONS: Record<
  string,
  { pillowsMin: number; pillowsMax: number; korpeMin: number; korpeMax: number }
> = {
  intimate: { pillowsMin: 10, pillowsMax: 18, korpeMin: 8, korpeMax: 12 },
  cozy: { pillowsMin: 14, pillowsMax: 22, korpeMin: 10, korpeMax: 16 },
  classic: { pillowsMin: 18, pillowsMax: 28, korpeMin: 12, korpeMax: 20 },
  spacious: { pillowsMin: 24, pillowsMax: 36, korpeMin: 16, korpeMax: 26 },
  grand: { pillowsMin: 36, pillowsMax: 50, korpeMin: 24, korpeMax: 36 },
  monumental: { pillowsMin: 50, pillowsMax: 80, korpeMin: 36, korpeMax: 50 },
}

/** ~450 KZT = 1 USD for display */
const KZT_TO_USD = 1 / 450

/** Cover options: white, silver — 1 000 000 KZT */
export const COVER_OPTIONS = [
  { id: 'default-white-cover', slug: 'white-cover', nameKey: 'coverWhite', price_kzt: 1_000_000, price_usd: Math.round(1_000_000 * KZT_TO_USD) },
  { id: 'default-silver-cover', slug: 'silver-cover', nameKey: 'coverSilver', price_kzt: 1_000_000, price_usd: Math.round(1_000_000 * KZT_TO_USD) },
] as const

/** Pillows: quantity 10–30, price per piece in KZT */
export const PILLOWS_ADDON = {
  id: 'addon-pillows',
  slug: 'pillows',
  nameKey: 'pillows',
  descriptionKey: 'pillowsDesc',
  historyKey: 'pillowsHistory',
  minQty: 10,
  maxQty: 30,
  price_kzt_per_unit: 15_000,
  price_usd_per_unit: Math.round(15_000 * KZT_TO_USD),
}

/** Körpe (blankets): quantity 10–30 */
export const KORPE_ADDON = {
  id: 'addon-korpe',
  slug: 'korpe',
  nameKey: 'korpe',
  descriptionKey: 'korpeDesc',
  historyKey: 'korpeHistory',
  minQty: 10,
  maxQty: 30,
  price_kzt_per_unit: 25_000,
  price_usd_per_unit: Math.round(25_000 * KZT_TO_USD),
}

/** Bed (one per order) */
export const BED_ADDON = {
  id: 'addon-bed',
  slug: 'bed',
  nameKey: 'bed',
  descriptionKey: 'bedDesc',
  historyKey: 'bedHistory',
  price_kzt: 180_000,
  price_usd: Math.round(180_000 * KZT_TO_USD),
}

export function getRecommendationForSlug(slug: string) {
  return YURT_RECOMMENDATIONS[slug] ?? YURT_RECOMMENDATIONS.intimate
}
