import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 дней — «запомнить меня» на устройстве

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const opts = options ? { ...options } : {}
              if (typeof opts.maxAge === 'undefined' && name.includes('auth')) {
                opts.maxAge = COOKIE_MAX_AGE
              }
              cookieStore.set(name, value, opts)
            })
          } catch {
            // Server Component — можно игнорировать
          }
        },
      },
    }
  )
}
