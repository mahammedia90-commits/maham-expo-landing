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

export default function AlaKhutahPage() {
  return <AlaKhutahPageClient />;
}
