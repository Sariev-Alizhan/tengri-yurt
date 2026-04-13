export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tengri Yurt',
    url: 'https://tengri-yurt-eta.vercel.app',
    logo: 'https://tengri-yurt-eta.vercel.app/images/logo_white.png',
    foundingDate: '2010',
    description: 'Handcrafted traditional Kazakh yurts delivered worldwide. 200+ yurts built across 10+ countries by 40+ master artisans.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Almaty',
      addressCountry: 'KZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-747-777-78-88',
      contactType: 'sales',
      availableLanguage: ['English', 'Russian', 'Kazakh', 'Chinese', 'Arabic'],
    },
    sameAs: [
      'https://instagram.com/tengri_camp',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  priceLow,
  priceHigh,
  slug,
}: {
  name: string;
  description: string;
  priceLow: number;
  priceHigh: number;
  slug: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: 'Tengri Yurt',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Tengri Yurt',
      address: { '@type': 'PostalAddress', addressLocality: 'Almaty', addressCountry: 'KZ' },
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: priceLow,
      highPrice: priceHigh,
      availability: 'https://schema.org/MadeToOrder',
    },
    url: `https://tengri-yurt-eta.vercel.app/en/yurt/${slug}`,
    image: `https://tengri-yurt-eta.vercel.app/images/yurts/${slug}/1.jpeg`,
    category: 'Traditional Kazakh Yurts',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQSchema({ items }: { items: { question: string; answer: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
