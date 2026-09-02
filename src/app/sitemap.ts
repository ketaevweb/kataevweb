import type { MetadataRoute } from "next";
import { caseStudies, siteConfig } from "@/lib/data";

/**
 * sitemap.xml для поисковиков — генерируется автоматически.
 * При добавлении страниц просто расширяйте этот массив.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...Object.keys(caseStudies).map((slug) => ({
      url: `${siteConfig.url}/cases/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
