'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal, revealStyle } from '@/hooks/useScrollReveal';

const WHATSAPP_NUMBER = '77477777788';

type Props = {
  locale?: string;
  tagline: string;
  contactLabel: string;
  followLabel: string;
  address: string;
  copyright: string;
  newsletterTitle?: string;
  newsletterPlaceholder?: string;
  subscribeButton?: string;
  newsletterThanks?: string;
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
  newsletterTitle,
  newsletterPlaceholder,
  subscribeButton,
  newsletterThanks,
  contactWhatsApp,
  trustBadges,
  quizLink,
}: Props) {
  const { ref, visible } = useScrollReveal();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) setNewsletterSent(true);
  };

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
          className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12 md:mb-16"
        >
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-16">
            <div>
              <p className="font-inter text-white/60 text-xs uppercase tracking-wider mb-3">
                {contactLabel}
              </p>
              <p className="font-inter text-white/70">info@tengri-camp.kz</p>
              <a href="tel:+77477777788" className="font-inter text-white/70 hover:text-white transition-colors">
                +7 747 777 78 88
              </a>
              <p className="font-inter text-white/70">{address}</p>
              {contactWhatsApp && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-inter text-white/70 hover:text-white border border-white/30 hover:border-white/50 px-3 py-1.5 text-xs uppercase tracking-wider transition-all"
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
          {newsletterTitle && subscribeButton && (
            <div className="flex-shrink-0">
              <p className="font-inter text-white/60 text-xs uppercase tracking-wider mb-3">
                {newsletterTitle}
              </p>
              {newsletterSent ? (
                <p className="font-inter text-white/70 text-sm">{newsletterThanks ?? 'Thanks for subscribing.'}</p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-wrap gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={newsletterPlaceholder}
                    className="flex-1 min-w-[180px] bg-white/10 border border-white/20 text-white placeholder-white/40 px-3 py-2 font-inter text-sm outline-none focus:border-white/50"
                  />
                  <button
                    type="submit"
                    className="border border-white/50 text-white px-4 py-2 font-inter text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                  >
                    {subscribeButton}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
        {trustBadges && (
          <p className="font-inter text-white/40 text-xs text-center uppercase tracking-widest mb-8">
            {trustBadges}
          </p>
        )}
        {locale && quizLink && (
          <p className="font-inter text-center mb-6">
            <Link
              href={`/${locale}/quiz`}
              className="text-amber-400/90 hover:text-amber-300 border border-amber-400/40 hover:border-amber-300/50 px-4 py-2 text-xs uppercase tracking-wider transition-colors inline-block"
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
