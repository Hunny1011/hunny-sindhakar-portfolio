import { Download } from "lucide-react";
import { Breadcrumbs, FrameLabel } from "@/components/site/frame";
import { PrintButton } from "@/components/site/print-button";
import { TrackedLink } from "@/components/site/tracked-link";
import { JsonLd } from "@/components/seo/json-ld";
import { getEducation, getExperiences, getProfile, getSkills, getSocialLinks } from "@/lib/data";
import { formatDuration, formatMonth } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const profile = await getProfile();
  return buildMetadata({
    title: `Résumé — ${profile.name}, ${profile.role}`,
    description: `Web résumé of ${profile.name}: experience, education, skills and languages. ${profile.short_bio}`.slice(0, 160),
    path: "/resume",
    type: "profile",
  });
}

export default async function ResumePage() {
  const [profile, experiences, education, skills, socials] = await Promise.all([
    getProfile(),
    getExperiences(),
    getEducation(),
    getSkills(),
    getSocialLinks(),
  ]);
  const groups = new Map<string, string[]>();
  for (const s of skills) groups.set(s.group_name, [...(groups.get(s.group_name) ?? []), s.name]);
  const web = socials.filter((s) => s.url.startsWith("http"));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Résumé", path: "/resume" },
        ])}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Résumé" }]} />
      <div className="resume__actions no-print">
        {profile.resume_url && (
          <TrackedLink href={profile.resume_url} className="btn btn--honey btn--sm" event="resume_download" params={{ from: "resume" }} download>
            <Download aria-hidden /> Download PDF
          </TrackedLink>
        )}
        <PrintButton />
      </div>
      <FrameLabel name="Résumé · A4" size="210 × 297 mm" />
      <article className="frame resume" id="resume" data-layer="Résumé" aria-labelledby="resume-name">
        <header className="resume__head">
          <h1 id="resume-name" className="resume__name">
            {profile.name}
          </h1>
          <p className="resume__role">
            {profile.role}
            {profile.company && ` · ${profile.company}`}
          </p>
          <ul className="resume__contact">
            <li>
              {profile.location}, {profile.country}
            </li>
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            {web.map((s) => (
              <li key={s.id}>
                <a href={s.url}>{s.url.replace(/^https?:\/\/(www\.)?/, "")}</a>
              </li>
            ))}
          </ul>
        </header>

        <section className="resume__sec" aria-labelledby="r-profile">
          <h2 id="r-profile" className="resume__h">
            Profile
          </h2>
          <p className="m-0 text-[15px] leading-relaxed text-ink-2">{profile.answer_block}</p>
        </section>

        {experiences.length > 0 && (
          <section className="resume__sec" aria-labelledby="r-exp">
            <h2 id="r-exp" className="resume__h">
              Experience
            </h2>
            <div>
              {experiences.map((e) => (
                <div key={e.id} className="resume__job">
                  <div className="resume__job-head">
                    <h3>{e.role}</h3>
                    <span className="resume__job-when">
                      {formatMonth(e.start_date)} — {e.end_date ? formatMonth(e.end_date) : "Present"} · {formatDuration(e.start_date, e.end_date)}
                    </span>
                  </div>
                  <p className="resume__job-co">
                    {e.company}
                    {e.location && ` · ${e.location}`}
                  </p>
                  {e.bullets.length > 0 && (
                    <ul>
                      {e.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="resume__sec" aria-labelledby="r-edu">
            <h2 id="r-edu" className="resume__h">
              Education
            </h2>
            <div>
              {education.map((e) => (
                <div key={e.id} className="resume__job">
                  <div className="resume__job-head">
                    <h3>
                      {e.title}
                      {e.kind === "certification" && <span className="font-normal text-ink-3"> · Certification</span>}
                    </h3>
                    <span className="resume__job-when">{[e.start_year, e.end_year].filter(Boolean).join(" — ")}</span>
                  </div>
                  <p className="resume__job-co">
                    {e.institution}
                    {e.location && ` · ${e.location}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(profile.core_skills.length > 0 || groups.size > 0) && (
          <section className="resume__sec" aria-labelledby="r-skills">
            <h2 id="r-skills" className="resume__h">
              Skills
            </h2>
            <ul className="resume__list">
              {profile.core_skills.length > 0 && <li>{profile.core_skills.join(" · ")}</li>}
              {[...groups].map(([g, names]) => (
                <li key={g}>
                  <strong className="font-semibold">{g}:</strong> {names.join(", ")}
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.languages.length > 0 && (
          <section className="resume__sec" aria-labelledby="r-lang">
            <h2 id="r-lang" className="resume__h">
              Languages
            </h2>
            <p className="m-0 text-[15px]">{profile.languages.join(", ")}</p>
          </section>
        )}
      </article>
    </>
  );
}
