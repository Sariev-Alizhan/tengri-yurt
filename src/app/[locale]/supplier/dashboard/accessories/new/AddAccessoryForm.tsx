'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PhotoUploader } from '@/components/PhotoUploader';

export function AddAccessoryForm({
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
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || null;
    const category = formData.get('category') as string;
    const priceUsd = formData.get('price_usd') ? Number(formData.get('price_usd')) : null;
    const priceKzt = formData.get('price_kzt') ? Number(formData.get('price_kzt')) : null;
    const stockQuantity = Number(formData.get('stock_quantity')) || 0;
    const productionDaysMin = Number(formData.get('production_days_min')) || 0;
    const productionDaysMax = Number(formData.get('production_days_max')) || 0;
    const isAvailable = (formData.get('is_available') as string) === 'on';
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    try {
      const res = await fetch('/api/supplier/accessories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          name,
          slug: slug || `accessory-${Date.now()}`,
          description,
          category,
          price_usd: priceUsd,
          price_kzt: priceKzt,
          stock_quantity: stockQuantity,
          production_days_min: productionDaysMin,
          production_days_max: productionDaysMax,
          photos,
          is_available: isAvailable,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create accessory');
      window.location.href = `/${locale}/supplier/dashboard/accessories`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.accessoryName}</label>
        <input name="name" type="text" required className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.accessoryDescription}</label>
        <textarea name="description" rows={4} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.category}</label>
        <select name="category" required className="w-full border border-white/30 bg-[#0f0d0a] text-white px-3 py-2 font-inter">
          <option value="carpet">{translations.categoryCarpet}</option>
          <option value="furniture">{translations.categoryFurniture}</option>
          <option value="cover">{translations.categoryCover}</option>
          <option value="other">{translations.categoryOther}</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.priceUsd}</label>
          <input name="price_usd" type="number" min={0} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.priceKzt}</label>
          <input name="price_kzt" type="number" min={0} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.stockQuantity}</label>
        <input name="stock_quantity" type="number" min={0} defaultValue={0} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.productionDaysMin}</label>
          <input name="production_days_min" type="number" min={0} defaultValue={0} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1 font-inter uppercase tracking-wider">{translations.productionDaysMax}</label>
          <input name="production_days_max" type="number" min={0} defaultValue={0} className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40" />
        </div>
      </div>
      <div>
        <PhotoUploader
          currentPhotos={photos}
          onPhotosChange={setPhotos}
          maxPhotos={10}
          label={translations.photos}
        />
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
