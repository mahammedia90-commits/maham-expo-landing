'use client';

import { HeroSectionV2, EventsGallery, ProblemSolution, DownloadSection } from '@/features/home/components';
import { AlaKhutahSection } from './AlaKhutahSection';

export function HomePageClient() {
  return (
    <>
      <HeroSectionV2 />
      <AlaKhutahSection />
      <EventsGallery />
      <ProblemSolution />
      <DownloadSection />
    </>
  );
}
