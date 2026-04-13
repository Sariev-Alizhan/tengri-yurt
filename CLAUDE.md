# Tengri Yurt

Traditional Kazakh yurt marketplace. Multi-supplier, 5 languages, inquiry-based ordering.

**Live**: https://tengri-yurt-eta.vercel.app (staging), https://tengri-camp.kz (prod)

## Quick Start

```bash
npm install
cp .env.example .env.local  # fill in Supabase + Resend keys
npm run dev                  # http://localhost:3000
```

## Stack

- **Next.js 14.2.18** (App Router, Server Components)
- **Supabase** (Auth, PostgreSQL, Storage for yurt photos)
- **next-intl 3.22** (EN, RU, KK, ZH, AR)
- **Tailwind CSS 3.4** with custom beige/gold palette
- **Resend** (transactional emails)
- **Leaflet** (delivery map in checkout)
- **pdf-lib** (order PDF generation)

## Key Directories

```
src/app/[locale]/          # All pages are locale-prefixed (/en/, /ru/, /kk/, /zh/, /ar/)
src/app/[locale]/order/    # Order form (yurt + accessory ordering)
src/app/[locale]/catalog/  # Yurt catalog
src/app/[locale]/supplier/ # Supplier portal (login, register, dashboard)
src/components/            # Shared React components
src/data/accessories.ts    # Traditional accessory definitions (multilingual)
src/lib/defaultCatalog.ts  # Fallback yurt data when Supabase unavailable
src/utils/supabase/        # Server/client Supabase clients
messages/                  # i18n translations (5 JSON files)
supabase/                  # DB schema, seeds, migrations
```

## Architecture Patterns

### i18n
- Middleware-based locale routing (`/en/`, `/ru/`, etc.)
- Translations in `messages/*.json` — keys like `order.pricingNote`
- Use `getTranslations('namespace')` server-side, `useTranslations('namespace')` client-side
- Arabic (AR) has RTL support in root layout

### Database
- Supabase with RLS policies (see `supabase/schema.sql`)
- Tables: profiles, suppliers, yurts, accessories, orders, rental_requests
- Fallback: `DEFAULT_YURTS` in `src/lib/defaultCatalog.ts` when DB unavailable

### Auth
- Email/password via Supabase Auth
- `admin@tengri-yurt.kz` auto-approved on registration
- Server-side session via cookies (7-day max age)
- Supplier dashboard protected at server level

### Styling
- Dark earth palette: bg `#1A1510`, accents `#C9A86E` (gold)
- Fonts: EB Garamond (display), Inter (body)
- Grain texture overlay on body
- Sharp corners (max 2px radius)
- Section alternation: dark -> photo -> beige -> dark

## Env Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only
RESEND_API_KEY=                   # optional (emails skipped if missing)
EMAIL_FROM=orders@tengri-camp.kz
NEXT_PUBLIC_BASE_URL=             # defaults to https://tengri-camp.kz
```

## Common Tasks

### Add a translation key
1. Add to ALL 5 files: `messages/{en,ru,kk,zh,ar}.json`
2. Use proper ICU format for interpolation: `"key": "From ${{price}}"`

### Add an API route
- Create `src/app/api/{name}/route.ts`
- Use `createClient()` from `@/utils/supabase/server` for auth
- Return `NextResponse.json()`

### Deploy
- Push to main branch -> auto-deploys to Vercel
- Env vars must be set in Vercel dashboard

## Gotchas

- `params` is a Promise in Next.js 14 app router — always `await params`
- Supabase clients silently return empty data if env vars missing (no crash)
- Middleware runs on ALL routes — check matcher config if adding new paths
- Accessory photos stored in `public/images/accessories/` (currently mostly empty — images in `/Users/diyar/Downloads/yurtzip/Yurt/`)
- The order form uses a `translations` prop pattern — pass all i18n keys from server component to client component
