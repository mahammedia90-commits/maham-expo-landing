export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Maham Expo',
    alternateName: 'مهام إكسبو',
    url: 'https://mahamexpo.sa',
    logo: 'https://mahamexpo.sa/logo.png',
    description:
      'منصة متكاملة لتأجير البوثات والمساحات التجارية في فعاليات الرياض الكبرى وفعالية على خطاه',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'الرياض',
      addressRegion: 'منطقة الرياض',
      addressCountry: 'SA',
      streetAddress: 'حي العقيق',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966535555900',
      contactType: 'customer service',
      email: 'info@mahamexpo.sa',
      availableLanguage: ['Arabic', 'English'],
    },
    sameAs: [
      'https://twitter.com/mahamexpo',
      'https://instagram.com/mahamexpo',
      'https://linkedin.com/company/mahamexpo',
    ],
  };

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'فعالية على خطاه - Ala Khutah',
    description:
      'فعالية على خطاه - رحلة من مكة إلى المدينة مع فرص استثمارية لتأجير البوثات والمساحات التجارية في 8 مناطق استراتيجية.',
    url: 'https://mahamexpo.sa/ala-khutah',
    location: {
      '@type': 'Place',
      name: 'الرياض',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'الرياض',
        addressCountry: 'SA',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Maham Expo',
      url: 'https://mahamexpo.sa',
    },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'SAR',
      offerCount: 8,
      description: 'بوثات ومساحات تجارية للمطاعم والتجزئة',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Maham Expo',
    alternateName: 'مهام إكسبو',
    url: 'https://mahamexpo.sa',
    inLanguage: ['ar', 'en'],
    publisher: {
      '@type': 'Organization',
      name: 'Maham Expo',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
