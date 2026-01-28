'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';

export function PrivacyContent() {
  const { t, isRtl } = useLanguageStore();

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            {t.privacy.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">{t.privacy.subtitle}</p>
        </div>

        <div
          className={`bg-white rounded-xl md:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-6 md:space-y-8 ${
            isRtl ? '' : 'ltr'
          }`}
        >
          {/* Data We Collect */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3">
              {t.privacy.dataWeCollect}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-3">{t.privacy.dataWeCollectDesc}</p>
            <ul
              className={`text-gray-600 text-sm md:text-base list-disc ${
                isRtl ? 'pr-6' : 'pl-6'
              } space-y-1`}
            >
              {t.privacy.dataWeCollectItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* How We Use Data */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3">
              {t.privacy.howWeUseData}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-3">{t.privacy.howWeUseDataDesc}</p>
            <ul
              className={`text-gray-600 text-sm md:text-base list-disc ${
                isRtl ? 'pr-6' : 'pl-6'
              } space-y-1`}
            >
              {t.privacy.howWeUseDataItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Data Sharing */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3">
              {t.privacy.dataSharing}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-3">{t.privacy.dataSharingDesc}</p>
            <ul
              className={`text-gray-600 text-sm md:text-base list-disc ${
                isRtl ? 'pr-6' : 'pl-6'
              } space-y-1`}
            >
              {t.privacy.dataSharingItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-gray-600 text-sm md:text-base mt-3 font-medium">
              {t.privacy.noSellData}
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3">
              {t.privacy.yourRights}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-3">{t.privacy.yourRightsDesc}</p>
            <ul
              className={`text-gray-600 text-sm md:text-base list-disc ${
                isRtl ? 'pr-6' : 'pl-6'
              } space-y-1`}
            >
              {t.privacy.yourRightsItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3">
              {t.privacy.dataSecurity}
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {t.privacy.dataSecurityDesc}
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3">{t.privacy.cookies}</h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {t.privacy.cookiesDesc}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3">
              {t.privacy.contactUs}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-4">{t.privacy.contactUsDesc}</p>
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
              <p className="text-gray-700 text-sm md:text-base">
                <strong>{t.contact.emailLabel}</strong> privacy@maham.com.sa
              </p>
              <p className="text-gray-700 text-sm md:text-base">
                <strong>{t.contact.phoneLabel}</strong> +966 XX XXX XXXX
              </p>
              <p className="text-gray-700 text-sm md:text-base">
                <strong>{t.contact.addressLabel}</strong> {t.footer.saudiArabia}
              </p>
            </div>
          </div>

          <div className="text-center pt-6 border-t">
            <p className="text-gray-500 text-sm">{t.privacy.lastUpdated}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
