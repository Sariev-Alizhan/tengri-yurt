import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(request: Request) {
  try {
    const { yurtSlug, yurtName, name, phone, message } = await request.json()

    if (!yurtSlug || !name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: yurtSlug, name, phone' },
        { status: 400 },
      )
    }

    const supabase = getSupabase()

    const { error } = await supabase.from('rental_inquiries').insert({
      yurt_slug: yurtSlug,
      yurt_name: yurtName || yurtSlug,
      client_name: name,
      client_phone: phone,
      message: message || null,
    })

    if (error) {
      console.error('rental_inquiries insert error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('rent API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
