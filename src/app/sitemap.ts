import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tengri-camp.kz'
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

  // Catalog
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  // Yurt detail pages
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

  // Static content pages
  const contentPages = [
    { path: '/calculator', priority: 0.8, freq: 'monthly' as const },
    { path: '/quiz',       priority: 0.7, freq: 'monthly' as const },
    { path: '/hammam',     priority: 0.8, freq: 'monthly' as const },
    { path: '/about',      priority: 0.6, freq: 'monthly' as const },
    { path: '/news',       priority: 0.7, freq: 'weekly'  as const },
  ]
  for (const locale of LOCALES) {
    for (const page of contentPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.freq,
        priority: page.priority,
      })
    }
  }

  return entries
}
