'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { TRADITIONAL_ACCESSORIES } from '@/data/accessories';
import { Spinner } from '@/components/Spinner';

type Props = {
  yurtId: string;
  yurtPrice: number;
  translations: Record<string, string>;
};

const KEREGE_COLORS = [
  { key: 'natural' as const, hex: '#c4b5a0' },
  { key: 'blue' as const, hex: '#2a4a6b' },
  { key: 'red' as const, hex: '#8b2020' },
  { key: 'silver' as const, hex: '#9c8a72' },
];

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  structure: { en: 'Structure', ru: 'Конструкция', kk: 'Құрылым' },
  cover: { en: 'Covers', ru: 'Покрытия', kk: 'Жабындылар' },
  decoration: { en: 'Decoration', ru: 'Декор', kk: 'Безендіру' },
  rope: { en: 'Ropes & Bindings', ru: 'Верёвки и обвязки', kk: 'Арқандар' },
};

export function OrderForm({ yurtId, yurtPrice, translations }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keregeColor, setKeregeColor] = useState<'natural' | 'blue' | 'red' | 'silver'>('natural');
  const [exclusiveCustom, setExclusiveCustom] = useState(false);
  const [coverCustom, setCoverCustom] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'air' | 'sea'>('air');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [agreement, setAgreement] = useState(false);

  const localeKey = (locale as 'ru' | 'en' | 'kk') || 'en';

  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
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

  // Group accessories by category
  const categories = ['structure', 'cover', 'decoration', 'rope'] as const;
  const grouped = categories.map(cat => ({
    key: cat,
    label: CATEGORY_LABELS[cat]?.[localeKey] || CATEGORY_LABELS[cat]?.en || cat,
    items: TRADITIONAL_ACCESSORIES.filter(a => a.category === cat),
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-32 md:pb-24">

      {/* ═══ SECTION 1: Interior ═══ */}
      {translations.interiorTitle && (
        <section>
          <SectionHeader num="01" />
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
                        ? '0 0 0 2px #0f0d0a, 0 0 0 4px rgba(168,149,120,0.6)'
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

          <p className="font-inter text-white/40 text-xs mb-6">
            {translations.furniture}: {translations.furnitureInStock}
          </p>

          <div className="space-y-3">
            <ToggleCard
              active={exclusiveCustom}
              onClick={() => setExclusiveCustom(!exclusiveCustom)}
              label={translations.exclusiveCustom}
              sub={translations.assemblyNote}
            />
            <ToggleCard
              active={coverCustom}
              onClick={() => setCoverCustom(!coverCustom)}
              label={translations.coverOption}
              sub={translations.coverPrice}
            />
          </div>
        </section>
      )}

      {/* ═══ SECTION 2: Accessories ═══ */}
      <section>
        <SectionHeader num="02" />
        <h3 className="font-garamond text-white text-2xl md:text-3xl font-light mb-2">
          {locale === 'ru' ? 'Аксессуары' : locale === 'kk' ? 'Аксессуарлар' : 'Accessories'}
        </h3>
        <p className="font-inter text-white/30 text-xs mb-8">
          {locale === 'ru' ? 'Выберите то, что вам нужно' : locale === 'kk' ? 'Қажеттісін таңдаңыз' : 'Select what you need'}
        </p>

        <div className="space-y-6">
          {grouped.map(({ key, label, items }) => (
            <div key={key}>
              <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">{label}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {items.map((acc) => {
                  const selected = selectedAccessories.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => toggleAccessory(acc.id)}
                      className={`group text-left transition-all duration-200 rounded-sm overflow-hidden ${
                        selected
                          ? 'ring-2 ring-[#C9A86E]'
                          : 'ring-1 ring-white/8 hover:ring-white/15'
                      }`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={acc.photo}
                          alt={acc.name[localeKey] || acc.name.en}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                          selected ? 'bg-[#C9A86E] scale-100' : 'bg-black/30 scale-0 group-hover:scale-100'
                        }`}>
                          {selected && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                      </div>
                      <div className="p-2.5">
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-inter text-white/80 text-xs leading-tight">
                            {acc.name[localeKey] || acc.name.en}
                          </span>
                          {acc.price_usd > 0 && (
                            <span className="font-inter text-[#C9A86E] text-[10px] shrink-0">
                              ${acc.price_usd.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedAccessories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
            <span className="font-inter text-white/40 text-xs">
              {locale === 'ru' ? 'Выбрано' : locale === 'kk' ? 'Таңдалды' : 'Selected'}: {selectedAccessories.length}
            </span>
            <span className="font-inter text-white/60 text-sm">
              ${TRADITIONAL_ACCESSORIES
                .filter(a => selectedAccessories.includes(a.id))
                .reduce((sum, a) => sum + a.price_usd, 0)
                .toLocaleString()}
            </span>
          </div>
        )}
      </section>

      {/* ═══ SECTION 3: Logistics ═══ */}
      {translations.logisticsTitle && (
        <section>
          <SectionHeader num="03" />
          <h3 className="font-garamond text-white text-2xl md:text-3xl font-light mb-8">
            {translations.logisticsTitle}
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <ShippingCard
              active={shippingMethod === 'air'}
              onClick={() => setShippingMethod('air')}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>}
              label={translations.airShipping?.split('—')[0]?.trim() || 'Air'}
              sub={translations.airShipping?.includes('—') ? translations.airShipping.split('—')[1]?.trim() : ''}
            />
            <ShippingCard
              active={shippingMethod === 'sea'}
              onClick={() => setShippingMethod('sea')}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a6 6 0 0 0 12 0 6 6 0 0 0 8 0" /><path d="M12 12V2l4 4-4 4" /><path d="M12 6H4" /></svg>}
              label={translations.seaShipping?.split('—')[0]?.trim() || 'Sea'}
              sub={translations.seaShipping?.includes('—') ? translations.seaShipping.split('—')[1]?.trim() : ''}
            />
          </div>
          <p className="font-inter text-white/25 text-xs leading-relaxed">{translations.installationNote}</p>
        </section>
      )}

      {/* ═══ SECTION 4: Your Details ═══ */}
      <section>
        <SectionHeader num="04" />
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

        <div className="mt-6">
          <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">{translations.quantity}</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-white/15 rounded flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white/70 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" /></svg>
            </button>
            <input name="quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 1)} className="w-16 text-center bg-transparent text-white font-inter text-lg border-0 border-b border-white/15 focus:outline-none focus:border-white/40 transition-colors" />
            <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-white/15 rounded flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white/70 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">{translations.message}</p>
          <textarea name="message" rows={3} className="w-full bg-transparent text-white/90 border border-white/10 rounded-sm p-4 font-inter text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none" />
        </div>
      </section>

      {/* ═══ Estimated Total ═══ */}
      <div className="p-5 border border-[#C9A86E]/30 bg-[#C9A86E]/[0.06] mb-8">
        <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          {locale === 'ru' ? 'Ориентировочная сумма' : locale === 'kk' ? 'Болжамды сома' : 'Estimated Total'}
        </p>
        <div className="space-y-1.5 font-inter text-sm">
          <div className="flex justify-between text-white/60">
            <span>{locale === 'ru' ? 'Юрта' : 'Yurt'} &times; {quantity}</span>
            <span>${(yurtPrice * quantity).toLocaleString()}+</span>
          </div>
          {selectedAccessories.length > 0 && (
            <div className="flex justify-between text-white/60">
              <span>{locale === 'ru' ? 'Аксессуары' : 'Accessories'} ({selectedAccessories.length})</span>
              <span>${TRADITIONAL_ACCESSORIES.filter(a => selectedAccessories.includes(a.id)).reduce((s, a) => s + a.price_usd, 0).toLocaleString()}</span>
            </div>
          )}
          {(exclusiveCustom || coverCustom) && (
            <div className="flex justify-between text-white/60">
              <span>{locale === 'ru' ? 'Доп. опции' : 'Options'}</span>
              <span>{locale === 'ru' ? 'Уточняется' : 'TBD'}</span>
            </div>
          )}
          <div className="pt-2 mt-2 border-t border-white/10 flex justify-between text-white/90 font-medium">
            <span>{locale === 'ru' ? 'Итого от' : 'From'}</span>
            <span className="font-garamond text-lg text-[#C9A86E]">
              ${((yurtPrice * quantity) + TRADITIONAL_ACCESSORIES.filter(a => selectedAccessories.includes(a.id)).reduce((s, a) => s + a.price_usd, 0)).toLocaleString()}+
            </span>
          </div>
        </div>
        <p className="font-inter text-[10px] text-white/25 mt-2">
          {locale === 'ru' ? 'Окончательная цена подтверждается после консультации' : 'Final pricing confirmed after consultation'}
        </p>
      </div>

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
          <span className="font-inter text-white/50 text-sm leading-relaxed">{translations.agreement}</span>
        </label>

        {error && <p className="font-inter text-red-400/80 text-sm mb-6">{error}</p>}

        <button
          type="submit"
          disabled={loading || !agreement}
          className={`w-full md:w-auto px-12 py-4 font-inter text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-300 rounded-sm ${
            loading || !agreement
              ? 'border border-white/10 text-white/20 cursor-not-allowed'
              : 'border border-white/50 text-white bg-white/10 hover:bg-white hover:text-[#0f0d0a] cursor-pointer'
          }`}
        >
          {loading ? <Spinner /> : translations.submitInquiry}
        </button>
      </div>
    </form>
  );
}

function SectionHeader({ num }: { num: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25">{num}</span>
      <div className="h-px flex-1 bg-white/8" />
    </div>
  );
}

function ToggleCard({ active, onClick, label, sub }: { active: boolean; onClick: () => void; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 border rounded-sm text-left transition-all duration-300 ${
        active ? 'border-white/30 bg-white/[0.06]' : 'border-white/8 hover:border-white/15'
      }`}
    >
      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all duration-300 ${
        active ? 'border-white/60 bg-white/20' : 'border-white/20'
      }`}>
        {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}
      </div>
      <div>
        <span className="block font-inter text-white/90 text-sm">{label}</span>
        <span className="block font-inter text-white/30 text-xs mt-0.5">{sub}</span>
      </div>
    </button>
  );
}

function ShippingCard({ active, onClick, icon, label, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-5 border rounded-sm text-left transition-all duration-300 ${
        active ? 'border-white/30 bg-white/[0.06]' : 'border-white/8 hover:border-white/15'
      }`}
    >
      <div className="mb-3 text-white/40">{icon}</div>
      <span className="block font-inter text-white/90 text-sm font-medium">{label}</span>
      <span className="block font-inter text-white/30 text-xs mt-1">{sub}</span>
    </button>
  );
}

function FormField({ label, name, type = 'text', required, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
        {label}{required && <span className="text-red-400/60 ml-1">*</span>}
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
