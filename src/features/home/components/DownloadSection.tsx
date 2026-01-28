'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { AppleIcon, GooglePlayIcon } from '@/shared/components/Icons';

export function DownloadSection() {
  const { t, isRtl } = useLanguageStore();

  return (
    <section id="download" className="py-12 md:py-20 gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 px-4">
          {t.home.downloadTitle}
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-10 max-w-2xl mx-auto px-4">
          {t.home.downloadDesc}
        </p>

        <div className="flex flex-col xs:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
          {/* App Store Button */}
          <a
            href="#"
            className="bg-black text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-900 transition-colors"
          >
            <AppleIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <div className="text-[10px] sm:text-xs opacity-80">{t.home.downloadFrom}</div>
              <div className="text-sm sm:text-base md:text-lg font-semibold">App Store</div>
            </div>
          </a>

          {/* Google Play Button */}
          <a
            href="#"
            className="bg-black text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-900 transition-colors"
          >
            <GooglePlayIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <div className="text-[10px] sm:text-xs opacity-80">{t.home.getItOn}</div>
              <div className="text-sm sm:text-base md:text-lg font-semibold">Google Play</div>
            </div>
          </a>
        </div>

        {/* Registration CTA */}
        <div className="glass rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 md:mb-4">
            {t.home.areYouInvestor}
          </h3>
          <p className="text-gray-200 mb-4 md:mb-6 text-sm md:text-base">{t.home.investorCTA}</p>
          <Link
            href="#"
            className="inline-block btn-primary text-white px-5 sm:px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base"
          >
            {t.home.registerAsInvestor}
          </Link>
        </div>
      </div>
    </section>
  );
}
