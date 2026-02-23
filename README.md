# Tengri Yurt

Traditional Kazakh yurt marketplace. Multiple suppliers, global delivery, inquiry-based ordering.

**Live**: [tengri-camp.kz](https://tengri-camp.kz)

## Stack

- Next.js 14 · TypeScript · Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage)
- Resend (transactional email)
- next-intl (EN / RU / KK / ZH)

## Quick Start

```bash
git clone https://github.com/your-username/tengri-yurt.git
cd tengri-yurt
npm install
cp .env.example .env.local
# fill in your keys in .env.local
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en)

## Setup

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in SQL Editor
3. Create storage bucket `yurt-photos` (set to public)
4. Get API key at [resend.com](https://resend.com)
5. Fill `.env.local` with your keys

## Project Structure

```
src/
├── app/[locale]/     # EN, RU, KK, ZH pages
│   ├── page.tsx      # Home page
│   ├── catalog/      # Yurt catalog
│   ├── yurt/[slug]/  # Yurt detail
│   ├── order/        # Order form + success
│   ├── account/      # Buyer account
│   └── supplier/     # Supplier dashboard
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Supabase, Resend, helpers
└── types/            # TypeScript types
messages/             # EN / RU / KK / ZH translations
supabase/schema.sql   # Database schema + RLS policies
```

## User Roles

| Role | Access |
|------|--------|
| Buyer | Browse catalog, submit inquiries, track orders |
| Supplier | Add yurts, view & update orders, set delivery times |
| Admin | Approve suppliers, full platform access |

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=orders@tengri-camp.kz
NEXT_PUBLIC_BASE_URL=https://tengri-camp.kz
```

---

[@tengri_camp](https://instagram.com/tengri_camp) · [tengri-camp.kz](https://tengri-camp.kz)
