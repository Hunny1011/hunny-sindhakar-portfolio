import { Breadcrumbs, FrameLabel } from "@/components/site/frame";
import { WorkCard } from "@/components/site/work-card";
import { WorkFilter } from "@/components/site/work-filter";
import { KIND_TONE } from "@/components/site/tones";
import { JsonLd } from "@/components/seo/json-ld";
import { getProjects } from "@/lib/data";
import { KIND_LABEL_PLURAL, PLATFORM_GROUPS, platformGroups } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import type { ProjectKind } from "@/lib/types";

export const metadata = buildMetadata({
  title: "Work — UI/UX case studies and concepts",
  description:
    "UI/UX case studies by Hunny Sindhakar for Bombay Softwares and Immence — AI, SaaS, HR, sports and mobility — plus mobile and web concept projects and graphic design.",
  path: "/work",
});

const ORDER: ProjectKind[] = ["case-study", "concept", "graphic"];

export default async function WorkPage() {
  const projects = await getProjects();
  const kinds = ORDER.filter((k) => projects.some((p) => p.kind === k)).map((k) => ({ value: k, label: KIND_LABEL_PLURAL[k], tone: KIND_TONE[k] }));
  const items = projects.map((p) => ({ slug: p.slug, kind: p.kind, platform: platformGroups(p.platforms) }));
  const platforms = PLATFORM_GROUPS.filter((g) => items.some((i) => i.platform.includes(g.value))).map((g) => ({ ...g }));
  const count = (k: ProjectKind) => projects.filter((p) => p.kind === k).length;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Work" }]} />
      <header className="page-head" id="overview" data-layer="Overview">
        <FrameLabel name="Work" size={`${projects.length} frames`} />
        <h1 className="page-title">
          Every frame <em>on the board</em>
        </h1>
        <div className="kind-note mt-8">
          <p className="m-0">
            <strong className="kind-dot" data-tone="cobalt">{KIND_LABEL_PLURAL["case-study"]} ({count("case-study")})</strong> are professional products designed at
            Bombay Softwares and Immence. Most are under NDA, so they are shown as typographic frames with the story in words.
          </p>
          <p className="m-0">
            <strong className="kind-dot" data-tone="flame">Concepts ({count("concept")})</strong> are self-initiated explorations published on Behance
            {count("graphic") > 0 && (
              <>
                , and <strong className="kind-dot" data-tone="blush">graphic design ({count("graphic")})</strong> covers print and branding
              </>
            )}
            .
          </p>
        </div>
      </header>

      <section id="projects" data-layer="Projects" aria-label="Projects" className="mt-4">
        <WorkFilter items={items} kinds={kinds} platforms={platforms}>
          <ul className="work-grid m-0 mt-8 list-none p-0">
            {projects.map((p) => (
              <li key={p.id} data-slug={p.slug}>
                <WorkCard project={p} headingLevel="h2" sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 100vw" />
              </li>
            ))}
          </ul>
        </WorkFilter>
      </section>
    </>
  );
}
