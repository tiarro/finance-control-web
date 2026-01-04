import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create an unmodified response first to check the session
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
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in and trying to access login/register pages, redirect to dashboard
  if (
    user &&
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/register')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Protect the dashboard route (/)
  // Also protect other routes if needed, but allow auth routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/register') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/login' && 
    request.nextUrl.pathname !== '/register'
  ) {
    // If it's a static asset, let it pass (handled by matcher in middleware.ts usually, but good to double check)
    // But if it is the root path '/', redirect to login.
    
    // For now, simple logic: if not user and not on public pages, redirect.
    // Assuming only login and register are public for now.
    
    // NOTE: This logic might need refinement depending on exactly which routes are protected.
    // For this user, app/(dashboard)/page.tsx is the main one.
    
    if (request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }
  }

  return response
}
