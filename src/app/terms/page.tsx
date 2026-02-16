import type { Metadata } from 'next';
import { TermsContent } from '@/features/terms/components';

export const metadata: Metadata = {
  title: 'الشروط والأحكام | Maham Expo - مهام إكسبو',
  description:
    'الشروط والأحكام الخاصة باستخدام منصة مهام إكسبو لتأجير البوثات والمساحات في فعاليات الرياض ومعرض على خطاه.',
  alternates: {
    canonical: 'https://mahamexpo.sa/terms',
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
