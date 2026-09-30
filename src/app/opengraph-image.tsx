import { canvasCard, OG_SIZE } from "@/components/site/og/og";
import { getProfile, getSettings } from "@/lib/data";

export const alt = "Hunny Sindhakar — UI/UX designer portfolio";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [profile, settings] = await Promise.all([getProfile(), getSettings()]);
  const [first, ...rest] = profile.name.split(" ");
  return canvasCard({
    label: "Portfolio",
    title: first,
    italic: rest.join(" "),
    footer: `${profile.role} · ${settings.hero_kicker}`,
  });
}
