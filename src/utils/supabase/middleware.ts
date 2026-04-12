import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 дней — сессия запоминается на устройстве

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    return { supabaseResponse, user: null }
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
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

  // getUser() верифицирует JWT на сервере (безопаснее чем getSession)
  const { data: { user } } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
