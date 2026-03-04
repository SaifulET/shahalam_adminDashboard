export const LOCALE_STORAGE_KEY = "dashboard-locale";

export const SUPPORTED_LOCALES = ["en", "ar"];
export const DEFAULT_LOCALE = "en";

export function normalizeLocale(value) {
  if (typeof value !== "string" || !value.trim()) return DEFAULT_LOCALE;
  return value.toLowerCase().split("-")[0];
}

export function isSupportedLocale(value) {
  return SUPPORTED_LOCALES.includes(normalizeLocale(value));
}

export function getLocaleDirection(locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isAdminPath(pathname) {
  return typeof pathname === "string" && pathname.startsWith("/admin");
}

export function getSavedLocale() {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const locale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isSupportedLocale(locale) ? normalizeLocale(locale) : DEFAULT_LOCALE;
}

export function setSavedLocale(locale) {
  if (typeof window === "undefined" || !isSupportedLocale(locale)) {
    return;
  }

  window.localStorage.setItem(LOCALE_STORAGE_KEY, normalizeLocale(locale));
}

export function getEffectiveLocale(pathname = typeof window !== "undefined" ? window.location.pathname : "/") {
  if (isAdminPath(pathname)) {
    return DEFAULT_LOCALE;
  }

  return getSavedLocale();
}
