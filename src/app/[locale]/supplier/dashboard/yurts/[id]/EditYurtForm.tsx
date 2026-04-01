'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PhotoUploader } from '@/components/PhotoUploader';
import { Spinner } from '@/components/Spinner';

type Yurt = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_usd: number;
  diameter_m: number | null;
  kanat: number | null;
  capacity_min: number | null;
  capacity_max: number | null;
  production_days_min: number;
  production_days_max: number;
  photos: string[] | null;
  features: string[] | null;
  is_available: boolean;
};

export function EditYurtForm({
  yurt,
  translations,
}: {
  yurt: Yurt;
  translations: Record<string, string>;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [photos, setPhotos] = useState<string[]>(yurt.photos || []);

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
      const res = await fetch(`/api/supplier/yurts/${yurt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || yurt.slug,
          description,
          price_usd: priceUsd,
          diameter_m: diameter,
          kanat,
          capacity_min: capacityMin,
          capacity_max: capacityMax,
          production_days_min: productionDaysMin,
          production_days_max: productionDaysMax,
          photos,
          features,
          is_available: isAvailable,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update yurt');
      window.location.href = `/${locale}/supplier/dashboard/yurts`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(translations.confirmDelete)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/supplier/yurts/${yurt.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete yurt');
      }
      window.location.href = `/${locale}/supplier/dashboard/yurts`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
            {translations.yurtName}
          </label>
          <input
            name="name"
            type="text"
            required
            defaultValue={yurt.name}
            className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
            {translations.yurtDescription}
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={yurt.description || ''}
            className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
            {translations.priceUsd}
          </label>
          <input
            name="price_usd"
            type="number"
            min={0}
            required
            defaultValue={yurt.price_usd}
            className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
              {translations.diameter}
            </label>
            <input
              name="diameter_m"
              type="number"
              step="0.1"
              min={0}
              defaultValue={yurt.diameter_m || ''}
              className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
              {translations.kanat}
            </label>
            <input
              name="kanat"
              type="number"
              min={0}
              defaultValue={yurt.kanat || ''}
              className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
              {translations.capacityMin}
            </label>
            <input
              name="capacity_min"
              type="number"
              min={0}
              defaultValue={yurt.capacity_min || ''}
              className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
              {translations.capacityMax}
            </label>
            <input
              name="capacity_max"
              type="number"
              min={0}
              defaultValue={yurt.capacity_max || ''}
              className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
              {translations.productionDaysMin}
            </label>
            <input
              name="production_days_min"
              type="number"
              min={0}
              defaultValue={yurt.production_days_min}
              className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
              {translations.productionDaysMax}
            </label>
            <input
              name="production_days_max"
              type="number"
              min={0}
              defaultValue={yurt.production_days_max}
              className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
            />
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
          <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
            {translations.features}
          </label>
          <textarea
            name="features"
            rows={3}
            placeholder="One per line"
            defaultValue={yurt.features?.join('\n') || ''}
            className="w-full border border-white/30 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/55"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 font-inter text-white/80">
            <input
              name="is_available"
              type="checkbox"
              defaultChecked={yurt.is_available}
              className="border-white/30"
            />
            {translations.isAvailable}
          </label>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 border border-white text-white py-3 px-8 uppercase font-inter font-medium tracking-wider hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? <Spinner /> : translations.save}
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || loading}
            className="border border-red-500/50 text-red-500 py-3 px-8 uppercase font-inter font-medium tracking-wider hover:bg-red-500 hover:text-white transition-colors duration-200 disabled:opacity-50"
          >
            {deleting ? '...' : translations.delete}
          </button>
        </div>
      </form>
    </div>
  );
}
