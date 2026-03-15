'use client';

interface SponsorAuthGuardProps {
  children: React.ReactNode;
}

export function SponsorAuthGuard({ children }: SponsorAuthGuardProps) {
  return <>{children}</>;
}
