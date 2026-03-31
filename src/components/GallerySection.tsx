'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

const GALLERY_IMAGES = [
  '/images/picture/yurt_kazakhstan.jpeg',
  '/images/picture/yurt_maiyami.jpeg',
  '/images/picture/yurt_dubai.jpeg',
  '/images/picture/skelet_yurt.jpeg',
  '/images/picture/yurt_blackrock.jpeg',
  '/images/picture/in_the_yurt.jpeg',
  '/images/picture/tengri-camp-bg-burn-yurt.jpg',
  '/images/picture/yurt_lovebern.jpeg',
  '/images/picture/yurt_shanyraq.jpeg',
];

function GalleryImage({ src, index, total }: { src: string; index: number; total: number }) {
  const [hover, setHover] = useState(false);
  const snapAlign = index === 0 ? 'start' : index === total - 1 ? 'end' : 'center';
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        scrollSnapAlign: snapAlign,
        width: 'clamp(300px, 80vw, 520px)',
        height: 'clamp(220px, 50vw, 340px)',
        borderRadius: '4px',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image
        src={src}
        alt={`Gallery ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 520px"
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
  const { ref: sectionRef, visible } = useScrollReveal();
  const [arrowsVisible, setArrowsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    // Calculate active image index based on scroll position
    const children = Array.from(el.children) as HTMLElement[];
    const scrollCenter = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(scrollCenter - childCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (!children[index]) return;
    const childCenter = children[index].offsetLeft + children[index].offsetWidth / 2;
    const targetScroll = childCenter - el.clientWidth / 2;
    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24"
      style={{ background: '#a89578' }}
    >
      <div className="max-w-6xl mx-auto mb-8 md:mb-10 px-6 md:px-10 text-center">
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
          className="font-inter font-light max-w-3xl mx-auto"
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
        className="relative"
        onMouseEnter={() => setArrowsVisible(true)}
        onMouseLeave={() => setArrowsVisible(false)}
      >
        {/* Gradient fade edges — hint that there's more content */}
        <div
          className="absolute left-0 top-0 bottom-4 w-8 md:w-16 z-[5] pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #a89578, transparent)',
            opacity: canScrollLeft ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-4 w-8 md:w-16 z-[5] pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #a89578, transparent)',
            opacity: canScrollRight ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Previous"
          className="hidden md:flex absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center transition-opacity duration-300"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.95)',
            opacity: arrowsVisible && canScrollLeft ? 0.9 : 0,
            pointerEvents: canScrollLeft ? 'auto' : 'none',
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
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.95)',
            opacity: arrowsVisible && canScrollRight ? 0.9 : 0,
            pointerEvents: canScrollRight ? 'auto' : 'none',
            cursor: 'pointer',
          }}
        >
          →
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide flex gap-4 pb-4"
          style={{
            scrollSnapType: 'x proximity',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingInline: 'clamp(24px, 5vw, 48px)',
            paddingInline: 'clamp(24px, 5vw, 48px)',
          }}
        >
          {GALLERY_IMAGES.map((src, i) => (
            <GalleryImage key={src} src={src} index={i} total={GALLERY_IMAGES.length} />
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {GALLERY_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            style={{
              width: activeIndex === i ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: activeIndex === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minHeight: 'auto',
              minWidth: 'auto',
            }}
          />
        ))}
      </div>
    </section>
  );
}
