import type { Metadata } from 'next';
import { ZoneContent } from '@/features/ala-khutah/components/ZoneContent';

export const metadata: Metadata = {
  title: 'منطقة وادي الريم | بوثات فعالية على خطاه - Maham Expo',
  description:
    'احجز بوثك في منطقة وادي الريم ضمن فعالية على خطاه. مساحات تجارية للمطاعم والتجزئة متاحة للحجز عبر مهام إكسبو.',
  alternates: { canonical: 'https://mahamexpo.sa/ala-khutah/al-reem' },
};

export default function AlReemPage() {
  return <ZoneContent zoneId="al-reem" />;
}
