import type { Metadata } from "next";
import { SITE_URL, absoluteUrl } from "./site";
import type { Education, Experience, Faq, Post, Profile, Project, SiteSettings, SocialLink } from "./types";

// Page metadata with canonical URL, Open Graph and Twitter cards.
// OG images come from the opengraph-image.tsx file conventions, so none are set here.
export function buildMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description, url: absoluteUrl(path), type, siteName: "Hunny Sindhakar", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function personJsonLd(
  profile: Profile,
  socials: SocialLink[],
  experiences: Experience[] = [],
  education: Education[] = [],
) {
  const current = experiences.find((e) => !e.end_date);
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    alternateName: profile.alternate_names,
    jobTitle: profile.role,
    description: profile.answer_block,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    image: profile.photo_url ?? undefined,
    address: { "@type": "PostalAddress", addressLocality: profile.location.split(",")[0], addressRegion: "Gujarat", addressCountry: "IN" },
    worksFor: current ? { "@type": "Organization", name: current.company, url: profile.company_url ?? undefined } : undefined,
    alumniOf: education
      .filter((e) => e.kind === "degree")
      .map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
    hasCredential: education
      .filter((e) => e.kind === "certification")
      .map((e) => ({ "@type": "EducationalOccupationalCredential", name: e.title, recognizedBy: { "@type": "Organization", name: e.institution } })),
    knowsAbout: ["User Interface Design", "User Experience Design", "Product Design", "Prototyping", "Design Systems", ...profile.core_skills],
    knowsLanguage: profile.languages,
    sameAs: socials.filter((s) => s.url.startsWith("http")).map((s) => s.url),
  };
}

export function websiteJsonLd(settings: SiteSettings) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Hunny Sindhakar — UI/UX Designer",
    description: settings.seo_default_description,
    inLanguage: "en-IN",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

export function profilePageJsonLd(profile: Profile) {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about#page`,
    url: absoluteUrl("/about"),
    name: `About ${profile.name}`,
    dateModified: profile.updated_at,
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(`/work/${project.slug}`)}#work`,
    name: project.title,
    headline: project.subtitle ?? project.title,
    description: project.summary,
    url: absoluteUrl(`/work/${project.slug}`),
    image: project.cover_url ?? undefined,
    genre: project.category,
    keywords: project.tags.join(", "),
    dateCreated: project.year ? String(project.year) : undefined,
    dateModified: project.updated_at,
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    sourceOrganization: project.company ? { "@type": "Organization", name: project.company } : undefined,
    sameAs: project.external_url ?? undefined,
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleListJsonLd(posts: Post[]) {
  return {
    "@type": "ItemList",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "BlogPosting",
        headline: p.title,
        url: p.url,
        datePublished: p.published_at ?? undefined,
        image: p.cover_url ?? undefined,
        author: { "@id": PERSON_ID },
      },
    })),
  };
}
