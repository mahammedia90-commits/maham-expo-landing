import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations } from '../constants/translations';
import type { Language } from '../types';

interface LanguageState {
  language: Language;
  isRtl: boolean;
  t: typeof translations.ar;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'ar',
      isRtl: true,
      t: translations.ar,

      setLanguage: (lang: Language) => {
        set({
          language: lang,
          isRtl: lang === 'ar',
          t: translations[lang],
        });
      },

      toggleLanguage: () => {
        const currentLang = get().language;
        const newLang: Language = currentLang === 'ar' ? 'en' : 'ar';
        set({
          language: newLang,
          isRtl: newLang === 'ar',
          t: translations[newLang],
        });
      },
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isRtl = state.language === 'ar';
          state.t = translations[state.language];
        }
      },
    }
  )
);
