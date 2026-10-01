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
        <div style={{ position: "absolute", right: 0, top: 0, width: 520, height: 630, display: "flex", background: `radial-gradient(circle at 100% 0%, ${accent}55, transparent 70%)` }} />
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
          <span style={{ display: "flex", background: accent, width: 16, height: 16, borderRadius: 8, marginTop: 4 }} />
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
