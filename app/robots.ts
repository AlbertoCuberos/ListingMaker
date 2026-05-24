import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/create", "/result", "/api/"],
      },
    ],
    sitemap: "https://listingmaker.app/sitemap.xml",
    host: "https://listingmaker.app",
  };
}
