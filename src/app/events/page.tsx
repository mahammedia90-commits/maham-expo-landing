import type { Metadata } from 'next';
import { EventsPageClient } from '@/features/events/components/EventsPageClient';

export const metadata: Metadata = {
  title: 'جميع الفعاليات | Maham Expo',
  description: 'تصفح جميع الفعاليات والمعارض في المملكة العربية السعودية. فعاليات الرياض وجدة ومكة المكرمة - مهرجانات، معارض، مؤتمرات، رياضة، ثقافة.',
};

export default function EventsPage() {
  return <EventsPageClient />;
}
