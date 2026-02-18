import type { Metadata } from 'next';
import { AlaKhutahPageClient } from '@/features/ala-khutah/components/AlaKhutahPageClient';

export const metadata: Metadata = {
  title: 'فعالية على خطاه | تأجير بوثات ومساحات تجارية - Maham Expo',
  description:
    'استكشف مناطق فعالية على خطاه واحجز بوثك في رحلة من مكة إلى المدينة. بوثات مطاعم وتجزئة في 8 مناطق استراتيجية - الجحفة، الريم، العرج، القاهة، غار ثور، الجثاثة، أسفل عسفان، أم معبد.',
  alternates: {
    canonical: 'https://mahamexpo.sa/ala-khutah',
  },
  openGraph: {
    title: 'فعالية على خطاه | تأجير بوثات ومساحات تجارية',
    description:
      'احجز بوثك في فعالية على خطاه - 8 مناطق استراتيجية مع مساحات للمطاعم والتجزئة في أكبر فعاليات الرياض.',
    url: 'https://mahamexpo.sa/ala-khutah',
  },
};

const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'فعالية على خطاه - نظرة شاملة | Ala Khutah Event Overview',
  description:
    'فيديو تعريفي شامل عن فعالية على خطاه - رحلة من مكة إلى المدينة مع فرص تأجير بوثات ومساحات تجارية في 8 مناطق استراتيجية.',
  thumbnailUrl: 'https://mahamexpo.sa/ala-khutah.png',
  uploadDate: '2025-01-01',
  contentUrl: 'https://mahamexpo.sa/%D8%B9%D9%84%D9%89%20%D8%AE%D8%B7%D8%A7%D9%87/%D8%B4%D8%A7%D9%85%D9%84.mp4',
  embedUrl: 'https://mahamexpo.sa/ala-khutah',
  inLanguage: 'ar',
  duration: 'PT1M',
  publisher: {
    '@type': 'Organization',
    name: 'Maham Expo',
    logo: {
      '@type': 'ImageObject',
      url: 'https://mahamexpo.sa/logo.png',
    },
  },
};

export default function AlaKhutahPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <AlaKhutahPageClient />
    </>
  );
}
