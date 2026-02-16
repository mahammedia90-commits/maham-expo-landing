import type { Metadata } from 'next';
import { ZoneContent } from '@/features/ala-khutah/components/ZoneContent';

export const metadata: Metadata = {
  title: 'منطقة الجُحفة | بوثات فعالية على خطاه - Maham Expo',
  description:
    'احجز بوثك في منطقة الجُحفة ضمن فعالية على خطاه. مساحات تجارية للمطاعم والتجزئة متاحة للحجز عبر مهام إكسبو.',
  alternates: { canonical: 'https://mahamexpo.sa/ala-khutah/al-juhfah' },
};

export default function AlJuhfahPage() {
  return <ZoneContent zoneId="al-juhfah" />;
}
