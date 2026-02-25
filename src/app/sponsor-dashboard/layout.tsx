'use client';

import { SponsorAuthGuard } from '@/features/auth/components';
import { SponsorDashboardLayout } from '@/features/sponsor-dashboard/components/SponsorDashboardLayout';

export default function SponsorDashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SponsorAuthGuard>
      <SponsorDashboardLayout>{children}</SponsorDashboardLayout>
    </SponsorAuthGuard>
  );
}
