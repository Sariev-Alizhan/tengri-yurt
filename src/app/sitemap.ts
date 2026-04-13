import type { MetadataRoute } from 'next'

const BASE_URL = 'https://tengri-yurt-eta.vercel.app'
const LOCALES = ['en', 'ru', 'kk', 'zh', 'ar']
const YURT_SLUGS = ['intimate', 'cozy', 'classic', 'spacious']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage per locale
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    })
  }

  // Catalog per locale
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  // Yurt detail pages per locale
  for (const locale of LOCALES) {
    for (const slug of YURT_SLUGS) {
      entries.push({
        url: `${BASE_URL}/${locale}/yurt/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  return entries
}
