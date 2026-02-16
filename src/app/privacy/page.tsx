import type { Metadata } from 'next';
import { PrivacyContent } from '@/features/privacy/components';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | Maham Expo - مهام إكسبو',
  description:
    'سياسة الخصوصية لمنصة مهام إكسبو لتأجير البوثات والمساحات في فعاليات الرياض. تعرف على كيفية حماية بياناتك الشخصية.',
  alternates: {
    canonical: 'https://mahamexpo.sa/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
