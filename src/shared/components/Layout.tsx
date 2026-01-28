'use client';

import { ReactNode, useEffect } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isRtl, language } = useLanguageStore();

  useEffect(() => {
    // Update document direction and language
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRtl, language]);

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? '' : 'ltr'}`}>
      <Header />
      <main className="flex-1 pt-14 sm:pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
