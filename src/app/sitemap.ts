import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

/**
 * sitemap.xml для поисковиков — генерируется автоматически.
 * Когда появятся отдельные страницы (блог, кейсы), просто добавьте их в массив.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
