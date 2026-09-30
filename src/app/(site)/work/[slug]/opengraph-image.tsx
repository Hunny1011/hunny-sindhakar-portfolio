import { canvasCard, OG_SIZE } from "@/components/site/og/og";
import { getProject } from "@/lib/data";
import { KIND_LABEL } from "@/lib/format";

export const alt = "Case study by Hunny Sindhakar";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return canvasCard({ label: "Work", title: "Frame not found", footer: "Hunny Sindhakar · UI/UX Designer" });
  return canvasCard({
    label: `${KIND_LABEL[project.kind]} · ${project.category}`,
    title: project.title,
    footer: project.subtitle ?? project.platforms.join(" + "),
    accent: project.accent ?? undefined,
  });
}
