import { events2026 } from '@/features/merchant-dashboard/data/events2026';
import ExpoMapClient from './ExpoMapClient';

export function generateStaticParams() {
  return events2026.map((event) => ({ id: event.id }));
}

export default function ExpoMapPage() {
  return <ExpoMapClient />;
}
