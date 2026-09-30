import type { ProjectKind } from "@/lib/types";

// Brand colours used as "tones" (like coloured FigJam sections). CSS maps
// [data-tone="x"] to --c / --c-ink / --c-soft / --c-on.
export const TONES = ["cobalt", "flame", "forest", "blush", "sun"] as const;
export type Tone = (typeof TONES)[number];

export const toneAt = (i: number): Tone => TONES[((i % TONES.length) + TONES.length) % TONES.length];

export const KIND_TONE: Record<ProjectKind, Tone> = {
  "case-study": "cobalt",
  concept: "flame",
  graphic: "blush",
};
