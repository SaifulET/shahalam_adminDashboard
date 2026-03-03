export const toArabicDigits = (value) => {
  const str = String(value ?? "");
  const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/\d/g, (d) => digits[Number(d)]);
};

export const formatLocalizedValue = (value, locale) => {
  if (value === null || value === undefined) return "";
  if (locale === "ar") return toArabicDigits(value);
  return String(value);
};

export const formatLocalizedNumber = (value, locale) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return formatLocalizedValue(value, locale);
  return locale === "ar" ? num.toLocaleString("ar-EG") : String(num);
};
