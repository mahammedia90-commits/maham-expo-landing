'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '../store/useLanguageStore';
import { GlobeIcon, MenuIcon, CloseIcon } from './Icons';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRtl, toggleLanguage } = useLanguageStore();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contacts },
    { href: '/terms', label: t.nav.terms },
    { href: '/privacy', label: t.nav.privacy },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Maham Expo"
              width={200}
              height={80}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#1e5f74] after:transform after:transition-transform after:duration-300 ${
                  isActive(link.href)
                    ? 'text-[#1e5f74] after:scale-x-100'
                    : 'text-gray-600 hover:text-[#1e5f74] after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1e5f74]/10 hover:bg-[#1e5f74]/20 text-[#1e5f74] transition-all font-semibold text-sm hover:scale-105"
              title={isRtl ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <GlobeIcon className="w-5 h-5" />
              <span>{t.nav.langToggle}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-fadeIn">
          <nav className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 transition-colors ${
                  isActive(link.href)
                    ? 'text-[#1e5f74] font-medium'
                    : 'text-gray-600 hover:text-[#1e5f74]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#download"
              className="btn-primary text-white px-6 py-2.5 rounded-full font-medium text-center mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.downloadApp}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
