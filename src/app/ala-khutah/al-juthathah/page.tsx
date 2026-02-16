import type { Metadata } from 'next';
import { ZoneContent } from '@/features/ala-khutah/components/ZoneContent';

export const metadata: Metadata = {
  title: 'منطقة الجثاثة | بوثات فعالية على خطاه - Maham Expo',
  description:
    'احجز بوثك في منطقة الجثاثة ضمن فعالية على خطاه. مساحات تجارية للمطاعم والتجزئة متاحة للحجز عبر مهام إكسبو.',
  alternates: { canonical: 'https://mahamexpo.sa/ala-khutah/al-juthathah' },
};

export default function AlJuthathahPage() {
  return <ZoneContent zoneId="al-juthathah" />;
}
