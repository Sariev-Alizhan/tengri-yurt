'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

const WHATSAPP_NUMBER = '77477777888';

type Props = {
  locale?: string;
  tagline: string;
  contactLabel: string;
  followLabel: string;
  address: string;
  copyright: string;
  contactWhatsApp?: string;
  trustBadges?: string;
  quizLink?: string;
};

export function FooterSection({
  locale,
  tagline,
  contactLabel,
  followLabel,
  address,
  copyright,
  contactWhatsApp,
  trustBadges,
  quizLink,
}: Props) {
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
          style={{ background: 'rgba(42, 34, 27, 0.92)' }}
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
          className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12 md:mb-16"
        >
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-16">
            <div>
              <p className="font-inter text-white/60 text-xs uppercase tracking-wider mb-3">
                {contactLabel}
              </p>
              <a href="mailto:info@tengri-camp.kz" className="block font-inter text-white/70 hover:text-white transition-colors">info@tengri-camp.kz</a>
              <a href="tel:+77477777888" className="font-inter text-white/70 hover:text-white transition-colors">
                +7 747 777 78 88
              </a>
              <p className="font-inter text-white/70">{address}</p>
              {contactWhatsApp && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 font-inter text-white/70 hover:text-white border border-white/30 hover:border-white/50 px-4 py-3 min-h-[44px] text-xs uppercase tracking-wider transition-all"
                >
                  {contactWhatsApp}
                </a>
              )}
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
        </div>
        {trustBadges && (
          <p className="font-inter text-white/40 text-xs text-center uppercase tracking-widest mb-8">
            {trustBadges}
          </p>
        )}
        {locale && quizLink && (
          <p className="font-inter text-center mb-6">
            <Link
              href="/quiz"
              className="text-beige-light hover:text-white border border-beige/40 hover:border-beige-light/50 px-4 py-3 min-h-[44px] text-xs uppercase tracking-wider transition-colors inline-flex items-center"
            >
              {quizLink}
            </Link>
          </p>
        )}
        <p className="font-inter text-white/50 text-sm border-t border-white/15 pt-8">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
