import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Вход через Route Handler (API), а не Server Action.
 * В Next.js cookie, установленные в Server Action, не всегда попадают в ответ браузеру.
 * В Route Handler мы явно пишем Set-Cookie в Response — сессия сохраняется и авторизация проходит.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password.trim() : ''

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const response = NextResponse.json({ success: true })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // path: '/' обязательно — иначе cookie не уходит на /ru/supplier/dashboard и сервер не видит сессию
            const opts = { ...(options ?? {}), path: '/', sameSite: 'lax' as const }
            response.cookies.set(name, value, opts)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const message =
      error.message === 'Invalid login credentials'
        ? 'Invalid email or password. Check for typos, confirm your email if required, or reset your password.'
        : error.message
    return NextResponse.json({ error: message }, { status: 401 })
  }

  return response
}
