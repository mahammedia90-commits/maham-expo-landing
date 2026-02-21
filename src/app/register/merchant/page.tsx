'use client';

import { MerchantRegistrationForm } from '@/features/auth/components';

export default function MerchantRegisterPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <MerchantRegistrationForm />
    </section>
  );
}
