import type { Metadata } from 'next';
import { ZoneContent } from '@/features/ala-khutah/components/ZoneContent';

export const metadata: Metadata = {
  title: 'منطقة أم معبد | بوثات فعالية على خطاه - Maham Expo',
  description:
    'احجز بوثك في منطقة أم معبد ضمن فعالية على خطاه. مساحات تجارية للمطاعم والتجزئة متاحة للحجز عبر مهام إكسبو.',
  alternates: { canonical: 'https://mahamexpo.sa/ala-khutah/um-maabad' },
};

export default function UmMaabadPage() {
  return <ZoneContent zoneId="um-maabad" />;
}
