'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { ChevronDownIcon } from '@/shared/components/Icons';

interface FAQItemProps {
  question: string;
  answer: string;
  isRtl: boolean;
}

function FAQItem({ question, answer, isRtl }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item py-3 md:py-4">
      <button
        className={`flex justify-between items-center w-full gap-3 ${
          isRtl ? 'text-right' : 'text-left'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
          {question}
        </span>
        <span
          className={`transform transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDownIcon />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 mt-2 md:mt-3' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">{answer}</p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const { t, isRtl } = useLanguageStore();

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            {t.about.faqTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">{t.about.faqDesc}</p>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          {t.about.faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} isRtl={isRtl} />
          ))}
        </div>
      </div>
    </section>
  );
}
