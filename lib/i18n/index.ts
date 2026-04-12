"use client";

import { createContext, useContext } from "react";
import { en } from "./en";
import { es } from "./es";
import { de } from "./de";
import { fr } from "./fr";
import { it } from "./it";
import { getCurrencySymbol } from "../currency";

export { getCurrencySymbol };

export type Locale = "en" | "es" | "de" | "fr" | "it";
export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, es, de, fr, it };

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
  it: "🇮🇹",
};

export const I18nContext = createContext<{ locale: Locale; t: Dictionary; setLocale: (l: Locale) => void }>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

