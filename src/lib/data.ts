import "server-only";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "./supabase/public";
import type {
  AiLink,
  Education,
  Experience,
  Faq,
  Post,
  Profile,
  Project,
  SiteSettings,
  Skill,
  SocialLink,
  Testimonial,
} from "./types";

// All public reads go through here. Every function is cached under the "content" tag;
// admin saves call revalidateTag(CONTENT_TAG) so the live site updates within seconds.
export const CONTENT_TAG = "content";

const cached = <A extends unknown[], R>(key: string, fn: (...args: A) => Promise<R>) =>
  unstable_cache(fn, [key], { tags: [CONTENT_TAG], revalidate: 3600 });

async function rows<T>(query: PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export const getProfile = cached("profile", async (): Promise<Profile> => {
  const { data, error } = await createPublicClient().from("profile").select("*").eq("id", 1).single();
  if (error) throw new Error(error.message);
  return data as Profile;
});

export const getSettings = cached("settings", async (): Promise<SiteSettings> => {
  const list = await rows<{ key: string; value: unknown }>(createPublicClient().from("site_settings").select("key,value"));
  return Object.fromEntries(list.map((r) => [r.key, r.value])) as SiteSettings;
});

export const getSocialLinks = cached("social", () =>
  rows<SocialLink>(createPublicClient().from("social_links").select("*").eq("visible", true).order("sort_order")),
);

export const getProjects = cached("projects", () =>
  rows<Project>(createPublicClient().from("projects").select("*").eq("status", "published").order("sort_order")),
);

export const getProject = cached("project", async (slug: string): Promise<Project | null> => {
  const { data, error } = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Project | null;
});

export const getExperiences = cached("experiences", () =>
  rows<Experience>(createPublicClient().from("experiences").select("*").order("sort_order")),
);

export const getEducation = cached("education", () =>
  rows<Education>(createPublicClient().from("education").select("*").order("sort_order")),
);

export const getSkills = cached("skills", () =>
  rows<Skill>(createPublicClient().from("skills").select("*").order("sort_order")),
);

export const getTestimonials = cached("testimonials", () =>
  rows<Testimonial>(createPublicClient().from("testimonials").select("*").eq("visible", true).order("sort_order")),
);

export const getFaqs = cached("faqs", () =>
  rows<Faq>(createPublicClient().from("faqs").select("*").eq("visible", true).order("sort_order")),
);

export const getPosts = cached("posts", () =>
  rows<Post>(
    createPublicClient().from("posts").select("*").eq("visible", true).order("published_at", { ascending: false }),
  ),
);

export const getAiLinks = cached("ai-links", () =>
  rows<AiLink>(createPublicClient().from("ai_links").select("*").eq("enabled", true).order("sort_order")),
);
