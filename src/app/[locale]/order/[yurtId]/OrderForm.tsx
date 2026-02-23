'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

type Props = {
  yurtId: string;
  translations: Record<string, string>;
};

export function OrderForm({ yurtId, translations }: Props) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [floorWalls, setFloorWalls] = useState<'felt' | 'carpolan'>('felt');
  const [exclusiveCustom, setExclusiveCustom] = useState(false);
  const [coverCustom, setCoverCustom] = useState(false);

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
    const qty = Number(formData.get('quantity')) || 1;

    const options: string[] = [];
    options.push(floorWalls === 'felt' ? translations.feltOption : translations.carpolanOption);
    options.push(translations.furnitureInStock);
    if (exclusiveCustom) options.push(translations.exclusiveCustom);
    if (coverCustom) options.push(`${translations.coverOption} — ${translations.coverPrice}`);
    options.push(translations.assemblyNote);
    const optionsBlock = `[Interior]\n${options.join('\n')}`;
    const message = messageText ? `${messageText}\n\n${optionsBlock}` : optionsBlock;

    if (!name || !email || !phone || !country || !city) {
      setError('Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yurtId,
          buyerName: name,
          buyerEmail: email,
          buyerPhone: phone,
          deliveryCountry: country,
          deliveryCity: city,
          deliveryAddress: address,
          quantity: qty,
          message,
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
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
      <div
        className="grid gap-6 md:gap-8"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '24px',
        }}
      >
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
        <label className={labelClass}>{translations.quantity}</label>
        <input
          name="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          className={`${inputClass} w-24`}
        />
      </div>

      {translations.interiorTitle && (
        <div className="pt-4 border-t border-white/20 space-y-4">
          <h3 className="font-garamond text-white text-lg">{translations.interiorTitle}</h3>
          <div>
            <span className={labelClass}>{translations.floorWalls}</span>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-white/80 font-inter text-sm">
                <input
                  type="radio"
                  name="floorWalls"
                  checked={floorWalls === 'felt'}
                  onChange={() => setFloorWalls('felt')}
                  className="accent-white/80"
                />
                {translations.feltOption}
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-white/80 font-inter text-sm">
                <input
                  type="radio"
                  name="floorWalls"
                  checked={floorWalls === 'carpolan'}
                  onChange={() => setFloorWalls('carpolan')}
                  className="accent-white/80"
                />
                {translations.carpolanOption}
              </label>
            </div>
          </div>
          <p className="text-white/60 text-sm font-inter">{translations.furniture}: {translations.furnitureInStock}</p>
          <label className="flex items-center gap-2 cursor-pointer text-white/80 font-inter text-sm">
            <input
              type="checkbox"
              checked={exclusiveCustom}
              onChange={(e) => setExclusiveCustom(e.target.checked)}
              className="accent-white/80"
            />
            {translations.exclusiveCustom}
          </label>
          <p className="text-white/50 text-xs font-inter">{translations.assemblyNote}</p>
          <label className="flex items-center gap-2 cursor-pointer text-white/80 font-inter text-sm">
            <input
              type="checkbox"
              checked={coverCustom}
              onChange={(e) => setCoverCustom(e.target.checked)}
              className="accent-white/80"
            />
            {translations.coverOption} — {translations.coverPrice}
          </label>
        </div>
      )}

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
