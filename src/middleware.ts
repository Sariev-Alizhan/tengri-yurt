import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/routing'
import { updateSession } from '@/utils/supabase/middleware'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const path = request.nextUrl.pathname
  const locale = path.split('/')[1] || 'en'

  if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
    return supabaseResponse
  }

  // Login/register: не редиректим по user в Edge (Edge и Node могут по-разному видеть cookie → петля 307).
  // Редирект "уже залогинен → dashboard" делается на странице логина (client/server).
  if (path.includes('/supplier/login') || path.includes('/supplier/register')) {
    const intlRes = intlMiddleware(request)
    supabaseResponse.cookies.getAll().forEach((c) => intlRes.cookies.set(c.name, c.value))
    return intlRes
  }

  // Защита supplier — только в Server Components; middleware не редиректит на login.

  const intlRes = intlMiddleware(request)
  supabaseResponse.cookies.getAll().forEach((c) => intlRes.cookies.set(c.name, c.value))
  return intlRes
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
