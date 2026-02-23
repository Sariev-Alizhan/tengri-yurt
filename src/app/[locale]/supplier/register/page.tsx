import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { SupplierRegisterForm } from './SupplierRegisterForm'

export default async function SupplierRegisterPage() {
  const t = await getTranslations('supplier')
  const locale = await getLocale()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const existingUserId = user?.id ?? null
  // Если уже залогинен и запись поставщика есть — сразу в кабинет (не показывать форму и не давать дубликат)
  if (existingUserId) {
    const { data: supplier } = await supabase.from('suppliers').select('id').eq('user_id', existingUserId).single()
    if (supplier) redirect(`/${locale}/supplier/dashboard`)
  }
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundImage: 'url(/images/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        background: 'rgba(30,20,12,0.78)',
      }} />
      <div style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(168,149,120,0.15)',
          padding: 'clamp(32px, 5vw, 56px)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="/images/logo.png" alt="Tengri Yurt"
              style={{ height: '56px', width: 'auto', marginBottom: '12px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(168,149,120,0.5)',
            }}>
              {t('portalTitle')}
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '24px',
          }}>
            {(['en', 'ru', 'kk', 'zh'] as const).map((loc) => (
              <a
                key={loc}
                href={`/${loc}/supplier/register`}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: locale === loc ? 600 : 400,
                  letterSpacing: '0.1em',
                  color: locale === loc ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                {loc === 'en' ? 'EN' : loc === 'ru' ? 'RU' : loc === 'kk' ? 'KZ' : 'CN'}
              </a>
            ))}
          </div>
          <h1 style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: '36px',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 400,
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            {t('register')}
          </h1>

          <SupplierRegisterForm
            existingUserId={existingUserId}
            translations={{
              companyName: t('companyName'),
              description: t('description'),
              email: t('email'),
              password: t('password'),
              submit: t('submit'),
              completeProfile: t('completeProfile'),
            }}
          />

          <p style={{
            marginTop: '24px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
          }}>
            {t('alreadyRegisteredPrompt')}{' '}
            <Link
              href={`/${locale}/supplier/login`}
              style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
            >
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
