import { getTranslations, getLocale } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';

export default async function SupplierYurtsPage() {
  const t = await getTranslations('supplier');
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect(`/${locale}/supplier/login`); return null; }
  const { data: supplier } = await supabase.from('suppliers').select('id').eq('user_id', user.id).single();
  if (!supplier) { redirect(`/${locale}/supplier/register`); return null; }
  const { data: yurts } = await supabase
    .from('yurts')
    .select('id, name, slug, price_usd, is_available, photos')
    .eq('supplier_id', (supplier as { id: string }).id)
    .order('created_at', { ascending: false });

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sp-text-3)', marginBottom: '6px' }}>
            Catalogue
          </p>
          <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(26px, 4vw, 36px)', color: 'var(--sp-text-1)', fontWeight: 400, margin: 0 }}>
            {t('yurts')}
          </h1>
        </div>
        <Link
          href="/supplier/dashboard/yurts/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            background: 'var(--sp-gold)', color: '#0a0806',
            padding: '10px 18px', borderRadius: '6px', textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
          {t('addYurt')}
        </Link>
      </div>

      {/* Grid */}
      {(yurts ?? []).length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '16px' }}>
          {(yurts ?? []).map((y) => (
            <div key={y.id} style={{
              background: 'var(--sp-surface)',
              border: '1px solid var(--sp-border)',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              {y.photos?.[0] ? (
                <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img src={y.photos[0]} alt={y.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ) : (
                <div style={{ aspectRatio: '4/3', background: 'var(--sp-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.2">
                    <path d="M16 2L2 12v16h8V18h12v10h8V12L16 2Z" stroke="var(--sp-gold)" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
              )}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: '20px', color: 'var(--sp-text-1)', margin: '0 0 4px', fontWeight: 400 }}>
                  {y.name}
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--sp-gold)', margin: '0 0 6px', fontWeight: 510 }}>
                  ${y.price_usd?.toLocaleString()}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: y.is_available ? 'rgba(100,200,120,0.9)' : 'var(--sp-text-3)',
                    background: y.is_available ? 'rgba(100,200,120,0.1)' : 'var(--sp-surface-2)',
                    border: `1px solid ${y.is_available ? 'rgba(100,200,120,0.2)' : 'var(--sp-border)'}`,
                    padding: '3px 8px', borderRadius: '999px',
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    {y.is_available ? t('isAvailable') : t('unavailable')}
                  </span>
                </div>
                <Link
                  href={`/supplier/dashboard/yurts/${y.id}`}
                  style={{
                    marginTop: 'auto', fontFamily: 'Inter, sans-serif', fontSize: '12px',
                    fontWeight: 500, color: 'var(--sp-gold)', textDecoration: 'none',
                    opacity: 0.75, display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  {t('editYurt')}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '64px 32px', textAlign: 'center', border: '1px solid var(--sp-border)', borderRadius: '12px', background: 'var(--sp-surface)' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.2 }}>
            <path d="M20 4L4 14v22h10V24h12v12h10V14L20 4Z" stroke="var(--sp-gold)" strokeWidth="1.5" fill="none"/>
          </svg>
          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '20px', color: 'var(--sp-text-3)', margin: '0 0 20px' }}>
            No yurts yet
          </p>
          <Link href="/supplier/dashboard/yurts/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            background: 'var(--sp-gold)', color: '#0a0806',
            padding: '10px 18px', borderRadius: '6px', textDecoration: 'none',
          }}>
            + {t('addYurt')}
          </Link>
        </div>
      )}
    </div>
  );
}
