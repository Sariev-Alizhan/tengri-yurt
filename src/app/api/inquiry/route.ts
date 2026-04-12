import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'orders@tengri-camp.kz'
const NOTIFY_EMAIL = process.env.SUPPLIER_EMAIL ?? 'info@tengri-camp.kz'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { purpose, size, country, name, email, phone, message, locale } = body

    if (!name || (!email && !phone)) {
      return NextResponse.json({ error: 'Name and contact required' }, { status: 400 })
    }

    // Send notification email to team
    if (resend) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: NOTIFY_EMAIL,
        subject: `New Inquiry from ${name} — ${purpose} / ${size}`,
        text: [
          `New inquiry received from the website:`,
          ``,
          `Name: ${name}`,
          `Email: ${email || '—'}`,
          `Phone: ${phone || '—'}`,
          `Country: ${country || '—'}`,
          ``,
          `Purpose: ${purpose}`,
          `Size: ${size}`,
          `Message: ${message || '—'}`,
          `Locale: ${locale}`,
          ``,
          `---`,
          `Respond within 24 hours.`,
        ].join('\n'),
      })

      // Send confirmation to buyer if email provided
      if (email) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: 'Tengri Yurt — We received your inquiry',
          text: [
            `Dear ${name},`,
            ``,
            `Thank you for your interest in Tengri Yurt.`,
            ``,
            `Our team has received your inquiry and will get back to you within 24 hours with a personalized consultation.`,
            ``,
            `In the meantime, feel free to reach us on WhatsApp: +7 747 777 78 88`,
            ``,
            `Warm regards,`,
            `Tengri Yurt Team`,
          ].join('\n'),
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Inquiry error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
