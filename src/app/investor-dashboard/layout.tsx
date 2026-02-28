'use client';

import { InvestorAuthGuard } from '@/features/auth/components';
import { InvestorDashboardLayout } from '@/features/investor-dashboard/components/InvestorDashboardLayout';

export default function InvestorDashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <InvestorAuthGuard>
      <InvestorDashboardLayout>{children}</InvestorDashboardLayout>
    </InvestorAuthGuard>
  );
}
