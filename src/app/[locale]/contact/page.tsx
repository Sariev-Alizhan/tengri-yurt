import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import { FooterSection } from '@/components/FooterSection'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Tengri Yurt — Get in Touch',
  description:
    'Ask about pricing, delivery, custom orders, or partnerships. Our team typically replies within 24 hours.',
}

const OFFICE = {
  email: 'info@tengri-camp.kz',
  phone: '+7 747 777 78 88',
  address: 'Almaty, Kazakhstan',
  flag: '🇰🇿',
}

export default async function ContactPage() {
  const locale = await getLocale()
  const tFooter = await getTranslations('footer')
  const t = await getTranslations('contactPage')

  const faqRaw = t.raw('faq') as { q: string; a: string }[]
  const subjectsRaw = t.raw('subjects') as string[]

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#1a1510' }}>

        {/* Header */}
        <div style={{
          padding: 'clamp(100px, 16vw, 160px) clamp(24px, 6vw, 80px) clamp(48px, 8vw, 80px)',
          maxWidth: '800px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(201,168,110,0.7)', marginBottom: '20px',
          }}>
            {t('eyebrow')}
          </p>
          <h1 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 'clamp(36px, 7vw, 68px)',
            color: 'rgba(255,255,255,0.93)',
            fontWeight: 400, lineHeight: 1.1, margin: '0 0 24px',
          }}>
            {t('title')}
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'rgba(255,255,255,0.5)', lineHeight: 1.75,
            fontWeight: 300, maxWidth: '520px',
          }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Main grid */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 clamp(24px, 6vw, 48px) clamp(80px, 12vw, 140px)',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '64px', alignItems: 'start',
        }}
          className="contact-grid"
        >

          {/* Left: form */}
          <ContactForm
            labels={{
              name: t('formNameLabel'),
              email: t('formEmailLabel'),
              subject: t('formSubjectLabel'),
              country: t('formCountryLabel'),
              message: t('formMessageLabel'),
              send: t('formSend'),
              sending: t('formSending'),
              error: t('formError'),
              successTitle: t('formSuccessTitle'),
              successText: t('formSuccessText'),
              namePlaceholder: t('namePlaceholder'),
              emailPlaceholder: t('emailPlaceholder'),
              countryPlaceholder: t('countryPlaceholder'),
              messagePlaceholder: t('messagePlaceholder'),
            }}
            subjects={subjectsRaw}
          />

          {/* Right: sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* WhatsApp card */}
            <div style={{
              background: 'rgba(37,211,102,0.06)',
              border: '1px solid rgba(37,211,102,0.2)',
              borderRadius: '8px',
              padding: '24px',
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(37,211,102,0.6)', marginBottom: '10px',
              }}>
                {t('whatsappLabel')}
              </p>
              <p style={{
                fontFamily: 'EB Garamond, serif', fontSize: '20px',
                color: 'rgba(255,255,255,0.9)', margin: '0 0 16px',
              }}>
                {t('whatsappTitle')}
              </p>
              <a
                href="https://wa.me/77477777888"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '12px 20px',
                  background: 'rgba(37,211,102,0.1)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  color: 'rgba(37,211,102,0.9)',
                  fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none', borderRadius: '6px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                +7 747 777 78 88
              </a>
            </div>

            {/* Office info */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '24px',
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)', marginBottom: '10px',
              }}>
                Headquarters &amp; Workshop
              </p>
              <p style={{
                fontFamily: 'EB Garamond, serif', fontSize: '20px',
                color: 'rgba(255,255,255,0.9)', margin: '0 0 16px',
              }}>
                {OFFICE.flag} Almaty, Kazakhstan
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href={`mailto:${OFFICE.email}`} style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '13px',
                  color: 'rgba(201,168,110,0.75)', textDecoration: 'none',
                }}>
                  {OFFICE.email}
                </a>
                <a href={`tel:${OFFICE.phone.replace(/\s/g, '')}`} style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '13px',
                  color: 'rgba(255,255,255,0.55)', textDecoration: 'none',
                }}>
                  {OFFICE.phone}
                </a>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '12px',
                  color: 'rgba(255,255,255,0.35)', margin: 0,
                }}>
                  {OFFICE.address}
                </p>
              </div>
            </div>

            {/* Response time */}
            <div style={{
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: 'rgba(100,200,120,0.9)',
                boxShadow: '0 0 8px rgba(100,200,120,0.5)',
                flexShrink: 0,
              }} />
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '12px',
                color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5,
              }}>
                {t('onlineText')}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: 'clamp(64px, 10vw, 100px) clamp(24px, 6vw, 80px)',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(201,168,110,0.7)', marginBottom: '40px',
            }}>
              {t('faqEyebrow')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {faqRaw.map((item, i) => (
                <div key={i} style={{
                  padding: '24px 0',
                  borderBottom: i < faqRaw.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  <p style={{
                    fontFamily: 'EB Garamond, serif', fontSize: '20px',
                    color: 'rgba(255,255,255,0.85)', margin: '0 0 10px',
                  }}>
                    {item.q}
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)', lineHeight: 1.75,
                    fontWeight: 300, margin: 0,
                  }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .contact-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </main>

      <FooterSection
        locale={locale}
        tagline={tFooter('tagline')}
        contactLabel={tFooter('contact')}
        followLabel={tFooter('follow')}
        address={tFooter('address')}
        copyright={tFooter('copyright')}
      />
    </>
  )
}
