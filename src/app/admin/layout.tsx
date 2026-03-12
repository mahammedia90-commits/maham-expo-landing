'use client';

import { AdminAuthGuard } from '@/features/auth/components';
import { AdminLayout } from '@/features/admin-dashboard/components/AdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminAuthGuard>
  );
}
