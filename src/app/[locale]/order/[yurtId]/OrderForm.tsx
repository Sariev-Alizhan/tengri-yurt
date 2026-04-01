'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { AccessoryModal } from '@/components/AccessoryModal';
import { Spinner } from '@/components/Spinner';

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
  const [keregeColor, setKeregeColor] = useState<'natural' | 'blue' | 'red' | 'silver'>('natural');
  const [exclusiveCustom, setExclusiveCustom] = useState(false);
  const [coverCustom, setCoverCustom] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'air' | 'sea'>('air');
  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [agreement, setAgreement] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAccessoryModal(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAccessorySelection = (accessories: string[]) => {
    setSelectedAccessories(accessories);
    setShowAccessoryModal(false);
    setTimeout(() => {
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const handleAccessoryClose = () => {
    setShowAccessoryModal(false);
    setTimeout(() => {
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

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

    const orderOptions = {
      interior: { keregeColor, exclusiveCustom, coverCustom },
      logistics: { method: shippingMethod },
      selectedAccessories: selectedAccessories.length > 0 ? selectedAccessories : undefined,
    };
    const message = messageText || undefined;

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
          orderOptions,
          shippingMethod,
          locale,
          selectedAccessories,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      router.push(`/order/success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-transparent text-white border-0 border-b border-white/40 pb-2 pt-1 font-inter placeholder:text-white/40 focus:outline-none focus:border-white transition-all duration-300';
  const labelClass =
    'block font-inter text-white/60 text-xs uppercase tracking-[0.1em] mb-2';

  return (
    <>
      <AccessoryModal
        isOpen={showAccessoryModal}
        onClose={handleAccessoryClose}
        onProceed={handleAccessorySelection}
        locale={locale}
      />
      
      <div
        className="transition-all duration-500 ease-out"
        style={{
          opacity: showForm ? 1 : 0,
          transform: showForm ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: showForm ? 'auto' : 'none',
        }}
      >
        <div className="mb-8">
          {selectedAccessories.length > 0 ? (
            <div className="p-4 border border-white/30 rounded bg-white/5 animate-fadeIn">
              <h3 className="font-garamond text-white text-lg mb-3">
                {locale === 'ru' ? '✓ Выбранные аксессуары' : locale === 'kk' ? '✓ Таңдалған аксессуарлар' : '✓ Selected Accessories'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedAccessories.map((id) => {
                  const acc = require('@/data/accessories').TRADITIONAL_ACCESSORIES.find((a: any) => a.id === id);
                  return acc ? (
                    <span
                      key={id}
                      className="px-3 py-1 bg-white/10 border border-white/30 rounded-full text-white/80 text-xs font-inter transition-all duration-300 hover:bg-white/20"
                    >
                      {acc.name[locale as 'ru' | 'en' | 'kk']}
                    </span>
                  ) : null;
                })}
              </div>
              <button
                type="button"
                onClick={() => setShowAccessoryModal(true)}
                className="mt-3 text-white/60 text-xs font-inter uppercase tracking-wider hover:text-white transition-all duration-200"
              >
                {locale === 'ru' ? 'Изменить выбор →' : locale === 'kk' ? 'Таңдауды өзгерту →' : 'Change selection →'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAccessoryModal(true)}
              className="w-full p-4 border border-white/30 border-dashed rounded bg-transparent text-white/70 hover:bg-white/5 hover:border-white/50 hover:text-white transition-all duration-300 font-inter text-sm"
            >
              {locale === 'ru' ? '+ Добавить традиционные аксессуары' : locale === 'kk' ? '+ Дәстүрлі аксессуарлар қосу' : '+ Add Traditional Accessories'}
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 pb-24 md:pb-8">
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
          className={`${inputClass} w-24 min-h-[44px]`}
        />
      </div>

      {translations.interiorTitle && (
        <div className="pt-4 border-t border-white/20 space-y-4">
          <h3 className="font-garamond text-white text-lg">{translations.interiorTitle}</h3>
          <div>
            <span className={labelClass}>{translations.keregeColor}</span>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 mt-2">
              {(['natural', 'blue', 'red', 'silver'] as const).map((color) => (
                <label key={color} className="flex items-center gap-2 cursor-pointer text-white/80 font-inter text-sm">
                  <input
                    type="radio"
                    name="keregeColor"
                    checked={keregeColor === color}
                    onChange={() => setKeregeColor(color)}
                    className="accent-white/80"
                  />
                  {translations[`kerege_${color}`]}
                </label>
              ))}
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

      {translations.logisticsTitle && (
        <div className="pt-4 border-t border-white/20 space-y-4">
          <h3 className="font-garamond text-white text-lg">{translations.logisticsTitle}</h3>
          <div>
            <span className={labelClass}>{translations.shippingMethod}</span>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-white/80 font-inter text-sm">
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethod === 'air'}
                  onChange={() => setShippingMethod('air')}
                  className="accent-white/80"
                />
                {translations.airShipping}
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-white/80 font-inter text-sm">
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethod === 'sea'}
                  onChange={() => setShippingMethod('sea')}
                  className="accent-white/80"
                />
                {translations.seaShipping}
              </label>
            </div>
          </div>
          <p className="text-white/50 text-xs font-inter">{translations.installationNote}</p>
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

      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreement}
            onChange={(e) => setAgreement(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-white/30 bg-white/5 accent-amber-600 flex-shrink-0"
          />
          <span className="font-inter text-white/70 text-sm leading-relaxed">
            {translations.agreement}
          </span>
        </label>
      </div>

      {error && (
        <p className="font-inter text-red-400 text-sm">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !agreement}
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
          cursor: loading || !agreement ? 'not-allowed' : 'pointer',
          opacity: loading || !agreement ? 0.4 : 1,
          transition: 'all 0.2s ease',
          appearance: 'none',
          WebkitAppearance: 'none',
        }}
      >
        {loading ? <Spinner /> : translations.submitInquiry}
      </button>
    </form>
      </div>
    </>
  );
}
