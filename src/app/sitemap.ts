import type { MetadataRoute } from "next";
import { getProfile, getProjects } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const latest = projects.reduce((max, p) => (p.updated_at > max ? p.updated_at : max), profile.updated_at);

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/work"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: profile.updated_at, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/resume"), lastModified: profile.updated_at, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/writing"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/llms.txt"), lastModified: latest, changeFrequency: "weekly", priority: 0.3 },
  ];

  return [
    ...pages,
    ...projects.map((p) => ({
      url: absoluteUrl(`/work/${p.slug}`),
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: p.kind === "case-study" ? 0.8 : 0.6,
      images: p.cover_url ? [p.cover_url] : undefined,
    })),
  ];
}
