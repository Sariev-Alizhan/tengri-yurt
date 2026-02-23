'use client';

import Image from 'next/image';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

type Props = {
  tagline: string;
  contactLabel: string;
  followLabel: string;
  copyright: string;
};

export function FooterSection({ tagline, contactLabel, followLabel, copyright }: Props) {
  const { ref, visible } = useScrollReveal();

  return (
    <footer
      ref={ref}
      className="relative py-16 md:py-20 lg:py-24 overflow-hidden px-6 md:px-10"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'rgba(80, 60, 40, 0.88)' }}
        />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto" style={revealStyle(visible)}>
        <h2 className="font-garamond mb-2 text-white" style={{ fontSize: 'clamp(28px, 6vw, 48px)' }}>
          Tengri Yurt
        </h2>
        <p className="font-inter text-white/70 font-light mb-12 md:mb-16">
          {tagline}
        </p>
        <div className="border-t border-white/15 pt-8 mb-12 md:mb-16" />
        <div
          className="flex flex-col sm:flex-row mb-12 md:mb-16"
          style={{ gap: 'clamp(32px, 5vw, 80px)' }}
        >
          <div>
            <p className="font-inter text-white/60 text-xs uppercase tracking-wider mb-3">
              {contactLabel}
            </p>
            <p className="font-inter text-white/70">info@tengri-camp.kz</p>
            <p className="font-inter text-white/70">+7 747 777 78 88</p>
            <p className="font-inter text-white/70">Almaty, Kazakhstan</p>
          </div>
          <div>
            <p className="font-inter text-white/60 text-xs uppercase tracking-wider mb-3">
              {followLabel}
            </p>
            <a
              href="https://www.instagram.com/tengri_camp/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-white/70 hover:text-white hover:underline transition-all duration-200"
            >
              @tengri_camp
            </a>
          </div>
        </div>
        <p className="font-inter text-white/50 text-sm border-t border-white/15 pt-8">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
