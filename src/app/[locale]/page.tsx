import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
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
import HammamSection from '@/components/HammamSection';
import { FAQSection } from '@/components/FAQSection';
import { OrganizationSchema } from '@/components/StructuredData';

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
        <HammamSection />
      </div>

      <div className="reveal">
        <TestimonialsSection />
      </div>

      <div className="reveal">
        <FAQSection />
      </div>

      <div className="reveal">
        <BookNowCTA
          label={tCta('label')}
          title={tCta('title')}
          subtitle={tCta('subtitle')}
        />
      </div>

      <OrganizationSchema />

      <FooterSection
        locale={locale}
        tagline={tFooter('tagline')}
        contactLabel={tFooter('contact')}
        followLabel={tFooter('follow')}
        address={tFooter('address')}
        copyright={tFooter('copyright')}
        contactWhatsApp={tFooter('contactWhatsApp')}
        trustBadges={tFooter('trustBadges')}
        quizLink={tFooter('quizLink')}
      />
    </ScrollRevealRoot>
  );
}
