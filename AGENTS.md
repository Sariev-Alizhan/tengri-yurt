# Agent Instructions

## Next.js Version

This project uses **Next.js 14.2.18** with App Router. Key differences from older versions:

- `params` in page/layout components is a **Promise** — always use `const { slug } = await params`
- Server Components are the default — add `"use client"` only when needed
- Route Handlers use `export async function GET/POST(request)` pattern
- Middleware in `src/middleware.ts` (not `middleware.ts` at root — it re-exports)

## i18n: next-intl

All user-facing text MUST use translations from `messages/*.json`. Never hardcode UI strings.

- Server: `const t = await getTranslations('namespace')`
- Client: `const t = useTranslations('namespace')`
- All 5 locales must have matching keys: EN, RU, KK, ZH, AR

## Supabase

- Server client: `import { createClient } from '@/utils/supabase/server'`
- Client client: `import { createClient } from '@/utils/supabase/client'`
- Always handle the case where Supabase returns null/error (env vars might be missing)
- Use `DEFAULT_YURTS` from `@/lib/defaultCatalog` as fallback

## Styling

- Use Tailwind classes. Custom colors: `beige`, `beige-dark`, `beige-light`, `beige-deep`
- Font classes: `font-garamond` (headers), `font-inter` (body)
- Gold accent color: `text-[#C9A86E]` or `border-[#C9A86E]`
- Keep sharp corners. No rounded-lg on cards.
