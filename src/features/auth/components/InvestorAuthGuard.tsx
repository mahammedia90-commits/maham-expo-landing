'use client';

interface InvestorAuthGuardProps {
  children: React.ReactNode;
}

export function InvestorAuthGuard({ children }: InvestorAuthGuardProps) {
  return <>{children}</>;
}
