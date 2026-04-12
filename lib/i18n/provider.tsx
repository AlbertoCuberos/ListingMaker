"use client";

import { useState, useEffect, ReactNode } from "react";
import { I18nContext, dictionaries, type Locale } from "./index";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // 1. Check URL parameters (highest priority for Ads/Marketing)
    const params = new URLSearchParams(window.location.search);
    const urlLocale = params.get("lang") || params.get("locale");
    
    if (urlLocale && dictionaries[urlLocale as Locale]) {
      setLocale(urlLocale as Locale);
      return;
    }

    // 2. Check saved preference
    const saved = localStorage.getItem("lm-locale") as Locale | null;
    if (saved && dictionaries[saved]) {
      setLocaleState(saved);
    } else {
      // 3. Auto-detect from browser
      const browserLang = navigator.language.slice(0, 2) as Locale;
      if (dictionaries[browserLang]) {
        setLocaleState(browserLang);
      } else {
        setLocaleState("en"); // Default
      }
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("lm-locale", l);
  };

  return (
    <I18nContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
