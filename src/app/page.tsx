import type { Metadata } from 'next';
import { HomePageClient } from '@/features/home/components/HomePageClient';

export const metadata: Metadata = {
  title: 'Maham Expo | تأجير وحدات على خطاه | فعاليات الرياض الكبرى',
  description:
    'منصة مهام إكسبو لتأجير الوحدات والمساحات التجارية في فعالية على خطاه. احجز وحدتك في أكبر فعاليات الرياض الموسمية - مطاعم وتجزئة في رحلة من مكة إلى المدينة.',
  alternates: {
    canonical: 'https://mahamexpo.sa',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
