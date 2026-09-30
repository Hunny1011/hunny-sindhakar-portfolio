import Image from "next/image";
import { Block, BlockHead, Breadcrumbs, FrameLabel } from "@/components/site/frame";
import { SocialIcon } from "@/components/site/icons";
import { ContactNote, CoreSkills, ExperienceList, SkillSets } from "@/components/site/sections";
import { StatusPill } from "@/components/site/status-pill";
import { TrackedLink } from "@/components/site/tracked-link";
import { JsonLd } from "@/components/seo/json-ld";
import { getEducation, getExperiences, getProfile, getSettings, getSkills, getSocialLinks } from "@/lib/data";
import { careerStartYear, initials, splitParagraphs } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata, personJsonLd, profilePageJsonLd } from "@/lib/seo";

export async function generateMetadata() {
  const profile = await getProfile();
  return buildMetadata({
    title: `About ${profile.name} — ${profile.role}`,
    description: profile.answer_block.slice(0, 158),
    path: "/about",
    type: "profile",
  });
}

export default async function AboutPage() {
  const [profile, settings, experiences, education, skills, socials] = await Promise.all([
    getProfile(),
    getSettings(),
    getExperiences(),
    getEducation(),
    getSkills(),
    getSocialLinks(),
  ]);
  const [first, ...rest] = profile.name.split(" ");
  const since = careerStartYear(experiences);
  const degrees = education.filter((e) => e.kind === "degree");
  const certs = education.filter((e) => e.kind === "certification");
  const mono = initials(profile.name);

  return (
    <>
      <JsonLd
        data={[
          personJsonLd(profile, socials, experiences, education),
          profilePageJsonLd(profile),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />

      <section id="intro" data-layer="Intro" className="about-top page-head" aria-labelledby="about-title">
        <div className="min-w-0">
          <p className="eyebrow">About</p>
          <h1 id="about-title" className="page-title">
            {first} <em>{rest.join(" ")}</em>
          </h1>
          <div className="mt-8">
            <p className="answer__a">{profile.answer_block}</p>
          </div>
          <div className="prose mt-8">
            {splitParagraphs(profile.long_bio).map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
        <aside aria-label="Profile">
          <FrameLabel name="Avatar" size="4 : 5" />
          <div className="frame monogram">
            {profile.photo_url ? (
              <Image src={profile.photo_url} alt={`Portrait of ${profile.name}`} fill sizes="300px" preload />
            ) : (
              <>
                <span className="monogram__letters" aria-hidden>
                  {mono[0]}
                  <span>{mono[1]}</span>
                </span>
                <span className="monogram__cap" aria-hidden>
                  <span>monogram.svg</span>
                  <span>Instrument Serif</span>
                </span>
              </>
            )}
          </div>
          <dl className="facts">
            <div>
              <dt>Role</dt>
              <dd>{profile.role}</dd>
            </div>
            {profile.company && (
              <div>
                <dt>Studio</dt>
                <dd>
                  {profile.company_url ? (
                    <a href={profile.company_url} target="_blank" rel="noopener" className="underline decoration-honey underline-offset-4">
                      {profile.company}
                    </a>
                  ) : (
                    profile.company
                  )}
                </dd>
              </div>
            )}
            <div>
              <dt>Based in</dt>
              <dd>
                {profile.location}, {profile.country}
              </dd>
            </div>
            {since && (
              <div>
                <dt>Designing</dt>
                <dd>since {since}</dd>
              </div>
            )}
            {profile.languages.length > 0 && (
              <div>
                <dt>Speaks</dt>
                <dd>{profile.languages.join(", ")}</dd>
              </div>
            )}
          </dl>
          <div className="mt-5">
            <StatusPill availability={profile.availability} note={profile.availability_note} />
          </div>
        </aside>
      </section>

      {experiences.length > 0 && (
        <Block id="experience" layer="Experience">
          <BlockHead
            id="experience"
            eyebrow="Version history"
            title={
              <>
                The <em>journey</em> so far
              </>
            }
          />
          <ExperienceList items={experiences} detailed />
        </Block>
      )}

      {education.length > 0 && (
        <Block id="education" layer="Education">
          <BlockHead
            id="education"
            eyebrow="Education & certifications"
            title={
              <>
                Where I <em>learned</em>
              </>
            }
          />
          <ul className="edu">
            {[...degrees, ...certs].map((e) => (
              <li key={e.id}>
                <span className="edu__kind">{e.kind === "degree" ? "Degree" : "Certification"}</span>
                <h3>{e.title}</h3>
                <p>
                  {e.institution}
                  {e.location && ` · ${e.location}`}
                </p>
                {(e.start_year || e.end_year) && (
                  <p className="mt-2 font-mono text-[12px] text-ink-3">{[e.start_year, e.end_year].filter(Boolean).join(" — ")}</p>
                )}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {(skills.length > 0 || profile.core_skills.length > 0) && (
        <Block id="skills" layer="Skills">
          <BlockHead
            id="skills"
            eyebrow="Skills & tools"
            title={
              <>
                What I <em>bring</em>
              </>
            }
          />
          <div className="toolkit">
            <div>
              <h3 className="set__label">Core skills</h3>
              <CoreSkills items={profile.core_skills} />
            </div>
            <SkillSets skills={skills} />
          </div>
        </Block>
      )}

      {socials.length > 0 && (
        <Block id="elsewhere" layer="Elsewhere">
          <BlockHead id="elsewhere" eyebrow="Elsewhere" title={<>Find me <em>online</em></>} />
          <ul className="socials">
            {socials.map((s) => (
              <li key={s.id}>
                <TrackedLink
                  className="ai-btn"
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel={s.url.startsWith("http") ? "noopener me" : undefined}
                  event="social_click"
                  params={{ platform: s.platform, from: "about" }}
                >
                  <SocialIcon platform={s.platform} />
                  {s.label}
                  {s.handle && <span className="font-mono text-[12px] text-ink-3">{s.handle}</span>}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </Block>
      )}

      <ContactNote profile={profile} text={settings.hero_comment} />
    </>
  );
}
