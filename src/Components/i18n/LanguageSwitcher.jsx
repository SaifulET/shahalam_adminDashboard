import React from "react";
import { useI18n } from "../../i18n/I18nProvider";

const LanguageSwitcher = () => {
  const { locale, setLocale, isAdminRoute, t } = useI18n();

  if (isAdminRoute) {
    return null;
  }

  return (
    <div className="fixed z-50 top-4 left-4">
      <div className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm">
        <label htmlFor="lang-switcher" className="mr-2 text-xs text-gray-600">
          {t("language.label")}
        </label>
        <select
          id="lang-switcher"
          className="text-sm bg-transparent outline-none"
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
        >
          <option value="en">{t("language.english")}</option>
          <option value="ar">{t("language.arabic")}</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
