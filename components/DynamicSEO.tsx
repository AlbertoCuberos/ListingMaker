"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export default function DynamicSEO() {
  const { locale, t } = useI18n();

  useEffect(() => {
    // Update Document Title
    document.title = t.seo.title;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", t.seo.description);
    }

    // Update OpenGraph Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", t.seo.ogTitle);
    }

    // Update OpenGraph Description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", t.seo.ogDescription);
    }

    // Update HTML lang attribute
    document.documentElement.lang = locale;
  }, [locale, t]);

  return null;
}
