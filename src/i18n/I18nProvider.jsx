import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ConfigProvider } from "antd";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LOCALE,
  getEffectiveLocale,
  getLocaleDirection,
  isAdminPath,
  isSupportedLocale,
  normalizeLocale,
  setSavedLocale,
} from "./config";
import "./i18n";

const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  direction: "ltr",
  isAdminRoute: false,
  setLocale: () => {},
  t: (key) => key,
});

function installLocationEvents() {
  if (typeof window === "undefined" || window.__dashboardI18nHistoryPatched) {
    return;
  }

  const notify = () => {
    window.dispatchEvent(new Event("locationchange"));
  };

  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function patchPushState(...args) {
    const result = originalPushState.apply(this, args);
    notify();
    return result;
  };

  window.history.replaceState = function patchReplaceState(...args) {
    const result = originalReplaceState.apply(this, args);
    notify();
    return result;
  };

  window.addEventListener("popstate", notify);
  window.__dashboardI18nHistoryPatched = true;
}

export function I18nProvider({ children }) {
  const { t, i18n } = useTranslation();
  const [pathname, setPathname] = useState(() =>
    typeof window === "undefined" ? "/" : window.location.pathname
  );
  const [locale, setLocaleState] = useState(() => getEffectiveLocale(pathname));

  useEffect(() => {
    installLocationEvents();

    const handlePathChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("locationchange", handlePathChange);
    return () => {
      window.removeEventListener("locationchange", handlePathChange);
    };
  }, []);

  useEffect(() => {
    const handleLanguageChanged = (nextLanguage) => {
      const normalized = normalizeLocale(nextLanguage);
      if (isSupportedLocale(normalized)) {
        setLocaleState(normalized);
      }
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  useEffect(() => {
    if (isAdminPath(pathname)) {
      setLocaleState(DEFAULT_LOCALE);
      i18n.changeLanguage(DEFAULT_LOCALE);
      return;
    }

    const nextLocale = getEffectiveLocale(pathname);
    setLocaleState(nextLocale);
    i18n.changeLanguage(nextLocale);
  }, [pathname, i18n]);

  const direction = getLocaleDirection(locale);
  const isAdminRoute = isAdminPath(pathname);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [direction, locale]);

  const setLocale = (nextLocale) => {
    const normalized = normalizeLocale(nextLocale);
    if (isAdminRoute || !isSupportedLocale(normalized)) {
      return;
    }

    setSavedLocale(normalized);
    setLocaleState(normalized);
    i18n.changeLanguage(normalized);
  };

  const value = useMemo(
    () => ({ locale, direction, isAdminRoute, setLocale, t }),
    [locale, direction, isAdminRoute, t]
  );

  return (
    <I18nContext.Provider value={value}>
      <ConfigProvider direction={direction}>{children}</ConfigProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
