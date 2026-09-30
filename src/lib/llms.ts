import "server-only";
import {
  getEducation,
  getExperiences,
  getFaqs,
  getPosts,
  getProfile,
  getProjects,
  getSkills,
  getSocialLinks,
} from "./data";
import { absoluteUrl, SITE_URL } from "./site";

// Builds /llms.txt (short index) and /llms-full.txt (everything as plain Markdown) from live data,
// so AI engines always get current, citable facts.

const monthYear = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present";

export async function buildLlmsTxt(full: boolean) {
  const [profile, projects, experiences, education, skills, faqs, posts, socials] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperiences(),
    getEducation(),
    getSkills(),
    getFaqs(),
    getPosts(),
    getSocialLinks(),
  ]);

  const out: string[] = [];
  out.push(`# ${profile.name} — ${profile.role}`, "");
  out.push(`> ${profile.answer_block}`, "");
  if (profile.alternate_names.length) out.push(`Also written as: ${profile.alternate_names.join(", ")}.`, "");
  out.push(
    `- Location: ${profile.location}, ${profile.country}`,
    `- Current role: ${profile.role}${profile.company ? ` at ${profile.company}` : ""}`,
    `- Availability: ${profile.availability_note ?? profile.availability}`,
    `- Email: ${profile.email}`,
    `- Website: ${SITE_URL}`,
    `- Languages: ${profile.languages.join(", ")}`,
    "",
  );

  out.push("## Pages", "");
  out.push(
    `- [About ${profile.name}](${absoluteUrl("/about")}): biography, experience, education`,
    `- [Work](${absoluteUrl("/work")}): all case studies and projects`,
    `- [Resume](${absoluteUrl("/resume")}): web resume`,
    `- [Writing](${absoluteUrl("/writing")}): articles on UI/UX`,
    `- [Contact](${absoluteUrl("/contact")}): hire or collaborate`,
    full ? "" : `- [Full profile for LLMs](${absoluteUrl("/llms-full.txt")}): everything on one page`,
    "",
  );

  out.push("## Projects", "");
  for (const p of projects) {
    const meta = [p.kind === "case-study" ? "Case study" : p.kind === "concept" ? "Concept" : "Graphic design", p.category, p.company, p.year]
      .filter(Boolean)
      .join(" · ");
    out.push(`- [${p.title}](${absoluteUrl(`/work/${p.slug}`)}) (${meta}): ${p.summary}`);
  }
  out.push("");

  if (full) {
    out.push("## About", "", profile.long_bio, "");

    out.push("## Experience", "");
    for (const e of experiences) {
      out.push(`### ${e.role} — ${e.company} (${monthYear(e.start_date)} – ${monthYear(e.end_date)})`, "");
      if (e.location) out.push(`Location: ${e.location}`, "");
      if (e.summary) out.push(e.summary, "");
      e.bullets.forEach((b) => out.push(`- ${b}`));
      out.push("");
    }

    out.push("## Education & certifications", "");
    education.forEach((e) =>
      out.push(`- ${e.title}, ${e.institution}${e.location ? `, ${e.location}` : ""}${e.end_year ? ` (${e.start_year ? `${e.start_year}–` : ""}${e.end_year})` : ""}`),
    );
    out.push("");

    out.push("## Skills & tools", "");
    out.push(`Core skills: ${profile.core_skills.join(", ")}.`, "");
    const groups = Map.groupBy(skills, (s) => s.group_name);
    groups.forEach((list, group) => out.push(`- ${group}: ${list.map((s) => s.name).join(", ")}`));
    out.push("");

    out.push("## Case study details", "");
    for (const p of projects) {
      out.push(`### ${p.title}${p.subtitle ? ` — ${p.subtitle}` : ""}`, "");
      out.push(`URL: ${absoluteUrl(`/work/${p.slug}`)}`);
      if (p.role) out.push(`Role: ${p.role}`);
      if (p.platforms.length) out.push(`Platforms: ${p.platforms.join(", ")}`);
      if (p.tools.length) out.push(`Tools: ${p.tools.join(", ")}`);
      out.push("", p.summary, "");
      if (p.problem) out.push(`Problem: ${p.problem}`, "");
      if (p.process) out.push(`Process: ${p.process}`, "");
      if (p.solution) out.push(`Solution: ${p.solution}`, "");
      if (p.outcome) out.push(`Outcome: ${p.outcome}`, "");
    }

    if (posts.length) {
      out.push("## Writing", "");
      posts.forEach((p) => out.push(`- [${p.title}](${p.url})${p.excerpt ? `: ${p.excerpt}` : ""}`));
      out.push("");
    }

    out.push("## FAQ", "");
    faqs.forEach((f) => out.push(`### ${f.question}`, "", f.answer, ""));
  }

  out.push("## Profiles", "");
  socials.filter((s) => s.url.startsWith("http")).forEach((s) => out.push(`- [${s.label}](${s.url})`));
  out.push("");

  return out.join("\n");
}
