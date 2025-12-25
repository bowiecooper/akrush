import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if email is @umich.edu
      if (!data.user.email?.endsWith('@umich.edu')) {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/auth/error`)
      }
      
      // Redirect to dashboard or home page
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Redirect to login page on error
  return NextResponse.redirect(`${origin}/auth/login?error=authentication_failed`)
}