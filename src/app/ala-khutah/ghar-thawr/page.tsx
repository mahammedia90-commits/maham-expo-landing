import type { Metadata } from 'next';
import { ZoneContent } from '@/features/ala-khutah/components/ZoneContent';

export const metadata: Metadata = {
  title: 'منطقة غار ثور | بوثات فعالية على خطاه - Maham Expo',
  description:
    'احجز بوثك في منطقة غار ثور ضمن فعالية على خطاه. مساحات تجارية للمطاعم والتجزئة متاحة للحجز عبر مهام إكسبو.',
  alternates: { canonical: 'https://mahamexpo.sa/ala-khutah/ghar-thawr' },
};

export default function GharThawrPage() {
  return <ZoneContent zoneId="ghar-thawr" />;
}
