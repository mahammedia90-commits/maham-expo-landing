'use client';

import { HeroSectionV2, EventsGallery, ProblemSolution, DownloadSection } from '@/features/home/components';

export default function HomePage() {
  return (
    <>
      <HeroSectionV2 />
      <EventsGallery />
      <ProblemSolution />
      <DownloadSection />
    </>
  );
}
