import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 дней — сессия запоминается на устройстве

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value, options)
          })
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            const opts = options ? { ...options } : {}
            if (typeof opts.maxAge === 'undefined' && name.includes('auth')) {
              opts.maxAge = COOKIE_MAX_AGE
            }
            supabaseResponse.cookies.set(name, value, opts)
          })
        },
      },
    }
  )

  // getSession() обновляет сессию при истечении access token и записывает новые cookie
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  return { supabaseResponse, user }
}
