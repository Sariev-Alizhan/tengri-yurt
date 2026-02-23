'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export function AddYurtForm({
  supplierId,
  translations,
}: {
  supplierId: string;
  translations: Record<string, string>;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || null;
    const priceUsd = Number(formData.get('price_usd'));
    const diameter = formData.get('diameter_m') ? Number(formData.get('diameter_m')) : null;
    const kanat = formData.get('kanat') ? Number(formData.get('kanat')) : null;
    const capacityMin = formData.get('capacity_min') ? Number(formData.get('capacity_min')) : null;
    const capacityMax = formData.get('capacity_max') ? Number(formData.get('capacity_max')) : null;
    const productionDaysMin = Number(formData.get('production_days_min')) || 30;
    const productionDaysMax = Number(formData.get('production_days_max')) || 60;
    const featuresText = (formData.get('features') as string) || '';
    const features = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const isAvailable = (formData.get('is_available') as string) === 'on';
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    try {
      const res = await fetch('/api/supplier/yurts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          name,
          slug: slug || `yurt-${Date.now()}`,
          description,
          price_usd: priceUsd,
          diameter_m: diameter,
          kanat,
          capacity_min: capacityMin,
          capacity_max: capacityMax,
          production_days_min: productionDaysMin,
          production_days_max: productionDaysMax,
          photos: [],
          features,
          is_available: isAvailable,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create yurt');
      window.location.href = `/${locale}/supplier/dashboard/yurts`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.yurtName}</label>
        <input name="name" type="text" required className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.yurtDescription}</label>
        <textarea name="description" rows={4} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.priceUsd}</label>
        <input name="price_usd" type="number" min={0} required className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.diameter}</label>
          <input name="diameter_m" type="number" step="0.1" min={0} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.kanat}</label>
          <input name="kanat" type="number" min={0} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.capacityMin}</label>
          <input name="capacity_min" type="number" min={0} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.capacityMax}</label>
          <input name="capacity_max" type="number" min={0} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.productionDaysMin}</label>
          <input name="production_days_min" type="number" min={0} defaultValue={30} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.productionDaysMax}</label>
          <input name="production_days_max" type="number" min={0} defaultValue={60} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.features}</label>
        <textarea name="features" rows={3} placeholder="One per line" className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
      </div>
      <div>
        <label className="flex items-center gap-2 font-inter text-white/80">
          <input name="is_available" type="checkbox" defaultChecked className="border-white/30" />
          {translations.isAvailable}
        </label>
      </div>
      {error && <p className="text-red-700 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="border border-white text-white py-3 px-8 uppercase font-inter font-medium tracking-wider hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
      >
        {loading ? '...' : translations.save}
      </button>
    </form>
  );
}
