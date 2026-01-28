'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { CheckIcon, WarningIcon, CheckCircleIcon } from '@/shared/components/Icons';

export function ProblemSolution() {
  const { t, isRtl } = useLanguageStore();

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            {t.home.problemSolutionTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t.home.problemSolutionDesc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* Problem */}
          <div
            className={`bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg ${
              isRtl ? 'border-r-4' : 'border-l-4'
            } border-red-500`}
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-red-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <WarningIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                {t.home.problem}
              </h3>
            </div>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {t.home.problemItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm sm:text-base text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div
            className={`bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg ${
              isRtl ? 'border-r-4' : 'border-l-4'
            } border-green-500`}
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                {t.home.solution}
              </h3>
            </div>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {t.home.solutionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0">
                    <CheckIcon />
                  </span>
                  <span className="text-sm sm:text-base text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
