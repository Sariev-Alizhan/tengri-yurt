'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

const GALLERY_IMAGES = [
  '/images/picture/skelet_yurt.jpeg',
  '/images/picture/yurt_blackrock.jpeg',
  '/images/picture/in_the_yurt.jpeg',
  '/images/picture/tengri-camp-bg-burn-yurt.jpg',
  '/images/picture/yurt_maiyami.jpeg',
  '/images/picture/yurt_kazakhstan.jpeg',
  '/images/picture/yurt_lovebern.jpeg',
  '/images/picture/yurt_dubai.jpeg',
  '/images/picture/yurt_shanyraq.jpeg',
];

function GalleryImage({ src, index }: { src: string; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        scrollSnapAlign: 'center',
        width: 'clamp(240px, 80vw, 380px)',
        height: 'clamp(200px, 55vw, 420px)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image
        src={src}
        alt={`Gallery ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 75vw, (max-width: 1024px) 50vw, 380px"
        style={{
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hover ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: hover ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)',
          transition: 'background 0.4s ease',
        }}
        aria-hidden
      />
    </div>
  );
}

type Props = {
  label: string;
  title: string;
  subtitle: string;
};

export function GallerySection({ label, title, subtitle }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const { ref: sectionRef, visible } = useScrollReveal();
  const [arrowsVisible, setArrowsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) scroll('right');
    if (diff < -50) scroll('left');
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24"
      style={{ background: '#a89578' }}
    >
      <div className="max-w-6xl mx-auto mb-8 md:mb-10 px-6 md:px-10">
        <p
          className="font-inter text-xs uppercase mb-2"
          style={{
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          {label}
        </p>
        <h2
          className="font-garamond mb-2"
          style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            color: 'rgba(255,255,255,0.95)',
            ...revealStyle(visible),
          }}
        >
          {title}
        </h2>
        <p
          className="font-inter font-light"
          style={{
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: 'rgba(255,255,255,0.55)',
            ...revealStyle(visible, 0.1),
          }}
        >
          {subtitle}
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setArrowsVisible(true)}
        onMouseLeave={() => setArrowsVisible(false)}
      >
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Previous"
          className="hidden md:flex absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center transition-opacity duration-300"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.95)',
            opacity: arrowsVisible && canScrollLeft ? 0.9 : 0,
            pointerEvents: canScrollLeft ? 'auto' : 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Next"
          className="hidden md:flex absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center transition-opacity duration-300"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.95)',
            opacity: arrowsVisible && canScrollRight ? 0.9 : 0,
            pointerEvents: canScrollRight ? 'auto' : 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
          }}
        >
          →
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide flex gap-4 pb-4 scroll-smooth"
          style={{
            padding: '0 clamp(24px, 5vw, 48px)',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {GALLERY_IMAGES.map((src, i) => (
            <GalleryImage key={src} src={src} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
