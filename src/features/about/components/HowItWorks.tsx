'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { UserIcon, BuildingIcon, ArrowRightIcon } from '@/shared/components/Icons';

export function HowItWorks() {
  const { t, isRtl } = useLanguageStore();

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            {t.about.howItWorksTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t.about.howItWorksDesc}
          </p>
        </div>

        {/* For Dealers */}
        <div className="mb-10 md:mb-16">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e5f74] text-center mb-6 md:mb-10 flex items-center justify-center gap-2 md:gap-3">
            <span className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </span>
            {t.about.forDealers}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {t.about.dealerSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md text-center h-full">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 gradient-orange rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-xl font-bold mx-auto mb-2 sm:mb-3 md:mb-4">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1 md:mb-2 text-xs sm:text-sm md:text-base">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm">
                    {item.description}
                  </p>
                </div>
                {index < t.about.dealerSteps.length - 1 && (
                  <div
                    className={`hidden lg:block absolute top-1/2 transform -translate-y-1/2 ${
                      isRtl ? '-left-3' : '-right-3'
                    }`}
                  >
                    <ArrowRightIcon
                      className={`w-6 h-6 text-orange-300 ${isRtl ? 'rotate-180' : ''}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* For Investors */}
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e5f74] text-center mb-6 md:mb-10 flex items-center justify-center gap-2 md:gap-3">
            <span className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#1e5f74] rounded-full flex items-center justify-center text-white">
              <BuildingIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </span>
            {t.about.forInvestors}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {t.about.investorSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md text-center h-full">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 gradient-primary rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-xl font-bold mx-auto mb-2 sm:mb-3 md:mb-4">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1 md:mb-2 text-xs sm:text-sm md:text-base">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm">
                    {item.description}
                  </p>
                </div>
                {index < t.about.investorSteps.length - 1 && (
                  <div
                    className={`hidden lg:block absolute top-1/2 transform -translate-y-1/2 ${
                      isRtl ? '-left-3' : '-right-3'
                    }`}
                  >
                    <ArrowRightIcon
                      className={`w-6 h-6 text-[#1e5f74]/30 ${isRtl ? 'rotate-180' : ''}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
