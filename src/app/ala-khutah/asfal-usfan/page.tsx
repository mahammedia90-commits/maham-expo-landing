import type { Metadata } from 'next';
import { ZoneContent } from '@/features/ala-khutah/components/ZoneContent';

export const metadata: Metadata = {
  title: 'منطقة أسفل عسفان | بوثات فعالية على خطاه - Maham Expo',
  description:
    'احجز بوثك في منطقة أسفل عسفان ضمن فعالية على خطاه. مساحات تجارية للمطاعم والتجزئة متاحة للحجز عبر مهام إكسبو.',
  alternates: { canonical: 'https://mahamexpo.sa/ala-khutah/asfal-usfan' },
};

export default function AsfalUsfanPage() {
  return <ZoneContent zoneId="asfal-usfan" />;
}
