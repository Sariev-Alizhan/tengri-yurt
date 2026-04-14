import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { DEFAULT_YURTS } from '@/lib/defaultCatalog';
import Navbar from '@/components/Navbar';
import { OrderForm } from './OrderForm';

export const metadata: Metadata = {
  title: 'Configure & Order — Tengri Yurt',
  description: 'Customize your traditional Kazakh yurt — select interior color, accessories, and shipping. Submit an inquiry to our team.',
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string; yurtId: string }>;
}) {
  const { yurtId } = await params;
  const t = await getTranslations('order');
  const supabase = await createClient();
  const { data: dbYurt, error } = await supabase
    .from('yurts')
    .select('id, name, price_usd')
    .eq('id', yurtId)
    .eq('is_available', true)
    .single();

  let yurt = dbYurt;
  if (error || !yurt) {
    const fallback = DEFAULT_YURTS.find((y) => y.id === yurtId);
    if (!fallback) notFound();
    yurt = { id: fallback.id, name: fallback.name, price_usd: fallback.price_usd };
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--of-bg)' }}>
      <Navbar />

      {/* Page header */}
      <div style={{
        paddingTop: 'clamp(96px, 16vw, 140px)',
        paddingBottom: 'clamp(32px, 5vw, 48px)',
        paddingLeft: 'clamp(24px, 6vw, 80px)',
        paddingRight: 'clamp(24px, 6vw, 80px)',
        borderBottom: '1px solid var(--of-border-soft)',
        maxWidth: '880px',
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(201,168,110,0.6)', marginBottom: '12px',
        }}>
          {t('title')}
        </p>
        <h1 style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: 'clamp(28px, 6vw, 52px)',
          fontWeight: 400, lineHeight: 1.1, color: 'var(--of-text-1)',
          margin: '0 0 10px',
        }}>
          {yurt.name}
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '13px',
          color: 'var(--of-text-3)', fontWeight: 300,
        }}>
          {t('pricingNote', { price: yurt.price_usd })}
        </p>
      </div>

      {/* Form */}
      <div style={{
        maxWidth: '880px',
        margin: '0 auto',
        padding: 'clamp(32px, 6vw, 56px) clamp(24px, 6vw, 80px) clamp(48px, 8vw, 96px)',
      }}>
        <OrderForm
          yurtId={yurt.id}
          yurtName={yurt.name}
          yurtPrice={yurt.price_usd}
          translations={{
            name: t('name'),
            email: t('email'),
            phone: t('phone'),
            country: t('country'),
            city: t('city'),
            address: t('address'),
            quantity: t('quantity'),
            message: t('message'),
            submitInquiry: t('submitInquiry'),
            interiorTitle: t('interiorTitle'),
            keregeColor: t('keregeColor'),
            kerege_natural: t('keregeNatural'),
            kerege_blue: t('keregeBlue'),
            kerege_red: t('keregeRed'),
            kerege_silver: t('keregeSilver'),
            furniture: t('furniture'),
            furnitureInStock: t('furnitureInStock'),
            exclusiveCustom: t('exclusiveCustom'),
            assemblyNote: t('assemblyNote'),
            coverOption: t('coverOption'),
            coverPrice: t('coverPrice'),
            logisticsTitle: t('logisticsTitle'),
            shippingMethod: t('shippingMethod'),
            airShipping: t('airShipping'),
            seaShipping: t('seaShipping'),
            installationNote: t('installationNote'),
            agreement: t('agreement'),
          }}
        />
      </div>
    </div>
  );
}
