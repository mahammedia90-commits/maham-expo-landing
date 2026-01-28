'use client';

import { ContactForm } from '@/features/contact/components';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

export default function ContactPage() {
  const { t } = useLanguageStore();

  return (
    <>
      {/* Page Header */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.contact.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </>
  );
}
