'use client';

import {
  FeaturesSection,
  HowItWorks,
  UserTypesSection,
  FAQSection,
} from '@/features/about/components';

export default function AboutPage() {
  return (
    <>
      <FeaturesSection />
      <HowItWorks />
      <UserTypesSection />
      <FAQSection />
    </>
  );
}
