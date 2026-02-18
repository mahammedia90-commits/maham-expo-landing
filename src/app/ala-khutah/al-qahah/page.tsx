import type { Metadata } from 'next';
import { ZoneContent } from '@/features/ala-khutah/components/ZoneContent';

export const metadata: Metadata = {
  title: 'منطقة القاحة | بوثات فعالية على خطاه - Maham Expo',
  description:
    'احجز بوثك في منطقة القاحة ضمن فعالية على خطاه. مساحات تجارية للمطاعم والتجزئة متاحة للحجز عبر مهام إكسبو.',
  alternates: { canonical: 'https://mahamexpo.sa/ala-khutah/al-qahah' },
};

const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'منطقة القاحة - فعالية على خطاه | Al Qahah Zone',
  description:
    'فيديو تعريفي عن منطقة القاحة ضمن فعالية على خطاه - مساحات تجارية للمطاعم والتجزئة متاحة للحجز.',
  thumbnailUrl: 'https://mahamexpo.sa/ala-khutah.png',
  uploadDate: '2025-01-01',
  contentUrl: 'https://mahamexpo.sa/%D8%B9%D9%84%D9%89%20%D8%AE%D8%B7%D8%A7%D9%87/%D8%A7%D9%84%D9%82%D8%A7%D8%AD%D9%87/%D8%A7%D9%84%D9%82%D8%A7%D8%AD%D8%A9.mp4',
  embedUrl: 'https://mahamexpo.sa/ala-khutah/al-qahah',
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

export default function AlQahahPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <ZoneContent zoneId="al-qahah" />
    </>
  );
}
