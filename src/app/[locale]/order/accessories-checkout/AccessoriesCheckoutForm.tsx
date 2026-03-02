'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccessoryItem } from '@/data/accessories';

type Props = {
  selectedAccessories: AccessoryItem[];
  orderNumber?: string;
  locale: string;
  translations: Record<string, string>;
};

export function AccessoriesCheckoutForm({
  selectedAccessories,
  orderNumber,
  locale,
  translations,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    const country = (formData.get('country') as string)?.trim();
    const city = (formData.get('city') as string)?.trim();
    const address = (formData.get('address') as string)?.trim() || null;
    const messageText = (formData.get('message') as string)?.trim() || '';

    if (!name || !email || !phone || !country || !city) {
      setError('Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders/accessories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessories: selectedAccessories.map(acc => ({
            id: acc.id,
            name: acc.name,
            price_kzt: acc.price_kzt,
            price_usd: acc.price_usd,
          })),
          buyerName: name,
          buyerEmail: email,
          buyerPhone: phone,
          deliveryCountry: country,
          deliveryCity: city,
          deliveryAddress: address,
          message: messageText,
          relatedOrderNumber: orderNumber,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      router.push(`/${locale}/order/success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-transparent text-white border-0 border-b border-white/40 pb-2 pt-1 font-inter placeholder:text-white/40 focus:outline-none focus:border-white';
  const labelClass =
    'block font-inter text-white/60 text-xs uppercase tracking-[0.1em] mb-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>{translations.name} *</label>
        <input name="name" type="text" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{translations.email} *</label>
        <input name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{translations.phone} *</label>
        <input name="phone" type="tel" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{translations.country} *</label>
        <input
          name="country"
          type="text"
          required
          placeholder="e.g. Kazakhstan, Russia, USA"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>{translations.city} *</label>
        <input name="city" type="text" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{translations.address}</label>
        <input name="address" type="text" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{translations.message}</label>
        <textarea
          name="message"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p className="font-inter text-red-400 text-sm">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          border: '1px solid rgba(255,255,255,0.6)',
          background: 'transparent',
          color: 'rgba(255,255,255,0.9)',
          padding: '14px 40px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.2s ease',
          appearance: 'none',
          WebkitAppearance: 'none',
        }}
      >
        {loading ? '...' : translations.submitInquiry}
      </button>
    </form>
  );
}
