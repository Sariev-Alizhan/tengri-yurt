'use client';

import { Link } from '@/i18n/navigation';

interface SuccessPageClientProps {
  orderNumbers: string[];
  translations: {
    title: string;
    subtitle: string;
    thankYou?: string;
    downloadPdf?: string;
    backToCatalog: string;
    orderPlaced?: string;
    orderPlacedSub?: string;
  };
}

export function SuccessPageClient({
  orderNumbers,
  translations,
}: SuccessPageClientProps) {
  const fromCart = orderNumbers.length > 0 && (translations.orderPlaced ?? '');
  const title = fromCart ? (translations.orderPlaced ?? translations.title) : translations.title;
  const subtitle = fromCart ? (translations.orderPlacedSub ?? translations.subtitle) : translations.subtitle;
  const thankYou = translations.thankYou ?? 'Thank you for your order!';
  const downloadPdf = translations.downloadPdf ?? 'Download PDF';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1510',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(80px, 15vw, 140px) 24px clamp(60px, 10vw, 100px)',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
      }}>

        {/* Success icon */}
        <div style={{
          width: '64px', height: '64px',
          margin: '0 auto 32px',
          border: '1px solid rgba(201,168,110,0.4)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(201,168,110,0.08)',
        }}>
          <svg width="24" height="24" fill="none" stroke="rgba(201,168,110,0.9)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Eyebrow */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(201,168,110,0.7)', marginBottom: '16px',
        }}>
          Order confirmed
        </p>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: 'clamp(28px, 5vw, 44px)',
          color: 'rgba(255,255,255,0.93)',
          fontWeight: 400, lineHeight: 1.2,
          margin: '0 0 12px',
        }}>
          {thankYou}
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '15px',
          color: 'rgba(255,255,255,0.7)', margin: '0 0 8px',
          lineHeight: 1.6,
        }}>
          {title}
        </p>

        {/* Order numbers */}
        {orderNumbers.length > 0 && (
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            margin: '12px 0',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '12px',
              color: 'rgba(255,255,255,0.55)', margin: 0,
              letterSpacing: '0.05em',
            }}>
              {orderNumbers.length === 1
                ? `Order #${orderNumbers[0]}`
                : `Orders: ${orderNumbers.map((n) => `#${n}`).join(', ')}`}
            </p>
          </div>
        )}

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '13px',
          color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
          fontWeight: 300, margin: '16px 0 40px',
        }}>
          {subtitle}
        </p>

        {/* Download PDFs */}
        {orderNumbers.length > 0 && (
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'center',
            gap: '10px', marginBottom: '16px',
          }}>
            {orderNumbers.map((num) => (
              <a
                key={num}
                href={`/api/orders/pdf?orderNumber=${encodeURIComponent(num)}&type=client`}
                download
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '11px 20px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none', borderRadius: '4px',
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {downloadPdf} #{num}
              </a>
            ))}
          </div>
        )}

        {/* Contact us */}
        <div style={{
          margin: '0 0 24px',
          padding: '20px 24px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: '14px',
          }}>
            Questions? Get in touch
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/77477777888"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '10px 18px',
                background: 'rgba(37,211,102,0.1)',
                border: '1px solid rgba(37,211,102,0.3)',
                color: 'rgba(37,211,102,0.85)',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: '4px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:info@tengri-camp.kz"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '10px 18px',
                background: 'rgba(201,168,110,0.08)',
                border: '1px solid rgba(201,168,110,0.25)',
                color: 'rgba(201,168,110,0.8)',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: '4px',
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@tengri-camp.kz
            </a>
          </div>
        </div>

        {/* Back to catalog */}
        <Link
          href="/catalog"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 36px',
            background: 'rgba(201,168,110,0.1)',
            border: '1px solid rgba(201,168,110,0.4)',
            color: 'rgba(201,168,110,0.9)',
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            textDecoration: 'none', borderRadius: '4px',
          }}
        >
          {translations.backToCatalog}
        </Link>
      </div>
    </div>
  );
}
