'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { AccessoryModal } from '@/components/AccessoryModal';
import { Spinner } from '@/components/Spinner';

type Props = {
  yurtId: string;
  translations: Record<string, string>;
};

const KEREGE_COLORS = [
  { key: 'natural' as const, hex: '#c4b5a0', border: 'rgba(196,181,160,0.6)' },
  { key: 'blue' as const, hex: '#2a4a6b', border: 'rgba(42,74,107,0.6)' },
  { key: 'red' as const, hex: '#8b2020', border: 'rgba(139,32,32,0.6)' },
  { key: 'silver' as const, hex: '#9c8a72', border: 'rgba(156,138,114,0.6)' },
];

export function OrderForm({ yurtId, translations }: Props) {
  const router = useRouter();
  const locale = useLocale();
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
        {/* Accessories summary */}
        <div className="mb-10">
          {selectedAccessories.length > 0 ? (
            <div className="p-5 border border-white/15 rounded-lg bg-white/[0.03]">
              <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
                {locale === 'ru' ? 'Выбранные аксессуары' : locale === 'kk' ? 'Таңдалған аксессуарлар' : 'Selected Accessories'}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedAccessories.map((id) => (
                  <span
                    key={id}
                    className="px-3 py-1.5 bg-white/8 border border-white/15 text-white/80 text-xs font-inter"
                  >
                    {id.replace('default-', '').replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowAccessoryModal(true)}
                className="text-white/40 text-[10px] font-inter uppercase tracking-[0.15em] hover:text-white/70 transition-colors"
              >
                {locale === 'ru' ? 'Изменить' : locale === 'kk' ? 'Өзгерту' : 'Change'} →
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAccessoryModal(true)}
              className="w-full p-5 border border-dashed border-white/15 bg-transparent text-white/40 hover:bg-white/[0.03] hover:border-white/30 hover:text-white/60 transition-all duration-300 font-inter text-sm rounded-lg"
            >
              {locale === 'ru' ? '+ Добавить традиционные аксессуары' : locale === 'kk' ? '+ Дәстүрлі аксессуарлар қосу' : '+ Add Traditional Accessories'}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-24 md:pb-8">

          {/* ═══ SECTION 1: Interior ═══ */}
          {translations.interiorTitle && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25">01</span>
                <div className="h-px flex-1 bg-white/8" />
              </div>
              <h3 className="font-garamond text-white text-2xl md:text-3xl font-light mb-8">
                {translations.interiorTitle}
              </h3>

              {/* Kerege color swatches */}
              <div className="mb-8">
                <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4">
                  {translations.keregeColor}
                </p>
                <div className="flex gap-4">
                  {KEREGE_COLORS.map(({ key, hex }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setKeregeColor(key)}
                      className="group flex flex-col items-center gap-2.5"
                    >
                      <div
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: hex,
                          boxShadow: keregeColor === key
                            ? `0 0 0 2px #0f0d0a, 0 0 0 4px rgba(168,149,120,0.6)`
                            : '0 0 0 1px rgba(255,255,255,0.1)',
                        }}
                      />
                      <span className={`font-inter text-[9px] tracking-[0.15em] uppercase transition-colors duration-300 ${
                        keregeColor === key ? 'text-white/80' : 'text-white/25'
                      }`}>
                        {translations[`kerege_${key}`]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Furniture note */}
              <p className="font-inter text-white/40 text-xs mb-6">
                {translations.furniture}: {translations.furnitureInStock}
              </p>

              {/* Custom options — card style */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setExclusiveCustom(!exclusiveCustom)}
                  className={`w-full flex items-center gap-4 p-4 border rounded-lg text-left transition-all duration-300 ${
                    exclusiveCustom
                      ? 'border-white/30 bg-white/[0.06]'
                      : 'border-white/8 bg-transparent hover:border-white/15'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all duration-300 ${
                    exclusiveCustom ? 'border-white/60 bg-white/20' : 'border-white/20'
                  }`}>
                    {exclusiveCustom && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                  <div>
                    <span className="block font-inter text-white/90 text-sm">{translations.exclusiveCustom}</span>
                    <span className="block font-inter text-white/30 text-xs mt-0.5">{translations.assemblyNote}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCoverCustom(!coverCustom)}
                  className={`w-full flex items-center gap-4 p-4 border rounded-lg text-left transition-all duration-300 ${
                    coverCustom
                      ? 'border-white/30 bg-white/[0.06]'
                      : 'border-white/8 bg-transparent hover:border-white/15'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all duration-300 ${
                    coverCustom ? 'border-white/60 bg-white/20' : 'border-white/20'
                  }`}>
                    {coverCustom && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                  <div>
                    <span className="block font-inter text-white/90 text-sm">{translations.coverOption}</span>
                    <span className="block font-inter text-white/30 text-xs mt-0.5">{translations.coverPrice}</span>
                  </div>
                </button>
              </div>
            </section>
          )}

          {/* ═══ SECTION 2: Logistics ═══ */}
          {translations.logisticsTitle && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25">02</span>
                <div className="h-px flex-1 bg-white/8" />
              </div>
              <h3 className="font-garamond text-white text-2xl md:text-3xl font-light mb-8">
                {translations.logisticsTitle}
              </h3>

              {/* Shipping method cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setShippingMethod('air')}
                  className={`p-5 border rounded-lg text-left transition-all duration-300 ${
                    shippingMethod === 'air'
                      ? 'border-white/30 bg-white/[0.06]'
                      : 'border-white/8 hover:border-white/15'
                  }`}
                >
                  <svg className="mb-3 text-white/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                  <span className="block font-inter text-white/90 text-sm font-medium">{translations.airShipping?.split('—')[0]?.trim()}</span>
                  <span className="block font-inter text-white/30 text-xs mt-1">{translations.airShipping?.includes('—') ? translations.airShipping.split('—')[1]?.trim() : ''}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('sea')}
                  className={`p-5 border rounded-lg text-left transition-all duration-300 ${
                    shippingMethod === 'sea'
                      ? 'border-white/30 bg-white/[0.06]'
                      : 'border-white/8 hover:border-white/15'
                  }`}
                >
                  <svg className="mb-3 text-white/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 20a6 6 0 0 0 12 0 6 6 0 0 0 8 0" /><path d="M12 12V2l4 4-4 4" /><path d="M12 6H4" />
                  </svg>
                  <span className="block font-inter text-white/90 text-sm font-medium">{translations.seaShipping?.split('—')[0]?.trim()}</span>
                  <span className="block font-inter text-white/30 text-xs mt-1">{translations.seaShipping?.includes('—') ? translations.seaShipping.split('—')[1]?.trim() : ''}</span>
                </button>
              </div>

              <p className="font-inter text-white/25 text-xs leading-relaxed">{translations.installationNote}</p>
            </section>
          )}

          {/* ═══ SECTION 3: Your Details ═══ */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25">03</span>
              <div className="h-px flex-1 bg-white/8" />
            </div>
            <h3 className="font-garamond text-white text-2xl md:text-3xl font-light mb-8">
              {locale === 'ru' ? 'Ваши данные' : locale === 'kk' ? 'Сіздің деректеріңіз' : 'Your Details'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <FormField label={translations.name} name="name" required />
              <FormField label={translations.email} name="email" type="email" required />
              <FormField label={translations.phone} name="phone" type="tel" required />
              <FormField label={translations.country} name="country" required placeholder="e.g. Kazakhstan, UAE, USA" />
              <FormField label={translations.city} name="city" required />
              <FormField label={translations.address} name="address" />
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">{translations.quantity}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-white/15 rounded flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white/70 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" /></svg>
                </button>
                <input
                  name="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  className="w-16 text-center bg-transparent text-white font-inter text-lg border-0 border-b border-white/15 focus:outline-none focus:border-white/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-white/15 rounded flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white/70 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>
            </div>

            {/* Message */}
            <div className="mt-6">
              <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">{translations.message}</p>
              <textarea
                name="message"
                rows={3}
                className="w-full bg-transparent text-white/90 border border-white/10 rounded-lg p-4 font-inter text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </div>
          </section>

          {/* ═══ Agreement + Submit ═══ */}
          <div className="pt-4 border-t border-white/8">
            <label className="flex items-start gap-3 cursor-pointer group mb-8">
              <button
                type="button"
                onClick={() => setAgreement(!agreement)}
                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  agreement ? 'border-white/60 bg-white/20' : 'border-white/20 group-hover:border-white/30'
                }`}
              >
                {agreement && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                )}
              </button>
              <span className="font-inter text-white/50 text-sm leading-relaxed">
                {translations.agreement}
              </span>
            </label>

            {error && (
              <p className="font-inter text-red-400/80 text-sm mb-6">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !agreement}
              className={`w-full md:w-auto px-12 py-4 font-inter text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-300 rounded-lg ${
                loading || !agreement
                  ? 'border border-white/10 text-white/20 cursor-not-allowed'
                  : 'border border-white/50 text-white bg-white/10 hover:bg-white hover:text-[#0f0d0a] cursor-pointer'
              }`}
            >
              {loading ? <Spinner /> : translations.submitInquiry}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function FormField({ label, name, type = 'text', required, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
        {label}{required && <span className="text-white/20 ml-1">*</span>}
      </p>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent text-white/90 border-0 border-b border-white/15 pb-2 pt-1 font-inter text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
      />
    </div>
  );
}
