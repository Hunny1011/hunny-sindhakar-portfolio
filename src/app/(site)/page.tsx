import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveHorizontal } from "lucide-react";
import { Board } from "@/components/site/board";
import { Block, BlockHead, FrameLabel } from "@/components/site/frame";
import { HeroSelection } from "@/components/site/hero-selection";
import { LiveSize } from "@/components/site/live-size";
import { GhostCursors } from "@/components/site/presence";
import { ContactNote, CoreSkills, ExperienceList, FaqList, SkillSets } from "@/components/site/sections";
import { Statement } from "@/components/site/statement";
import { StatusPill } from "@/components/site/status-pill";
import { WorkCard } from "@/components/site/work-card";
import { PostList } from "@/components/site/post-card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getEducation,
  getExperiences,
  getFaqs,
  getPosts,
  getProfile,
  getProjects,
  getSettings,
  getSkills,
  getSocialLinks,
  getTestimonials,
} from "@/lib/data";
import { careerStartYear, initials } from "@/lib/format";
import { buildMetadata, faqJsonLd, personJsonLd, websiteJsonLd } from "@/lib/seo";

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    ...buildMetadata({ title: settings.seo_default_title, description: settings.seo_default_description, path: "/", type: "profile" }),
    title: { absolute: settings.seo_default_title },
  };
}

export default async function HomePage() {
  const [profile, settings, projects, experiences, education, skills, posts, testimonials, faqs, socials] = await Promise.all([
    getProfile(),
    getSettings(),
    getProjects(),
    getExperiences(),
    getEducation(),
    getSkills(),
    getPosts(),
    getTestimonials(),
    getFaqs(),
    getSocialLinks(),
  ]);

  const featured = projects.filter((p) => p.featured);
  const board = featured.length ? featured : projects.slice(0, 6);
  const caseStudies = projects.filter((p) => p.kind === "case-study").length;
  const since = careerStartYear(experiences);
  const firstName = profile.name.split(" ")[0];

  return (
    <>
      <JsonLd data={[personJsonLd(profile, socials, experiences, education), websiteJsonLd(settings), ...(faqs.length ? [faqJsonLd(faqs)] : [])]} />

      <Block id="hero" tone="cobalt" layer="Hero">
        <FrameLabel name="Hero" sizeSlot={<LiveSize target="hero-frame" />} />
        <div className="frame hero" id="hero-frame">
          <GhostCursors />
          <div className="min-w-0">
            <p className="hero__kicker">
              <span>{profile.name}</span>
              <span aria-hidden>—</span>
              <span>{settings.hero_kicker}</span>
            </p>
            <HeroSelection comment={settings.hero_comment} cursorName={firstName} initial={initials(profile.name).slice(0, 1)}>
              <h1 id="hero-title" className="hero__title">
                <span className="hl">
                  <Statement text={settings.hero_statement} />
                </span>
              </h1>
            </HeroSelection>
            <p className="hero__headline">{profile.headline}</p>
            <div className="hero__ctas">
              <Link href="/work" className="btn btn--honey">
                View work <ArrowRight aria-hidden />
              </Link>
              <Link href="/contact" className="btn">
                Contact
              </Link>
              <span className="self-center">
                <StatusPill availability={profile.availability} note={profile.availability_note} />
              </span>
            </div>
          </div>
          <aside className="props" aria-label="Quick facts">
            <div className="props__tabs" aria-hidden>
              <b>Design</b>
              <span>Prototype</span>
              <span>Inspect</span>
            </div>
            <div className="props__group">
              <h2 className="props__title">Layer</h2>
              <dl>
                <dt>Role</dt>
                <dd>{profile.role}</dd>
                {profile.company && (
                  <>
                    <dt>Studio</dt>
                    <dd>{profile.company}</dd>
                  </>
                )}
                <dt>Based in</dt>
                <dd>
                  {profile.location}, {profile.country}
                </dd>
                {since && (
                  <>
                    <dt>Since</dt>
                    <dd>{since}</dd>
                  </>
                )}
              </dl>
            </div>
            <div className="props__group">
              <h2 className="props__title">Languages</h2>
              <p className="m-0 text-[12.5px] font-medium leading-relaxed">{profile.languages.join(" · ")}</p>
            </div>
            <div className="props__group" aria-hidden>
              <p className="props__title">Fill</p>
              <div className="props__swatches">
                {["--cobalt", "--sun", "--blush", "--forest", "--flame"].map((token) => (
                  <span key={token} className="swatch" style={{ background: `var(${token})` }} />
                ))}
                <span className="ml-auto font-mono text-[11px] text-ink-3">brand · 5 fills</span>
              </div>
            </div>
          </aside>
        </div>
      </Block>

      <Block id="who" tone="blush" layer="Who is Hunny">
        <div className="answer">
          <h2 id="who-title" className="answer__q">
            Who is {profile.name}?
          </h2>
          <div>
            <p className="answer__a">{profile.answer_block}</p>
            <div className="answer__meta">
              <Link href="/about" className="link-arrow">
                <span>More about {firstName}</span>
                <ArrowRight aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Block>

      {board.length > 0 && (
        <Block id="work" tone="cobalt" layer="Selected work">
          <BlockHead
            id="work"
            eyebrow="01 — Selected work"
            title={
              <>
                Frames from <em>the board</em>
              </>
            }
            lede={`${caseStudies} professional case studies and a growing set of concept projects. Client work under NDA is shown as typographic frames.`}
            action={
              <div className="flex items-center gap-5">
                <span className="board-hint" aria-hidden>
                  <MoveHorizontal className="size-3.5" /> drag to pan
                </span>
                <Link href="/work" className="link-arrow">
                  <span>All {projects.length} projects</span>
                  <ArrowRight aria-hidden />
                </Link>
              </div>
            }
          />
          <Board label="Selected work — scroll horizontally">
            {board.map((p) => (
              <WorkCard key={p.id} project={p} />
            ))}
          </Board>
        </Block>
      )}

      {experiences.length > 0 && (
        <Block id="experience" tone="flame" layer="Experience">
          <BlockHead
            id="experience"
            eyebrow="02 — Version history"
            title={
              <>
                Where I’ve <em>shipped</em>
              </>
            }
            action={
              <Link href="/about#experience" className="link-arrow">
                <span>Full journey</span>
                <ArrowRight aria-hidden />
              </Link>
            }
          />
          <ExperienceList items={experiences} />
        </Block>
      )}

      {(skills.length > 0 || profile.core_skills.length > 0) && (
        <Block id="toolkit" tone="forest" layer="Toolkit">
          <BlockHead
            id="toolkit"
            eyebrow="03 — Toolkit"
            title={
              <>
                Components I <em>reach for</em>
              </>
            }
          />
          <div className="toolkit">
            <SkillSets skills={skills} />
            {profile.core_skills.length > 0 && (
              <div>
                <h3 className="set__label">Core skills</h3>
                <CoreSkills items={profile.core_skills} />
              </div>
            )}
          </div>
        </Block>
      )}

      {posts.length > 0 && (
        <Block id="writing" tone="blush" layer="Writing">
          <BlockHead
            id="writing"
            eyebrow="04 — Writing"
            title={
              <>
                Notes on <em>craft</em>
              </>
            }
            action={
              <Link href="/writing" className="link-arrow">
                <span>All writing</span>
                <ArrowRight aria-hidden />
              </Link>
            }
          />
          <PostList posts={posts.slice(0, 3)} from="home" />
        </Block>
      )}

      {testimonials.length > 0 && (
        <Block id="comments" tone="sun" layer="Comments">
          <BlockHead id="comments" eyebrow="Comments" title={<>Kind words, <em>left on the canvas</em></>} />
          <div className="quotes">
            {testimonials.map((t) => (
              <figure key={t.id} className="quote m-0">
                <span className="quote__avatar" aria-hidden>
                  {t.avatar_url ? <Image src={t.avatar_url} alt="" width={34} height={34} /> : initials(t.name)}
                </span>
                <div className="quote__bubble">
                  <blockquote className="m-0">
                    <p>“{t.quote}”</p>
                  </blockquote>
                  <figcaption>
                    {t.name}
                    {[t.role, t.company].filter(Boolean).length > 0 && ` · ${[t.role, t.company].filter(Boolean).join(", ")}`}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </Block>
      )}

      {faqs.length > 0 && (
        <Block id="faq" tone="sun" layer="FAQ">
          <BlockHead
            id="faq"
            eyebrow="05 — FAQ"
            title={
              <>
                Questions, <em>answered</em>
              </>
            }
          />
          <FaqList faqs={faqs} />
        </Block>
      )}

      <ContactNote profile={profile} text={settings.hero_comment} />
    </>
  );
}
