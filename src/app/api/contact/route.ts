import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, subject, country, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Try Resend if configured
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@tengri-camp.kz',
        to: 'info@tengri-camp.kz',
        subject: `[Contact] ${subject} — ${name} (${country || 'unknown country'})`,
        html: `
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Country:</strong> ${country || '—'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
        replyTo: email,
      })
    }

    // Also log to Supabase if available
    try {
      const { createClient } = await import('@/utils/supabase/server')
      const supabase = await createClient()
      await supabase.from('contact_messages').insert({
        name, email, subject, country, message,
        created_at: new Date().toISOString(),
      })
    } catch {
      // Table may not exist — silent fallback
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
