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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12 md:mb-16">

          {/* Explore */}
          <div>
            <p className="font-inter text-white/40 text-xs uppercase tracking-wider mb-4">Explore</p>
            <div className="flex flex-col gap-3">
              {[
                { href: '/catalog', label: 'Yurt Catalog' },
                { href: '/hammam', label: 'Yurt Hammam' },
                { href: '/quiz', label: 'Knowledge Quiz' },
                { href: '/news', label: 'Press & Stories' },
              ].map(l => (
                <Link key={l.href} href={l.href as any}
                  className="font-inter text-white/60 hover:text-white transition-colors text-sm">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="font-inter text-white/40 text-xs uppercase tracking-wider mb-4">Company</p>
            <div className="flex flex-col gap-3">
              {[
                { href: '/about', label: 'Our Story' },
                { href: '/contact', label: 'Contact' },
                { href: '/supplier/dashboard', label: 'Supplier Portal' },
              ].map(l => (
                <Link key={l.href} href={l.href as any}
                  className="font-inter text-white/60 hover:text-white transition-colors text-sm">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-inter text-white/40 text-xs uppercase tracking-wider mb-4">
              {contactLabel}
            </p>
            <div className="flex flex-col gap-2">
              <a href="mailto:info@tengri-camp.kz"
                className="font-inter text-white/60 hover:text-white transition-colors text-sm">
                info@tengri-camp.kz
              </a>
              <a href="tel:+77477777888"
                className="font-inter text-white/60 hover:text-white transition-colors text-sm">
                +7 747 777 78 88
              </a>
              <p className="font-inter text-white/40 text-sm">{address}</p>
              {contactWhatsApp && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-1 font-inter text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-3 py-2 min-h-[40px] text-xs uppercase tracking-wider transition-all w-fit"
                >
                  {contactWhatsApp}
                </a>
              )}
            </div>
          </div>

          {/* Follow */}
          <div>
            <p className="font-inter text-white/40 text-xs uppercase tracking-wider mb-4">
              {followLabel}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/tengri_camp/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-white/60 hover:text-white transition-colors text-sm"
              >
                @tengri_camp
              </a>
              <div className="border-t border-white/10 pt-3 mt-1">
                <p className="font-inter text-white/40 text-xs uppercase tracking-wider mb-3">Team</p>
                <div className="flex flex-col gap-2.5">
                  <div>
                    <p className="font-inter text-white/35 text-[10px] uppercase tracking-wider mb-0.5">Founder</p>
                    <a
                      href="https://www.instagram.com/askhat_murat_page/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-inter text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {locale === 'ru' || locale === 'kk' ? 'Асхат Мурат' : 'Askhat Murat'}
                    </a>
                  </div>
                  <div>
                    <p className="font-inter text-white/35 text-[10px] uppercase tracking-wider mb-0.5">Co-Founder & CTO</p>
                    <a
                      href="https://www.instagram.com/zhanmate_zhan/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-inter text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {locale === 'ru' || locale === 'kk' ? 'Сариев Алижан Сабитулы' : 'Sariyev Alizhan Sabituly'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        {trustBadges && (
          <p className="font-inter text-white/35 text-xs text-center uppercase tracking-widest mb-8">
            {trustBadges}
          </p>
        )}
        <div className="border-t border-white/15 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="font-inter text-white/50 text-sm">
            {copyright}
          </p>
          <span
            title="Tengri Yurt platform version"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'rgba(201,168,110,0.4)',
              border: '1px solid rgba(201,168,110,0.15)',
              padding: '3px 8px',
              borderRadius: '3px',
              userSelect: 'none',
            }}
          >
            v2.8
          </span>
        </div>
      </div>
    </footer>
  );
}
