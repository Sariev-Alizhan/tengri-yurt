import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 дней — «запомнить меня» на устройстве

const emptyResult = { data: [], error: null }
const emptySingle = { data: null, error: null }

function mockChain(): {
  eq: () => ReturnType<typeof mockChain>
  limit: () => { order: () => Promise<typeof emptyResult>; single: () => Promise<typeof emptySingle> }
  order: () => Promise<typeof emptyResult>
  single: () => Promise<typeof emptySingle>
} {
  return {
    eq: () => mockChain(),
    limit: () => ({ order: () => Promise.resolve(emptyResult), single: () => Promise.resolve(emptySingle) }),
    order: () => Promise.resolve(emptyResult),
    single: () => Promise.resolve(emptySingle),
  }
}

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
      from: () => ({ select: () => mockChain() }),
    } as unknown as Awaited<ReturnType<typeof createServerClient>>
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
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
  })
}
