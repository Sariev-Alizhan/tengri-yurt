import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { ScrollRevealRoot } from '@/components/ScrollRevealRoot';
import { HeroSection } from '@/components/HeroSection';
import { BookNowCTA } from '@/components/BookNowCTA';
import { ProcessSection } from '@/components/ProcessSection';
import { AboutSection } from '@/components/AboutSection';
import { WhySection } from '@/components/WhySection';
import { MarqueeSection } from '@/components/MarqueeSection';
import { GallerySection } from '@/components/GallerySection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FooterSection } from '@/components/FooterSection';

export default async function HomePage() {
  const locale = await getLocale();
  const tHero = await getTranslations('hero');
  const tCta = await getTranslations('cta');
  const tAbout = await getTranslations('about');
  const tGallery = await getTranslations('gallery');
  const tFooter = await getTranslations('footer');
  const tCatalog = await getTranslations('catalog');

  const supabase = await createClient();
  const { data: featured } = await supabase
    .from('yurts')
    .select('id, name, slug, price_usd, photos')
    .eq('is_available', true)
    .limit(3)
    .order('created_at', { ascending: false });

  return (
    <ScrollRevealRoot>
      <HeroSection
        heroTitle="Tengri Yurt"
        since={tHero('since')}
        heroSubtitle={tHero('tagline')}
        statement={tHero('quote')}
      />

      <div className="reveal">
        <BookNowCTA
          label={tCta('label')}
          title={tCta('title')}
          subtitle={tCta('subtitle')}
        />
      </div>

      <div className="reveal">
        <AboutSection
          aboutTitle={tAbout('title')}
          aboutText={tAbout('text')}
          discoverBtnLabel={tAbout('button')}
        />
      </div>

      <div className="reveal">
        <WhySection />
      </div>

      <div className="reveal">
        <MarqueeSection />
      </div>

      <div className="reveal">
        <ProcessSection />
      </div>

      <div className="reveal">
        <GallerySection
          label={tGallery('label')}
          title={tGallery('title')}
          subtitle={tGallery('subtitle')}
        />
      </div>

      <div className="reveal">
        <BookNowCTA
          label={tCta('label')}
          title={tCta('title')}
          subtitle={tCta('subtitle')}
        />
      </div>

      <div className="reveal">
        <TestimonialsSection />
      </div>

      {featured && featured.length > 0 && (
        <div className="reveal">
          <section
            className="py-16 md:py-20 lg:py-24 px-6 md:px-10 border-t border-white/10"
            style={{ background: '#a89578' }}
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="font-garamond text-4xl mb-8 md:mb-12 text-white">
                {tCatalog('featuredTitle')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featured.map((yurt) => (
                  <Link
                    key={yurt.id}
                    href={`/${locale}/yurt/${yurt.slug}`}
                    className="group block border border-white/15 overflow-hidden hover:border-white/30 transition-all duration-200 hover:scale-[1.02]"
                  >
                    {yurt.photos?.[0] ? (
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <Image
                          src={yurt.photos[0]}
                          alt={yurt.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-white/10 flex items-center justify-center text-white/40">
                        No image
                      </div>
                    )}
                    <div className="p-6" style={{ background: '#a89578' }}>
                      <h3 className="font-garamond text-white text-xl mb-1">{yurt.name}</h3>
                      <p className="font-inter text-white/70">from ${yurt.price_usd}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href={`/${locale}/catalog`} className="btn-book inline-block py-3 px-6">
                  {tCatalog('title')}
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}

      <div className="reveal">
        <BookNowCTA
          label={tCta('label')}
          title={tCta('title')}
          subtitle={tCta('subtitle')}
        />
      </div>

      <FooterSection
        tagline={tFooter('tagline')}
        contactLabel={tFooter('contact')}
        followLabel={tFooter('follow')}
        copyright={tFooter('copyright')}
      />
    </ScrollRevealRoot>
  );
}
