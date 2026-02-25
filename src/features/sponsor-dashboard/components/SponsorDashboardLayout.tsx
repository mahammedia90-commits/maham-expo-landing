'use client';

import { useState } from 'react';
import { SponsorDashboardSidebar } from './SponsorDashboardSidebar';
import { SponsorDashboardHeader } from './SponsorDashboardHeader';

interface SponsorDashboardLayoutProps {
  children: React.ReactNode;
}

export function SponsorDashboardLayout({ children }: SponsorDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SponsorDashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <SponsorDashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
