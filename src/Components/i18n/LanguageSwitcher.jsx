import React from "react";
import { useI18n } from "../../i18n/I18nProvider";

const LanguageSwitcher = ({ className = "" }) => {
  const { locale, setLocale, isAdminRoute, t } = useI18n();

  if (isAdminRoute) {
    return null;
  }

  return (
    <div className={`rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm ${className}`}>
      <label htmlFor="lang-switcher" className="sr-only">
        {t("language.label")}
      </label>
      <select
        id="lang-switcher"
        className="min-w-[4.5rem] bg-transparent px-2 py-1 text-sm font-medium text-gray-700 outline-none"
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
      >
        <option value="en">{t("language.english")}</option>
        <option value="ar">{t("language.arabic")}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
