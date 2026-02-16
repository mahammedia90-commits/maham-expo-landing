import type { Metadata } from 'next';
import { ZoneContent } from '@/features/ala-khutah/components/ZoneContent';

export const metadata: Metadata = {
  title: 'منطقة العرج | بوثات فعالية على خطاه - Maham Expo',
  description:
    'احجز بوثك في منطقة العرج ضمن فعالية على خطاه. مساحات تجارية للمطاعم والتجزئة متاحة للحجز عبر مهام إكسبو.',
  alternates: { canonical: 'https://mahamexpo.sa/ala-khutah/al-araj' },
};

export default function AlArajPage() {
  return <ZoneContent zoneId="al-araj" />;
}
