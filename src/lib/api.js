
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { getEffectiveLocale } from "../i18n/config";

// const apiBaseUrl = "https://api.ur-wsl.com";
const apiBaseUrl = "http://localhost:5001";

const api = axios.create({
  baseURL: apiBaseUrl,

  withCredentials: true, // send httpOnly cookie
});

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
const ARABIC_TEXT_REGEX = /[\u0600-\u06FF]/;
const GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";
const translationCache = new Map();
const TRANSLATABLE_FIELDS = new Set([
  "name",
  "title",
  "location",
  "address",
  "description",
  "tagline",
  "city",
  "country",
  "face",
  "email",
  "website",
  "instagramLink",
  "phone",
  "postalCode",
]);

const ARABIC_LETTER_MAP = {
  a: "ا",
  b: "ب",
  c: "ك",
  d: "د",
  e: "ي",
  f: "ف",
  g: "ج",
  h: "ه",
  i: "ي",
  j: "ج",
  k: "ك",
  l: "ل",
  m: "م",
  n: "ن",
  o: "و",
  p: "ب",
  q: "ق",
  r: "ر",
  s: "س",
  t: "ت",
  u: "و",
  v: "ف",
  w: "و",
  x: "كس",
  y: "ي",
  z: "ز",
};

const normalizeLocalizedPayload = (payload, locale) => {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeLocalizedPayload(item, locale));
  }

  if (!isObject(payload)) {
    return payload;
  }

  const normalized = {};

  Object.entries(payload).forEach(([key, value]) => {
    normalized[key] = normalizeLocalizedPayload(value, locale);
  });

  Object.keys(payload).forEach((key) => {
    if (!key.endsWith("_en") && !key.endsWith("_ar")) {
      return;
    }

    const baseKey = key.replace(/_(en|ar)$/, "");
    const localizedKey = `${baseKey}_${locale}`;

    if (Object.prototype.hasOwnProperty.call(payload, localizedKey)) {
      normalized[baseKey] = normalizeLocalizedPayload(payload[localizedKey], locale);
    }
  });

  return normalized;
};

const shouldTranslateValue = (key, value, locale) => {
  if (locale !== "ar") return false;
  if (!TRANSLATABLE_FIELDS.has(key)) return false;
  if (typeof value !== "string") return false;

  const trimmed = value.trim();
  if (!trimmed) return false;
  if (ARABIC_TEXT_REGEX.test(trimmed)) return false;
  return true;
};

const transliterateLatinToArabic = (text) => {
  return text.replace(/[A-Za-z]+/g, (token) => {
    return token
      .toLowerCase()
      .split("")
      .map((ch) => ARABIC_LETTER_MAP[ch] || ch)
      .join("");
  });
};

const collectTextsToTranslate = (payload, locale, bucket = new Set()) => {
  if (Array.isArray(payload)) {
    payload.forEach((item) => collectTextsToTranslate(item, locale, bucket));
    return bucket;
  }

  if (!isObject(payload)) {
    return bucket;
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (shouldTranslateValue(key, value, locale)) {
      bucket.add(value.trim());
    }

    collectTextsToTranslate(value, locale, bucket);
  });

  return bucket;
};

const translateOneText = async (text, target) => {
  const cacheKey = `${target}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const url = new URL(GOOGLE_TRANSLATE_URL);
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "auto");
    url.searchParams.set("tl", target);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);

    const response = await fetch(url.toString(), { method: "GET", cache: "no-store" });
    if (!response.ok) {
      translationCache.set(cacheKey, text);
      return text;
    }

    const data = await response.json();
    const chunks = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
    const translated = chunks
      .map((chunk) => (Array.isArray(chunk) && typeof chunk[0] === "string" ? chunk[0] : ""))
      .join("")
      .trim();

    let finalText = translated || text;
    if (target === "ar" && finalText === text && /^[A-Za-z\s]+$/.test(text)) {
      finalText = transliterateLatinToArabic(text);
    }
    translationCache.set(cacheKey, finalText);
    return finalText;
  } catch {
    const fallback =
      target === "ar" && /^[A-Za-z\s]+$/.test(text)
        ? transliterateLatinToArabic(text)
        : text;
    translationCache.set(cacheKey, fallback);
    return fallback;
  }
};

const buildTranslationMap = async (texts, target) => {
  const values = Array.from(texts);
  if (!values.length || target !== "ar") {
    return new Map();
  }

  const translatedValues = await Promise.all(values.map((text) => translateOneText(text, target)));
  return new Map(values.map((text, index) => [text, translatedValues[index] || text]));
};

const applyTranslationsToPayload = (payload, locale, translationMap) => {
  if (Array.isArray(payload)) {
    return payload.map((item) => applyTranslationsToPayload(item, locale, translationMap));
  }

  if (!isObject(payload)) {
    return payload;
  }

  const translated = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (shouldTranslateValue(key, value, locale)) {
      const normalized = value.trim();
      translated[key] = translationMap.get(normalized) || value;
    } else {
      translated[key] = applyTranslationsToPayload(value, locale, translationMap);
    }
  });

  return translated;
};

// Attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  const locale = getEffectiveLocale();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.headers) {
    config.headers["Accept-Language"] = locale;
    config.headers["x-language"] = locale;
  }

  if (!config.params) {
    config.params = {};
  }

  if (!Object.prototype.hasOwnProperty.call(config.params, "lang")) {
    config.params.lang = locale;
  }

  return config;
});

// Refresh token on 401
api.interceptors.response.use(
  async (res) => {
    const locale = getEffectiveLocale();
    const normalizedPayload = normalizeLocalizedPayload(res.data, locale);

    if (locale === "ar") {
      const texts = collectTextsToTranslate(normalizedPayload, locale);
      const translationMap = await buildTranslationMap(texts, locale);
      res.data = applyTranslationsToPayload(normalizedPayload, locale, translationMap);
    } else {
      res.data = normalizedPayload;
    }

    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshCall) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/auth/refresh"); // refresh token endpoint
        const { accessToken } = res.data;
        useAuthStore.getState().setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest); // retry original request
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
