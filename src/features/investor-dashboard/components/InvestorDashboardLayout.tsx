'use client';

import { useState } from 'react';
import { InvestorDashboardSidebar } from './InvestorDashboardSidebar';
import { InvestorDashboardHeader } from './InvestorDashboardHeader';

interface InvestorDashboardLayoutProps {
  children: React.ReactNode;
}

export function InvestorDashboardLayout({ children }: InvestorDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <InvestorDashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <InvestorDashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
