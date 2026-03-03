import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./messages/en.json";
import ar from "./messages/ar.json";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from "./config";

const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return SUPPORTED_LOCALES.includes(saved) ? saved : DEFAULT_LOCALE;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  fallbackLng: "en",
  lng: getInitialLanguage(),
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
