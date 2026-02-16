import type { Metadata } from 'next';
import { AboutPageClient } from '@/features/about/components/AboutPageClient';

export const metadata: Metadata = {
  title: 'عن مهام إكسبو | منصة تأجير البوثات والمساحات في فعاليات الرياض',
  description:
    'تعرف على مهام إكسبو - المنصة المتكاملة لتأجير البوثات والمساحات التجارية في فعالية على خطاه وفعاليات الرياض الكبرى. ميزات متقدمة للمستثمرين والتجار.',
  alternates: {
    canonical: 'https://mahamexpo.sa/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
