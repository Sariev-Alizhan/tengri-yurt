# Deploy on Vercel

This project is ready to deploy on [Vercel](https://vercel.com). Follow these steps.

## 1. Push to Git

- Commit and push your code to GitHub/GitLab/Bitbucket (e.g. `main` or `master` branch).

## 2. Import in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. **Add New** → **Project**.
3. Import your repository.
4. **Framework Preset**: Next.js (auto-detected).
5. **Root Directory**: leave default (`.`).
6. **Build Command**: `npm run build` (default).
7. **Output Directory**: leave default.
8. **Install Command**: `npm install` (default).

## 3. Environment Variables

In **Project → Settings → Environment Variables**, add:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only) |
| `RESEND_API_KEY` | No | For order/supplier emails (optional) |
| `EMAIL_FROM` | No | Sender email (e.g. `orders@yourdomain.com`) |
| `NEXT_PUBLIC_BASE_URL` | No | Site URL (e.g. `https://your-app.vercel.app`) |

- **Required**: Without Supabase vars, the app will build and run, but auth and catalog/orders will not work.
- Set the same variables for **Production**, **Preview**, and **Development** as needed.
- Do **not** commit `.env` or `.env.local` to Git.

## 4. Deploy

- Click **Deploy**. Vercel will run `npm run build` and deploy.
- After the first deploy, your site will be at `https://your-project.vercel.app`.

## 5. Optional: Custom Domain

- In **Project → Settings → Domains**, add your domain and follow DNS instructions.

## Build and runtime

- **Build**: Runs without Supabase env vars (no top-level client init). Static pages and middleware work.
- **Runtime**: API routes and pages that use Supabase need the env vars set in Vercel; otherwise they get empty/mock data or errors when calling Supabase.

## Troubleshooting

- **Build fails**: Ensure `npm run build` passes locally. Check Node version (Vercel uses 18.x by default; see **Settings → General → Node.js Version** if needed).
- **API / DB errors**: Verify all three Supabase variables are set and redeploy.
- **Redirects**: If you use a custom domain, set `NEXT_PUBLIC_BASE_URL` to that domain so emails and links use the correct URL.
