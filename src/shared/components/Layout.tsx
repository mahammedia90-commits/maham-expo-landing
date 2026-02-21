'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '../store/useLanguageStore';
import { useThemeStore } from '../store/useThemeStore';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isRtl, language } = useLanguageStore();
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Update document direction and language
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRtl, language]);

  useEffect(() => {
    // Update theme class on html element
    if (mounted) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  // Dashboard has its own layout - render children only
  if (isDashboard) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${isRtl ? '' : 'ltr'}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden ${isRtl ? '' : 'ltr'}`}>
      <Header />
      <main className="flex-1 pt-14 sm:pt-16 md:pt-20 overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
