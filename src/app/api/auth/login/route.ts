import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Вход через Route Handler (API), а не Server Action.
 * В Next.js cookie, установленные в Server Action, не всегда попадают в ответ браузеру.
 * В Route Handler мы явно пишем Set-Cookie в Response — сессия сохраняется и авторизация проходит.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''

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
        setAll(cookiesToSet) {
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
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return response
}
