import type { Metadata } from 'next';
import { ContactPageClient } from '@/features/contact/components/ContactPageClient';

export const metadata: Metadata = {
  title: 'اتصل بنا | Maham Expo - استفسارات تأجير البوثات في على خطاه',
  description:
    'تواصل مع فريق مهام إكسبو للاستفسار عن تأجير البوثات والمساحات التجارية في فعالية على خطاه وفعاليات الرياض الكبرى.',
  alternates: {
    canonical: 'https://mahamexpo.sa/contact',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
