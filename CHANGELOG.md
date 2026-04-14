# Tengri Yurt — Changelog

## v2.8 — 2026-04-14 · Configure & Order Full Card Redesign

### Configure & Order — Modern Card UI
- **OFCard system** — all form sections (Interior, Accessories, Logistics, Details, Total, Agreement) are now wrapped in cards with `border-radius: 16px`, shadow, and day/night CSS var backgrounds
- **SectionHeader component** — step number + Garamond title + optional subtitle, consistent across all sections
- **Modern inputs** — `FormField` inputs now have full border + `border-radius: 8px` + surface background (was bottom-border-only)
- **Rounded toggles** — ToggleRow and ShippingCard components updated to `border-radius: 10–12px`, bolder active border
- **Gold submit button** — fills gold `#c9a86e` with dark text when agreement is checked, greyed-out when unchecked
- **Rounded agreement checkbox** — `border-radius: 5px`
- **Quantity +/− buttons** — styled with `border-radius: 8px`, surface background

---

## v2.7 — 2026-04-14 · Theme Awareness + Contact Links

### Theme-aware Order Form & Supplier Portal
- **CSS vars split** — `--sp-*` supplier portal vars now have light (`:root`) and dark (`html[data-theme="night"]`) values; portal automatically switches between warm-beige and dark-earth palettes based on theme toggle
- **`--of-*` order form vars** — new `--of-bg`, `--of-surface`, `--of-text-1/2/3/4`, `--of-border`, `--of-border-soft` vars with day/night variants
- **Order page background** uses `var(--of-bg)` — beige in day mode, near-black in night mode
- **OrderForm surfaces** — section labels, accessory cards, shipping cards, toggle rows, quantity input, textarea, estimated total, agreement, submit button all use `var(--of-*)` CSS vars
- **Sub-components** (FormSection, FieldLabel, ToggleRow, ShippingCard, FormField) fully updated to CSS vars

### Order Confirmed page (/order/success)
- **WhatsApp button** — green-tinted link to `wa.me/77477777888` with WhatsApp logo icon
- **Email button** — gold-tinted `mailto:info@tengri-camp.kz` link
- Both shown in a "Questions? Get in touch" card above the back-to-catalog button
- Success page background hardcoded `#1a1510` (dark always, since text is white)

---

## v2.6 — 2026-04-14 · Order Form Redesign

### Configure & Order
- **Full visual redesign** — dark `#0f0d0a` background, gold section dividers, EB Garamond headers, Inter body text
- **Silver swatch fixed** — was `#9c8a72` (beige), now `#c8d0da` (true pearl silver)
- **Accessories** — larger cards with image, name in Garamond, short description always visible, "About this piece" expandable history drawer, price in gold
- **Inline success state** — no redirect; after submit shows order number, summary card, action buttons
- **PDF receipt** — "Download PDF Receipt" button generates a styled print dialog with full order details, customer info, and itemized pricing
- **WhatsApp deep link** — opens WhatsApp with pre-filled message including order number, both in success state and as submit alternative
- **Gmail link** — mailto with pre-filled subject + body, both in success state and as submit alternative
- **Contact alternatives on form** — "or WhatsApp / Email" row next to Submit button so user can reach out without filling the full form
- Gold checkboxes, focus states with gold border on inputs
- `yurtName` prop added to OrderForm for PDF and WhatsApp message personalization

---

## v2.5 — 2026-04-14 · PWA, Live News & Cross-Browser Fixes

### PWA (Progressive Web App)
- **Service Worker** (`public/sw.js`) — offline caching, stale-while-revalidate for chunks, cache-first for images, network-first for pages
- **Update toast** (`ServiceWorker.tsx`) — "New version available / Refresh" banner appears in all browsers (Chrome, Safari, Firefox, Yandex, Opera, Samsung Internet) when a new SW is installed; 5 languages; auto-reloads after user confirms
- **Manifest v2** — added `shortcuts` (Catalog, Contact), `screenshots`, `display_override`, `maskable` icons, dark/light `theme_color` for browser chrome tinting
- `apple-mobile-web-app-status-bar-style` changed to `black-translucent` for iOS full-bleed header
- `themeColor` added to `viewport` export — browser UI matches site dark theme

### News
- **`/api/news` route** — fetches and parses tengri-camp.kz live, merges with static items; cache 1 hour; scraped items get a "Live" badge and link to source
- **News page** rewritten to use the API (server-side fetch with 1h revalidate); static fallback if scrape fails
- Added **Instagram CTA** card linking to @tengri_camp
- Fixed: news page CTA was `<a href>` with hardcoded locale — replaced with locale-aware `<Link>`

### Cross-browser fixes
- Added `WebkitBackdropFilter` alongside every `backdropFilter` in: `TestimonialsSection`, `GallerySection` (×2), `HistoryModal`, `SupplierSidebar`
- `msapplication-TileColor` + `msapplication-TileImage` meta for Windows tiles

### Other
- Fixed `background: var(--bg-main)` on dark-designed pages (about, contact, hammam, news) — now hardcoded `#1a1510` so they stay dark regardless of day/night theme toggle
- Fixed gallery gradient overlay in `/about` (`#1a1510` not `var(--bg-main)`)
- **Featured yurts section** added to home page — pulls 3 latest yurts from Supabase (data was already fetched but unused)

---

## v2.4 — 2026-04-14 · Full i18n for New Pages

### Internationalization
- Added `aboutPage`, `contactPage`, `hammamPage` translation namespaces to all 5 language files (EN, RU, KK, ZH, AR)
- Wired `/about`, `/contact`, `/hammam` pages to use `getTranslations()` instead of hardcoded English strings
- `ContactForm` now accepts `labels` and `subjects` props from the server component — all form UI is fully translatable
- All arrays (timeline, materials, specs, features, gallery captions, ritual steps, FAQ items, subjects) are now sourced from translations

---

## v2.3 — 2026-04-14 · Honest Design Audit Fixes

### Client-perspective issues resolved
- **BookNowCTA** — removed hardcoded `#a89578` sand background that broke the dark-theme flow; replaced with photo background + dark overlay (same treatment as footer)
- **MarqueeSection** — replaced generic luxury-brand copy ("Traditional Craftsmanship · Master Artisans") with Tengri-specific facts ("42 Countries · UNESCO Heritage 2018 · 200+ Yurts Delivered · 14-Year Warranty · 40+ Master Ustalar")
- **HammamSection** — changed eyebrow from "Innovation — Yurt Hammam" → "World First · Nomadic Wellness"; added "Full Hammam page →" link alongside WhatsApp CTA so visitors can learn before inquiring
- **FooterSection** — replaced minimal contact/follow layout with 4-column navigation grid: Explore (Catalog, Hammam, Quiz, News) / Company (About, Contact, Portal) / Contact / Follow; removed redundant standalone quiz link

---

## v2.2 — 2026-04-14 · Content & Discovery Layer

### New pages
- `/about` — Brand story, founding timeline (2010–2024), yurt anatomy, master artisans + UNESCO section
- `/contact` — Full contact form (name / email / subject / country / message), WhatsApp card, FAQ, Supabase + Resend integration

### Navigation
- Added **About**, **Hammam**, **Contact** links to desktop navbar left group
- Added all three to mobile menu

### Footer
- Added **v2.x** version badge (bottom-right, gold/subtle)

### API
- `POST /api/contact` — saves to `contact_messages` table, sends email via Resend if key present

---

## v2.1 — 2026-04-14 · Core Pages

### New pages
- `/yurt/[slug]` — Full yurt detail page: 80vh carousel, specs strip, two-column layout, sticky order card with price + CTAs + trust signals
- `/hammam` — World's first nomadic spa page: hero, 8-spec strip, 4-feature grid, masonry gallery, ritual walkthrough, WhatsApp CTA
- `/not-found` — Redesigned 404: giant translucent number, gold buttons, yurt glyph
- `/order/success` — Redesigned success page: gold checkmark, dark theme, order number chip

### Improvements
- Quiz page fully restyled: progress bar, score ring, green/red/gold answer states, result tier labels

---

## v2.0 — 2026-04 · Major Platform Redesign

### Design system
- Dark earth palette: `#1a1510` night / `#a89578` day — switchable via ThemeToggle
- `--sp-*` CSS token set for supplier portal (warm Linear adaptation)
- Transparent navbar always-on — white logo everywhere

### New features
- **AI Yurt Chat** (Claude Haiku) — answers questions in 5 languages, streaming, WhatsApp fallback
- **Day/Night theme toggle** — persisted to localStorage
- **Press & Stories page** (`/news`) — global projects, stats, tag-coloured cards
- **Supplier portal redesign** — all sub-pages (yurts, accessories, orders, rentals, settings) with `--sp-*` tokens

### Fixes
- Footer Tailwind class breakage
- Gallery hardcoded colours
- Testimonials hover
- Open Graph metadata

---

## v1.0 — 2024 · Initial launch

- Next.js 14 App Router, Supabase, next-intl (EN/RU/KK/ZH/AR)
- Catalog, Order form, Supplier portal, Accessory checkout
