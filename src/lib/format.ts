import type { Experience, Project, ProjectKind } from "./types";

const monthFmt = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export const formatMonth = (iso: string) => monthFmt.format(new Date(iso));

export const formatRange = (start: string, end: string | null) =>
  `${formatMonth(start)} — ${end ? formatMonth(end) : "Present"}`;

// "1 yr 5 mos" style duration, like a resume.
export function formatDuration(start: string, end: string | null) {
  const a = new Date(start);
  const b = end ? new Date(end) : new Date();
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) + 1;
  months = Math.max(1, months);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr${y > 1 ? "s" : ""}` : "", m ? `${m} mo${m > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ");
}

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

export function careerStartYear(experiences: Experience[]) {
  const design = experiences.filter((e) => /ui|ux|product/i.test(e.role));
  const list = design.length ? design : experiences;
  const years = list.map((e) => new Date(e.start_date).getUTCFullYear());
  return years.length ? Math.min(...years) : null;
}

export const splitParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export const KIND_LABEL: Record<ProjectKind, string> = {
  "case-study": "Case study",
  concept: "Concept",
  graphic: "Graphic",
};

export const KIND_LABEL_PLURAL: Record<ProjectKind, string> = {
  "case-study": "Case studies",
  concept: "Concepts",
  graphic: "Graphic design",
};

// Where the work was done: the company for professional work, "Personal concept" otherwise.
export function projectOrigin(p: Project) {
  if (p.kind === "case-study") return [p.company, p.client].filter(Boolean).join(" · ") || "Client work";
  if (p.kind === "graphic") return "Graphic design";
  return "Personal concept";
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/**
 * Splits a statement into plain/emphasised parts.
 * Admins can mark emphasis with *asterisks*; otherwise the last two words are set in italic.
 */
export function emphasise(text: string): { text: string; em: boolean }[] {
  if (/\*[^*]+\*/.test(text)) {
    return text
      .split(/(\*[^*]+\*)/)
      .filter(Boolean)
      .map((part) => (part.startsWith("*") ? { text: part.slice(1, -1), em: true } : { text: part, em: false }));
  }
  const words = text.trim().split(/\s+/);
  if (words.length < 4) return [{ text, em: false }];
  return [
    { text: `${words.slice(0, -2).join(" ")} `, em: false },
    { text: words.slice(-2).join(" "), em: true },
  ];
}

export const PLATFORM_GROUPS = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "print", label: "Print" },
] as const;

// Buckets free-text platforms ("Web app", "Mobile web", "Website"…) into Web / Mobile / Print.
export function platformGroups(platforms: string[]) {
  const set = new Set<string>();
  for (const p of platforms) {
    if (/mobile app|ios|android|mobile$/i.test(p)) set.add("mobile");
    else if (/web|site/i.test(p)) set.add("web");
    if (/mobile web/i.test(p)) set.add("mobile");
    if (/print/i.test(p)) set.add("print");
  }
  return [...set];
}
