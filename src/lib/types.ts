// Row shapes of the Supabase tables (see supabase/migrations/0001_init.sql).
// Field names stay snake_case so rows flow from the DB to components without mapping.

export type Availability = "open" | "freelance" | "busy";

export type Profile = {
  id: number;
  name: string;
  alternate_names: string[];
  headline: string;
  role: string;
  company: string | null;
  company_url: string | null;
  location: string;
  country: string;
  email: string;
  short_bio: string;
  long_bio: string;
  answer_block: string;
  photo_url: string | null;
  resume_url: string | null;
  availability: Availability;
  availability_note: string | null;
  languages: string[];
  core_skills: string[];
  updated_at: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  handle: string | null;
  sort_order: number;
  visible: boolean;
};

export type GalleryImage = { url: string; alt: string; width: number; height: number };
export type Metric = { label: string; value: string };
export type ProjectKind = "case-study" | "concept" | "graphic";

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  kind: ProjectKind;
  company: string | null;
  client: string | null;
  role: string | null;
  year: number | null;
  platforms: string[];
  summary: string;
  problem: string | null;
  process: string | null;
  solution: string | null;
  outcome: string | null;
  highlights: string[];
  metrics: Metric[];
  cover_url: string | null;
  cover_alt: string | null;
  accent: string | null;
  gallery: GalleryImage[];
  tags: string[];
  tools: string[];
  external_url: string | null;
  featured: boolean;
  sort_order: number;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  summary: string | null;
  bullets: string[];
  sort_order: number;
};

export type Education = {
  id: string;
  kind: "degree" | "certification";
  title: string;
  institution: string;
  location: string | null;
  start_year: number | null;
  end_year: number | null;
  sort_order: number;
};

export type Skill = { id: string; group_name: string; name: string; sort_order: number };

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  visible: boolean;
  sort_order: number;
};

export type Faq = { id: string; question: string; answer: string; visible: boolean; sort_order: number };

export type Post = {
  id: string;
  title: string;
  url: string;
  source: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
  visible: boolean;
};

export type AiLink = { id: string; name: string; url_template: string; enabled: boolean; sort_order: number };

export type Message = {
  id: string;
  name: string;
  email: string;
  intent: "hiring" | "freelance" | "hello";
  message: string;
  status: "new" | "replied" | "closed";
  created_at: string;
};

export type SiteSettings = {
  ask_ai_prompt: string;
  seo_default_title: string;
  seo_default_description: string;
  hero_kicker: string;
  hero_statement: string;
  hero_comment: string;
};
