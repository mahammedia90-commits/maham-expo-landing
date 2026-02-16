'use client';

import {
  FeaturesSection,
  HowItWorks,
  UserTypesSection,
  FAQSection,
} from '@/features/about/components';

export function AboutPageClient() {
  return (
    <>
      <FeaturesSection />
      <HowItWorks />
      <UserTypesSection />
      <FAQSection />
    </>
  );
}
