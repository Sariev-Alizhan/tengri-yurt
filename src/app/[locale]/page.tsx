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

      {featured && featured.length > 0 && (
        <div className="reveal">
          <section style={{ background: '#1a1510', padding: 'clamp(64px, 10vw, 112px) clamp(24px, 6vw, 80px)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,110,0.7)', marginBottom: '12px' }}>
                {tCatalog('subtitle')}
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(32px, 5vw, 56px)', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(32px, 5vw, 56px)', color: 'rgba(255,255,255,0.92)', fontWeight: 400, lineHeight: 1.1, margin: 0 }}>
                  {tCatalog('title')}
                </h2>
                <Link href="/catalog" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,110,0.8)', textDecoration: 'none', borderBottom: '1px solid rgba(201,168,110,0.3)', paddingBottom: '2px', whiteSpace: 'nowrap' }}>
                  View all →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '24px' }}>
                {featured.map((yurt) => {
                  const photo = Array.isArray(yurt.photos) ? yurt.photos[0] : yurt.photos
                  return (
                    <Link key={yurt.id} href={`/yurt/${yurt.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <article style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                        <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.04)' }}>
                          {photo && (
                            <Image src={photo} alt={yurt.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                          )}
                        </div>
                        <div style={{ padding: '20px 24px 24px' }}>
                          <h3 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(20px, 2.5vw, 26px)', color: 'rgba(255,255,255,0.9)', fontWeight: 400, margin: '0 0 10px', lineHeight: 1.2 }}>
                            {yurt.name}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            {yurt.price_usd && (
                              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(201,168,110,0.85)', margin: 0, fontWeight: 300 }}>
                                From ${yurt.price_usd.toLocaleString()}
                              </p>
                            )}
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '1px' }}>
                              {tCatalog('viewDetails')} →
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      )}

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
