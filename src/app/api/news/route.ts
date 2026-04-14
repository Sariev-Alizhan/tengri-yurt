import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export interface NewsItem {
  date: string;
  category: string;
  title: string;
  body: string;
  image: string;
  tag: string;
  url?: string;
  source: 'scraped' | 'static';
}

// ── Helpers ────────────────────────────────────────────────────────────────

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractAttr(html: string, attr: string): string {
  const m = html.match(new RegExp(`${attr}=["']([^"']+)["']`));
  return m ? m[1] : '';
}

function absoluteUrl(url: string, base: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return new URL(url, base).href;
  return new URL(url, base).href;
}

// ── Scrape tengri-camp.kz ──────────────────────────────────────────────────

async function scrapeTengriCamp(): Promise<NewsItem[]> {
  const BASE = 'https://tengri-camp.kz';
  const items: NewsItem[] = [];

  try {
    const res = await fetch(BASE, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TengriYurtBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return items;
    const html = await res.text();

    // Try to extract article/post blocks with various selectors
    // Common patterns: <article>, cards with h2/h3 links, .post, .news-item
    const articlePatterns = [
      /<article[^>]*>([\s\S]*?)<\/article>/gi,
      /<div[^>]*class="[^"]*(?:post|news|card|article|project|entry)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    ];

    let matched = false;

    for (const pattern of articlePatterns) {
      const blocks: string[] = [];
      let m: RegExpExecArray | null;

      // Reset lastIndex
      pattern.lastIndex = 0;
      while ((m = pattern.exec(html)) !== null && blocks.length < 12) {
        if (m[1] && m[1].length > 100) blocks.push(m[0]);
      }

      if (blocks.length === 0) continue;
      matched = true;

      for (const block of blocks.slice(0, 8)) {
        // Title: first h1/h2/h3 link
        const titleMatch = block.match(/<h[1-3][^>]*>[\s\S]*?<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h[1-3]>/i)
          || block.match(/<a[^>]*href=["']([^"']+)["'][^>]*><h[1-3][^>]*>([\s\S]*?)<\/h[1-3]><\/a>/i)
          || block.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);

        const title = titleMatch
          ? stripTags(titleMatch[titleMatch.length - 1]).slice(0, 120)
          : '';
        if (!title || title.length < 5) continue;

        const href = titleMatch?.[1] ? absoluteUrl(titleMatch[1], BASE) : BASE;

        // Body: first <p> with real text
        const bodyMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        const body = bodyMatch
          ? stripTags(bodyMatch[1]).slice(0, 280)
          : '';

        // Image
        const imgMatch = block.match(/<img[^>]+>/i);
        let image = '';
        if (imgMatch) {
          image = extractAttr(imgMatch[0], 'src')
            || extractAttr(imgMatch[0], 'data-src')
            || extractAttr(imgMatch[0], 'data-lazy-src');
          if (image) image = absoluteUrl(image, BASE);
        }

        // Date
        const dateMatch = block.match(/<time[^>]*datetime=["']([^"']+)["']/i)
          || block.match(/(\d{4}-\d{2}-\d{2})/);
        const rawDate = dateMatch?.[1] ?? '';
        const date = rawDate ? rawDate.slice(0, 7) : new Date().toISOString().slice(0, 7);

        if (title && title.length > 5) {
          items.push({
            date,
            category: 'tengri-camp.kz',
            title,
            body: body || 'Read full article on tengri-camp.kz',
            image: image || '/images/picture/yurt_shanyraq.jpeg',
            tag: 'Update',
            url: href,
            source: 'scraped',
          });
        }
      }

      if (matched && items.length > 0) break;
    }

    // If no structured articles, try to find any headings with links as a last resort
    if (items.length === 0) {
      const linkPattern = /<a[^>]*href=["']([^"'#][^"']*)["'][^>]*><h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;
      let m: RegExpExecArray | null;
      while ((m = linkPattern.exec(html)) !== null && items.length < 6) {
        const title = stripTags(m[2]).trim();
        if (title.length < 8) continue;
        const href = absoluteUrl(m[1], BASE);
        items.push({
          date: new Date().toISOString().slice(0, 7),
          category: 'tengri-camp.kz',
          title,
          body: 'View on tengri-camp.kz',
          image: '/images/picture/yurt_shanyraq.jpeg',
          tag: 'Update',
          url: href,
          source: 'scraped',
        });
      }
    }
  } catch {
    // Network error — return empty, caller uses static fallback
  }

  return items;
}

// ── Static fallback news ───────────────────────────────────────────────────

const STATIC_NEWS: NewsItem[] = [
  {
    date: '2024-11',
    category: 'Global',
    title: 'Tengri Yurt delivers first yurt to New Zealand',
    body: 'A 12-kanat traditional yurt now sits on the South Island — the first Kazakh yurt ever installed in New Zealand. The project marks our 42nd country.',
    image: '/images/picture/yurt_lovebern.jpeg',
    tag: 'Milestone',
    source: 'static',
  },
  {
    date: '2024-08',
    category: 'Events',
    title: 'Burning Man 2024 — Tengri Camp at Black Rock',
    body: 'Three Tengri yurts formed the centerpiece of the Tengri Camp installation at Burning Man, welcoming thousands of visitors to experience nomadic culture in the Nevada desert.',
    image: '/images/picture/yurt_blackrock.jpeg',
    tag: 'Event',
    source: 'static',
  },
  {
    date: '2024-05',
    category: 'Product',
    title: "Introducing the Yurt Hammam — world's first nomadic spa",
    body: "We launched the world's first steam bath inside a traditional Kazakh yurt. Hot and cold plunge pools under the open sky. Three thousand years of wellness wisdom.",
    image: '/images/hammam/hot-tub-night.png',
    tag: 'Launch',
    source: 'static',
  },
  {
    date: '2023-11',
    category: 'Heritage',
    title: 'Preserving the art of Kazakh yurt-making',
    body: 'Our master artisans — ustalar — carry centuries of craft. Tengri Yurt is the first company to export this UNESCO-recognized intangible heritage as a commercial product to every continent.',
    image: '/images/picture/yurt_shanyraq.jpeg',
    tag: 'Story',
    source: 'static',
  },
  {
    date: '2023-07',
    category: 'Destinations',
    title: 'From the steppe to Dubai: a 16-kanat yurt in the desert',
    body: 'A luxury resort in the UAE commissioned our largest yurt for a unique desert glamping experience. Assembly took two days; the result — breathtaking.',
    image: '/images/picture/yurt_dubai.jpeg',
    tag: 'Project',
    source: 'static',
  },
  {
    date: '2022-09',
    category: 'Culture',
    title: 'Miami Art Week — Kazakh nomadic art arrives in the Americas',
    body: 'Tengri Yurt partnered with the Miami Art Fair to bring an 8-kanat yurt as a cultural pavilion. Over 3,000 visitors experienced Kazakh interior craft firsthand.',
    image: '/images/picture/yurt_maiyami.jpeg',
    tag: 'Culture',
    source: 'static',
  },
];

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET() {
  try {
    const scraped = await scrapeTengriCamp();

    // Merge: scraped items first (most recent from the live site), then static
    const seen = new Set<string>();
    const merged: NewsItem[] = [];

    for (const item of [...scraped, ...STATIC_NEWS]) {
      const key = item.title.toLowerCase().slice(0, 40);
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }

    return NextResponse.json({
      items: merged.slice(0, 12),
      scraped: scraped.length,
      updatedAt: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch {
    return NextResponse.json({
      items: STATIC_NEWS,
      scraped: 0,
      updatedAt: new Date().toISOString(),
    });
  }
}
