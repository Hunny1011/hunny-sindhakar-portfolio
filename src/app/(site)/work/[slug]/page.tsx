import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Breadcrumbs, FrameLabel } from "@/components/site/frame";
import { Gallery } from "@/components/site/gallery";
import { BehanceMark } from "@/components/site/icons";
import { ContactNote } from "@/components/site/sections";
import { TrackedLink } from "@/components/site/tracked-link";
import { ViewTracker } from "@/components/site/view-tracker";
import { GenCover } from "@/components/site/work-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getProfile, getProject, getProjects, getSettings } from "@/lib/data";
import { KIND_LABEL, projectOrigin } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata, projectJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.seo_title ?? `${project.title} — ${project.subtitle ?? project.category}`,
    description: project.seo_description ?? project.summary,
    path: `/work/${project.slug}`,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [project, projects, profile, settings] = await Promise.all([getProject(slug), getProjects(), getProfile(), getSettings()]);
  if (!project) notFound();

  const i = projects.findIndex((p) => p.slug === project.slug);
  const prev = i > 0 ? projects[i - 1] : null;
  const next = i >= 0 && i < projects.length - 1 ? projects[i + 1] : projects[0]?.slug !== project.slug ? projects[0] : null;

  const story = [
    { key: "problem", label: "The problem", q: "What was the problem?", body: project.problem },
    { key: "process", label: "Process", q: "How did I approach it?", body: project.process },
    { key: "solution", label: "The solution", q: "What was the solution?", body: project.solution },
    { key: "outcome", label: "Outcome", q: "What was the outcome?", body: project.outcome },
  ].filter((s) => s.body);

  const meta = [
    { label: project.kind === "case-study" ? "Company" : "Type", value: project.kind === "case-study" ? projectOrigin(project) : KIND_LABEL[project.kind] },
    { label: "Role", value: project.role },
    { label: "Year", value: project.year ? String(project.year) : null },
    { label: "Platform", value: project.platforms.join(", ") || null },
    { label: "Tools", value: project.tools.join(", ") || null },
  ].filter((m) => m.value);

  return (
    <>
      <JsonLd
        data={[
          projectJsonLd(project),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: project.title, path: `/work/${project.slug}` },
          ]),
        ]}
      />
      <ViewTracker event="view_project" params={{ slug: project.slug, kind: project.kind }} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Work", href: "/work" }, { name: project.title }]} />

      <header id="overview" data-layer="Overview" className="cs-hero page-head">
        <div>
          <p className="eyebrow">
            {KIND_LABEL[project.kind]} · {project.category}
          </p>
          <h1 className="page-title">{project.title}</h1>
          {project.subtitle && <p className="cs-sub">{project.subtitle}</p>}
        </div>

        <div>
          <FrameLabel name={`${project.title} — Cover`} size={project.cover_url ? "1400 × 1050" : "Generated"} />
          <div className="frame cs-cover" style={{ "--accent": project.accent ?? undefined } as React.CSSProperties}>
            {project.cover_url ? (
              <Image
                src={project.cover_url}
                alt={project.cover_alt ?? project.title}
                fill
                preload
                sizes="(min-width: 1600px) 1240px, (min-width: 1024px) calc(100vw - 360px), 100vw"
              />
            ) : (
              <GenCover project={project} />
            )}
          </div>
        </div>

        <dl className="cs-meta">
          {meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
        {(project.tags.length > 0 || project.external_url) && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ul className="tags" aria-label="Tags">
              {project.tags.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
            {project.external_url && (
              <TrackedLink
                href={project.external_url}
                target="_blank"
                rel="noopener"
                className="btn btn--sm"
                event="social_click"
                params={{ platform: "behance", project: project.slug }}
              >
                <BehanceMark />
                View on Behance
                <ArrowUpRight aria-hidden />
              </TrackedLink>
            )}
          </div>
        )}
      </header>

      <div className="cs-body">
        <section id="summary" data-layer="Summary" className="cs-section" aria-labelledby="summary-title">
          <h2 id="summary-title" className="cs-section__h">
            <span>00 — Summary</span>
            {project.kind === "case-study" ? `What is ${project.title}?` : "The brief"}
          </h2>
          <p className="cs-summary">{project.summary}</p>
        </section>

        {story.map((s, n) => (
          <section key={s.key} id={s.key} data-layer={s.label} className="cs-section" aria-labelledby={`${s.key}-title`}>
            <h2 id={`${s.key}-title`} className="cs-section__h">
              <span>
                {String(n + 1).padStart(2, "0")} — {s.label}
              </span>
              {s.q}
            </h2>
            <div className="prose">
              <p>{s.body}</p>
            </div>
          </section>
        ))}

        {project.highlights.length > 0 && (
          <section id="highlights" data-layer="Highlights" className="cs-section" aria-labelledby="highlights-title">
            <h2 id="highlights-title" className="cs-section__h">
              <span>Highlights</span>
              What stands out
            </h2>
            <ul className="highlights">
              {project.highlights.map((h) => (
                <li key={h}>
                  <Check aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.metrics.length > 0 && (
          <section id="metrics" data-layer="Metrics" className="cs-section" aria-labelledby="metrics-title">
            <h2 id="metrics-title" className="cs-section__h">
              <span>Impact</span>
              By the numbers
            </h2>
            <dl className="metrics">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {project.gallery.length > 0 && (
          <section id="gallery" data-layer="Gallery" aria-labelledby="gallery-title">
            <div className="block-head">
              <div>
                <p className="eyebrow">Screens</p>
                <h2 id="gallery-title" className="h-section">
                  Inside <em>{project.title}</em>
                </h2>
              </div>
            </div>
            <Gallery images={project.gallery} title={project.title} />
          </section>
        )}
      </div>

      {(prev || next) && (
        <nav className="pager" aria-label="More projects">
          {prev ? (
            <Link href={`/work/${prev.slug}`} rel="prev">
              <span>
                <ArrowLeft aria-hidden /> Previous frame
              </span>
              <strong>{prev.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/work/${next.slug}`} rel="next">
              <span>
                Next frame <ArrowRight aria-hidden />
              </span>
              <strong>{next.title}</strong>
            </Link>
          )}
        </nav>
      )}

      <ContactNote profile={profile} text={settings.hero_comment} />
    </>
  );
}
