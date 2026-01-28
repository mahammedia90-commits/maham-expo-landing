'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';

export function TermsContent() {
  const { t } = useLanguageStore();

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            {t.terms.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">{t.terms.subtitle}</p>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-6 md:space-y-8">
          {t.terms.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3">{section.title}</h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          <div className="text-center pt-6 border-t">
            <p className="text-gray-500 text-sm">{t.terms.lastUpdated}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
