import Image from "next/image";
import Link from "next/link";
import { KIND_LABEL, projectOrigin } from "@/lib/format";
import type { Project } from "@/lib/types";
import { FrameGlyph } from "./icons";

const isMobile = (p: Project) => p.platforms.some((x) => /mobile app|ios|android/i.test(x)) && !p.platforms.some((x) => /^web app$/i.test(x));
const isPrint = (p: Project) => p.kind === "graphic" || p.platforms.some((x) => /print/i.test(x));

/** Abstract wireframe art in the project's accent colour — never a fake screenshot. */
function CoverArt({ project }: { project: Project }) {
  if (isPrint(project))
    return (
      <svg className="gen-cover__art" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="46" y="20" width="120" height="170" rx="3" fill="currentColor" fillOpacity=".12" />
        <rect x="30" y="34" width="120" height="170" rx="3" fill="var(--surface)" />
        <path d="M52 70h76M52 84h56M52 150h40" />
        <circle cx="90" cy="118" r="14" />
      </svg>
    );
  if (isMobile(project))
    return (
      <svg className="gen-cover__art gen-cover__art--phone" viewBox="0 0 120 240" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="4" y="4" width="112" height="232" rx="18" fill="var(--surface)" />
        <rect x="44" y="12" width="32" height="7" rx="3.5" fill="currentColor" fillOpacity=".4" stroke="none" />
        <rect x="16" y="34" width="88" height="54" rx="8" fill="currentColor" fillOpacity=".18" />
        <path d="M16 104h64M16 116h44" />
        <rect x="16" y="132" width="40" height="40" rx="6" />
        <rect x="64" y="132" width="40" height="40" rx="6" fill="currentColor" fillOpacity=".12" />
        <rect x="16" y="190" width="88" height="22" rx="11" fill="currentColor" stroke="none" />
      </svg>
    );
  return (
    <svg className="gen-cover__art" viewBox="0 0 240 180" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="4" y="4" width="232" height="172" rx="8" fill="var(--surface)" />
      <path d="M4 24h232" />
      <circle cx="16" cy="14" r="3" fill="currentColor" stroke="none" />
      <circle cx="27" cy="14" r="3" fill="currentColor" fillOpacity=".5" stroke="none" />
      <path d="M52 24v152" />
      <path d="M14 40h26M14 52h20M14 64h24" />
      <rect x="64" y="36" width="160" height="44" rx="5" fill="currentColor" fillOpacity=".16" />
      <rect x="64" y="92" width="74" height="70" rx="5" />
      <rect x="150" y="92" width="74" height="70" rx="5" fill="currentColor" fillOpacity=".1" />
      <path d="M74 146l14-16 12 9 16-22 14 12" />
    </svg>
  );
}

export function GenCover({ project, headingLevel = "p" }: { project: Project; headingLevel?: "p" | "h1" }) {
  const Title = headingLevel;
  const nda = project.kind === "case-study" && project.gallery.length === 0;
  return (
    <div className="gen-cover" style={{ "--accent": project.accent ?? "#112bac" } as React.CSSProperties}>
      <div className="gen-cover__top">
        <span>{project.category}</span>
        <span>{project.platforms.join(" + ")}</span>
      </div>
      <Title className="gen-cover__title" aria-hidden={headingLevel === "p" ? true : undefined}>
        {project.title}
      </Title>
      {nda && <span className="gen-cover__nda">Client work · visuals under NDA</span>}
      <CoverArt project={project} />
    </div>
  );
}

export function ProjectCover({ project, sizes, priority = false }: { project: Project; sizes: string; priority?: boolean }) {
  if (project.cover_url)
    return (
      <Image
        src={project.cover_url}
        alt={project.cover_alt ?? `${project.title} — cover`}
        fill
        sizes={sizes}
        preload={priority}
        className="object-cover"
      />
    );
  return <GenCover project={project} />;
}

export function WorkCard({
  project,
  headingLevel = "h3",
  sizes = "(min-width: 1024px) 440px, (min-width: 480px) 50vw, 100vw",
}: {
  project: Project;
  headingLevel?: "h2" | "h3";
  sizes?: string;
}) {
  const H = headingLevel;
  return (
    <article className="work-card">
      <Link href={`/work/${project.slug}`} className="work-card__link">
        <span className="work-card__label" aria-hidden>
          <FrameGlyph />
          <span>{project.title}</span>
          <span>{project.platforms[0] ?? project.category}</span>
        </span>
        <span className="work-card__frame">
          <ProjectCover project={project} sizes={sizes} />
        </span>
        <span className="work-card__body block">
          <H className="work-card__title">{project.title}</H>
          <span className="work-card__sub block">{project.subtitle ?? project.summary}</span>
        </span>
      </Link>
      <div className="work-card__meta">
        <span className="tag tag--kind" data-kind={project.kind}>
          {KIND_LABEL[project.kind]}
        </span>
        <span className="tag">{projectOrigin(project)}</span>
        {project.year && <span className="tag">{project.year}</span>}
      </div>
    </article>
  );
}
