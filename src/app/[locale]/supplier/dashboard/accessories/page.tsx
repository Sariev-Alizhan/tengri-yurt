import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';

export default async function SupplierAccessoriesPage() {
  const t = await getTranslations('supplier');
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect(`/${locale}/supplier/login`); return null; }
  const { data: supplier } = await supabase.from('suppliers').select('id').eq('user_id', user.id).single();
  if (!supplier) { redirect(`/${locale}/supplier/register`); return null; }
  const { data: accessories } = await supabase
    .from('accessories')
    .select('id, name, slug, category, price_usd, price_kzt, is_available, photos, stock_quantity')
    .eq('supplier_id', (supplier as { id: string }).id)
    .order('created_at', { ascending: false });

  const categoryLabels: Record<string, string> = {
    carpet: t('categoryCarpet'),
    furniture: t('categoryFurniture'),
    cover: t('categoryCover'),
    other: t('categoryOther'),
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sp-text-3)', marginBottom: '6px' }}>
            Catalogue
          </p>
          <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(26px, 4vw, 36px)', color: 'var(--sp-text-1)', fontWeight: 400, margin: 0 }}>
            {t('accessories')}
          </h1>
        </div>
        <Link
          href="/supplier/dashboard/accessories/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            background: 'var(--sp-gold)', color: '#0a0806',
            padding: '10px 18px', borderRadius: '6px', textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
          {t('addAccessory')}
        </Link>
      </div>

      {/* Grid */}
      {(accessories ?? []).length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: '16px' }}>
          {(accessories ?? []).map((acc) => (
            <div key={acc.id} style={{
              background: 'var(--sp-surface)',
              border: '1px solid var(--sp-border)',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              {acc.photos?.[0] ? (
                <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                  <Image src={acc.photos[0]} alt={acc.name} fill style={{ objectFit: 'cover' }} sizes="200px" />
                </div>
              ) : (
                <div style={{ aspectRatio: '4/3', background: 'var(--sp-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" opacity="0.2">
                    <rect x="3" y="5" width="22" height="18" rx="2" stroke="var(--sp-gold)" strokeWidth="1.5" fill="none"/>
                    <circle cx="10" cy="11" r="2.5" stroke="var(--sp-gold)" strokeWidth="1.25" fill="none"/>
                    <path d="M3 19l6-5 5 4 4-3 7 5" stroke="var(--sp-gold)" strokeWidth="1.25" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  display: 'inline-block', fontFamily: 'Inter, sans-serif',
                  fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'var(--sp-text-3)',
                  background: 'var(--sp-surface-2)', border: '1px solid var(--sp-border)',
                  padding: '2px 8px', borderRadius: '999px', marginBottom: '8px',
                }}>
                  {categoryLabels[acc.category] || acc.category}
                </span>
                <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: '20px', color: 'var(--sp-text-1)', margin: '0 0 4px', fontWeight: 400 }}>
                  {acc.name}
                </h2>
                <div style={{ marginBottom: '8px' }}>
                  {acc.price_usd && (
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--sp-gold)', margin: '0 0 2px', fontWeight: 510 }}>
                      ${acc.price_usd}
                    </p>
                  )}
                  {acc.price_kzt && (
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--sp-text-3)', margin: 0 }}>
                      {acc.price_kzt.toLocaleString()} ₸
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: acc.is_available ? 'rgba(100,200,120,0.9)' : 'var(--sp-text-3)',
                    background: acc.is_available ? 'rgba(100,200,120,0.1)' : 'var(--sp-surface-2)',
                    border: `1px solid ${acc.is_available ? 'rgba(100,200,120,0.2)' : 'var(--sp-border)'}`,
                    padding: '3px 8px', borderRadius: '999px',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    {acc.is_available ? t('isAvailable') : t('unavailable')}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--sp-text-3)' }}>
                    {t('stock')}: {acc.stock_quantity}
                  </span>
                </div>
                <Link
                  href={`/supplier/dashboard/accessories/${acc.id}`}
                  style={{
                    marginTop: 'auto', fontFamily: 'Inter, sans-serif', fontSize: '12px',
                    fontWeight: 500, color: 'var(--sp-gold)', textDecoration: 'none',
                    opacity: 0.75, display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  {t('edit')}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '64px 32px', textAlign: 'center', border: '1px solid var(--sp-border)', borderRadius: '12px', background: 'var(--sp-surface)' }}>
          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '20px', color: 'var(--sp-text-3)', margin: '0 0 20px' }}>
            {t('noAccessoriesYet')}
          </p>
          <Link href="/supplier/dashboard/accessories/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            background: 'var(--sp-gold)', color: '#0a0806',
            padding: '10px 18px', borderRadius: '6px', textDecoration: 'none',
          }}>
            + {t('addAccessory')}
          </Link>
        </div>
      )}
    </div>
  );
}
