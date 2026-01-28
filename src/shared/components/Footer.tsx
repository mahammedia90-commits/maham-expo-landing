'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '../store/useLanguageStore';
import { TwitterIcon, InstagramIcon, LinkedInIcon } from './Icons';

export function Footer() {
  const { t } = useLanguageStore();

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contacts },
    { href: '/terms', label: t.nav.terms },
    { href: '/privacy', label: t.nav.privacy },
  ];

  const socialLinks = [
    { href: '#', icon: TwitterIcon, label: 'Twitter' },
    { href: '#', icon: InstagramIcon, label: 'Instagram' },
    { href: '#', icon: LinkedInIcon, label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-2">
            <div className="mb-3 md:mb-4 bg-white p-2 md:p-3 rounded-lg md:rounded-xl inline-block">
              <Image
                src="/logo.png"
                alt="Maham Expo"
                width={200}
                height={80}
                className="h-10 md:h-14 w-auto object-contain"
                unoptimized
              />
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md text-xs sm:text-sm md:text-base">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-1 md:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm md:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-4">
              {t.footer.contactUs}
            </h4>
            <ul className="space-y-1 md:space-y-2 text-gray-400 text-xs sm:text-sm md:text-base">
              <li>info@maham.com.sa</li>
              <li>+966 XX XXX XXXX</li>
              <li>{t.footer.saudiArabia}</li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-2 md:gap-4 mt-3 md:mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-md md:rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
          <p className="text-gray-400 text-xs md:text-sm">
            {t.footer.allRightsReserved}
          </p>
          <p className="text-gray-400 text-xs md:text-sm">
            <a href="https://maham.com.sa" className="hover:text-white transition-colors">
              maham.com.sa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
