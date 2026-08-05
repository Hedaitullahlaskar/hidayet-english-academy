import type { MetadataRoute } from "next";
import { getAllCourseSlugs } from "@/lib/courses/repository";
import { allPolicies } from "@/content/legal";

const SITE_URL = "https://www.hidayetenglishacademy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courseSlugs = await getAllCourseSlugs();

  const courseEntries: MetadataRoute.Sitemap = courseSlugs.map((slug) => ({
    url: `${SITE_URL}/courses/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const legalEntries: MetadataRoute.Sitemap = allPolicies.map((policy) => ({
    url: `${SITE_URL}/legal/${policy.slug}`,
    lastModified: new Date(policy.lastUpdated),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/method`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/scholarship`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/programs/madhyamik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/legal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...courseEntries,
    ...legalEntries,
  ];
}
