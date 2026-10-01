import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const dir = join(process.cwd(), "src/components/site/og/fonts");
const font = (file: string) => readFile(join(dir, file));

export const OG_SIZE = { width: 1200, height: 630 };

async function fonts() {
  const [serif, serifItalic, mono] = await Promise.all([
    font("InstrumentSerif-Regular.ttf"),
    font("InstrumentSerif-Italic.ttf"),
    font("GeistMono-Regular.ttf"),
  ]);
  return [
    { name: "Serif", data: serif, style: "normal" as const, weight: 400 as const },
    { name: "Serif", data: serifItalic, style: "italic" as const, weight: 400 as const },
    { name: "Mono", data: mono, style: "normal" as const, weight: 400 as const },
  ];
}

const HONEY = "#112bac"; // cobalt: selection box
const SUN = "#ffc412"; // monogram tile
const BRAND = ["#112bac", "#ffc412", "#ff93aa", "#0d5f4f", "#ff520d"];
const INK = "#1a1612";
const PAPER = "#fef8f3";

/** Branded canvas-style social card: dot grid, a frame label and a honey selection box. */
export async function canvasCard({
  label,
  title,
  italic,
  footer,
  accent = HONEY,
}: {
  label: string;
  title: string;
  italic?: string;
  footer: string;
  accent?: string;
}) {
  const handle = (x: string, y: string) => (
    <div style={{ position: "absolute", left: x, top: y, width: 14, height: 14, marginLeft: -7, marginTop: -7, background: "#fff", border: `2.5px solid ${HONEY}` }} />
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPER,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(27,26,23,0.16) 1.4px, transparent 0)",
          backgroundSize: "26px 26px",
          padding: "56px 72px",
          fontFamily: "Mono",
          color: INK,
          position: "relative",
        }}
      >
        {/* Brand-colour glows. Fade to the same colour at 0 alpha: "transparent" is black and greys the edge. */}
        <div style={{ position: "absolute", right: -120, top: -160, width: 520, height: 520, display: "flex", borderRadius: 260, background: `radial-gradient(circle, ${SUN}cc, ${SUN}00 68%)` }} />
        <div style={{ position: "absolute", right: 120, top: 210, width: 420, height: 420, display: "flex", borderRadius: 210, background: `radial-gradient(circle, ${BRAND[2]}aa, ${BRAND[2]}00 68%)` }} />
        <div style={{ position: "absolute", right: -140, bottom: -200, width: 520, height: 520, display: "flex", borderRadius: 260, background: `radial-gradient(circle, ${accent}88, ${accent}00 68%)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#675d54" }}>
          <div style={{ display: "flex", width: 44, height: 44, background: SUN, alignItems: "center", justifyContent: "center", fontFamily: "Serif", fontStyle: "italic", fontSize: 32, color: INK, borderRadius: 4 }}>
            H
          </div>
          <span style={{ color: INK }}>Hunny Sindhakar</span>
          <span>/</span>
          <span># {label}</span>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "18px 26px", border: `2.5px solid ${HONEY}`, maxWidth: 1000 }}>
            {handle("0%", "0%")}
            {handle("100%", "0%")}
            {handle("0%", "100%")}
            {handle("100%", "100%")}
            <div style={{ display: "flex", flexWrap: "wrap", fontFamily: "Serif", fontSize: title.length > 40 ? 76 : 96, lineHeight: 1, letterSpacing: -2 }}>
              <span>{title}</span>
              {italic && <span style={{ fontStyle: "italic", marginLeft: 20 }}>{italic}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#463e37" }}>
          <span>{footer}</span>
          <span style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {BRAND.map((c) => (
              <span key={c} style={{ display: "flex", background: c, width: 18, height: 18, borderRadius: 4 }} />
            ))}
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

export async function monogramIcon(px: number) {
  const serif = await font("InstrumentSerif-Italic.ttf");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: SUN,
          borderRadius: px > 100 ? 0 : px * 0.18,
          fontFamily: "Serif",
          fontStyle: "italic",
          fontSize: px * 0.6,
          color: INK,
          letterSpacing: -px * 0.04,
          paddingTop: px * 0.04,
        }}
      >
        HS
      </div>
    ),
    { width: px, height: px, fonts: [{ name: "Serif", data: serif, style: "italic", weight: 400 }] },
  );
}
