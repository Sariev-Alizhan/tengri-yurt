import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';

export type YurtCardData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_usd: number;
  diameter_m: number | null;
  kanat: number | null;
  capacity_min: number | null;
  capacity_max: number | null;
  photos: string[];
};

export function YurtCard({ yurt, viewDetailsLabel, locale = 'en', peopleLabel = 'people' }: { yurt: YurtCardData; viewDetailsLabel: string; locale?: string; peopleLabel?: string }) {
  const badge = yurt.kanat != null ? `${yurt.kanat} Kanat` : yurt.name;
  const specs: string[] = [];
  if (yurt.diameter_m != null) specs.push(`Ø ${yurt.diameter_m}m`);
  if (yurt.capacity_min != null || yurt.capacity_max != null) {
    specs.push(`${yurt.capacity_min ?? '?'}-${yurt.capacity_max ?? '?'} ${peopleLabel}`);
  }
  const specStr = specs.length ? specs.join(' • ') : '';

  return (
    <Link
      href={`/${locale}/yurt/${yurt.slug}`}
      className="group block border border-white/15 overflow-hidden bg-beige hover:border-white/30 transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {yurt.photos?.[0] ? (
          <Image
            src={yurt.photos[0]}
            alt={yurt.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-white/10 flex items-center justify-center text-white/40 font-inter text-sm">
            No image
          </div>
        )}
        <span className="absolute top-4 left-4 bg-beige-deep text-white font-inter text-xs uppercase tracking-wider py-1 px-3">
          {badge}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-garamond text-white text-xl mb-2">
          {yurt.name}
        </h3>
        {specStr && (
          <p className="font-inter text-white/70 font-light text-sm mb-2">
            {specStr}
          </p>
        )}
        {yurt.description && (
          <p className="font-inter text-white/60 font-light text-sm line-clamp-2 mb-3">
            {yurt.description}
          </p>
        )}
        <p className="font-garamond text-white mb-4">
          from ${formatPrice(yurt.price_usd)}
        </p>
        <span className="inline-block border border-white/60 text-white py-2 px-4 uppercase font-inter font-medium text-sm tracking-[0.1em] group-hover:bg-white group-hover:text-black transition-colors duration-200">
          {viewDetailsLabel}
        </span>
      </div>
    </Link>
  );
}
