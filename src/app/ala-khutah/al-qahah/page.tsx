import type { Metadata } from 'next';
import { ZoneContent } from '@/features/ala-khutah/components/ZoneContent';

export const metadata: Metadata = {
  title: 'منطقة القاحة | بوثات فعالية على خطاه - Maham Expo',
  description:
    'احجز بوثك في منطقة القاحة ضمن فعالية على خطاه. مساحات تجارية للمطاعم والتجزئة متاحة للحجز عبر مهام إكسبو.',
  alternates: { canonical: 'https://mahamexpo.sa/ala-khutah/al-qahah' },
};

export default function AlQahahPage() {
  return <ZoneContent zoneId="al-qahah" />;
}
