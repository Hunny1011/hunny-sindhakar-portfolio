import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...p,
});

/** Figma-style "#" frame glyph used on frame labels. */
export const FrameGlyph = (p: P) => (
  <svg {...base(p)} viewBox="0 0 12 12" strokeWidth={1.1}>
    <path d="M3.5 1v10M8.5 1v10M1 3.5h10M1 8.5h10" />
  </svg>
);

/** Component (four diamonds) glyph. */
export const ComponentGlyph = (p: P) => (
  <svg {...base(p)} viewBox="0 0 12 12" strokeWidth={1.1}>
    <path d="M6 .8 8 2.8 6 4.8 4 2.8zM6 7.2l2 2-2 2-2-2zM2.8 4 4.8 6l-2 2L.8 6zM9.2 4l2 2-2 2-2-2z" />
  </svg>
);

/** Instance (single diamond) glyph. */
export const InstanceGlyph = (p: P) => (
  <svg {...base(p)} viewBox="0 0 12 12" strokeWidth={1.3}>
    <path d="M6 1.2 10.8 6 6 10.8 1.2 6z" />
  </svg>
);

export const TextGlyph = (p: P) => (
  <svg {...base(p)} viewBox="0 0 12 12" strokeWidth={1.2}>
    <path d="M2 2.5h8M6 2.5v7.5" />
  </svg>
);

export const CursorArrow = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...p}>
    <path d="M3.5 2.2 20 9.4l-7.1 2.3-3 7.1z" fill="var(--honey)" stroke="var(--on-honey)" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/* ---- Social marks (simplified) ---- */

export const LinkedInMark = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.84-2.05 3.78-2.05 4.05 0 4.8 2.62 4.8 6.03v5.42h-4v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.84 1.25-1.84 2.54v4.88h-4z" />
  </svg>
);

export const BehanceMark = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M8.2 11.3c1-.5 1.6-1.3 1.6-2.6C9.8 6.2 8 5.5 5.9 5.5H1v13h5.1c2.2 0 4.3-1 4.3-3.5 0-1.5-.7-2.7-2.2-3.2zM3.3 7.6h2.2c.8 0 1.6.2 1.6 1.2 0 .9-.6 1.3-1.4 1.3H3.3zm2.4 8.8H3.3v-3.5h2.5c1 0 1.7.4 1.7 1.8 0 1.3-.8 1.7-1.8 1.7zM15.3 8.2c-2.9 0-4.8 2-4.8 4.9 0 3 1.8 4.9 4.8 4.9 2.3 0 3.8-1 4.5-3.2h-2.3c-.3.8-1.3 1.3-2.1 1.3-1.6 0-2.4-.9-2.4-2.5h6.9c.1-3.1-1.6-5.4-4.6-5.4zm-2.3 4c.1-1.3.9-2.1 2.2-2.1 1.3 0 1.9.8 2 2.1zM13 5.9h5.1v1.3H13z" />
  </svg>
);

export const MediumMark = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
    <ellipse cx="6.8" cy="12" rx="5.8" ry="5.9" />
    <ellipse cx="16.2" cy="12" rx="2.9" ry="5.5" />
    <ellipse cx="21" cy="12" rx="1" ry="4.9" />
  </svg>
);

export const MailMark = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </svg>
);

export function SocialIcon({ platform, ...p }: P & { platform: string }) {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return <LinkedInMark {...p} />;
    case "behance":
      return <BehanceMark {...p} />;
    case "medium":
      return <MediumMark {...p} />;
    default:
      return <MailMark {...p} />;
  }
}

/* ---- "Ask AI" glyphs: simple geometric marks, not logos ---- */

export function AiGlyph({ name, ...p }: P & { name: string }) {
  const n = name.toLowerCase();
  if (n.includes("chatgpt") || n.includes("openai"))
    return (
      <svg {...base(p)} strokeWidth={1.5}>
        <path d="M12 3.2a4 4 0 0 1 4 4v3.2l-4 2.3-4-2.3V7.2a4 4 0 0 1 4-4z" />
        <path d="M19.6 7.6a4 4 0 0 1-1.5 5.5l-2.8 1.6-4-2.3" />
        <path d="M19.6 16.4a4 4 0 0 1-5.5 1.5L11.3 16.3v-4.6" />
        <path d="M12 20.8a4 4 0 0 1-4-4v-3.2l4-2.3" />
        <path d="M4.4 16.4a4 4 0 0 1 1.5-5.5l2.8-1.6 4 2.3" />
        <path d="M4.4 7.6a4 4 0 0 1 5.5-1.5l2.8 1.6v4.6" />
      </svg>
    );
  if (n.includes("claude"))
    return (
      <svg {...base(p)} stroke="#d97757" strokeWidth={2.2}>
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4M8.5 3.7l7 16.6M15.5 3.7l-7 16.6M3.7 8.5l16.6 7M20.3 8.5l-16.6 7" strokeWidth={1.6} />
      </svg>
    );
  if (n.includes("perplexity"))
    return (
      <svg {...base(p)} strokeWidth={1.5}>
        <path d="M12 2.5v19M4.5 7.5 12 2.5l7.5 5M4.5 7.5h15v8.5l-7.5-5-7.5 5zM4.5 16l7.5-5.2L19.5 16v4.5L12 15.2l-7.5 5.3z" />
      </svg>
    );
  if (n.includes("gemini") || n.includes("google"))
    return (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...p}>
        <path d="M12 2c.6 5.3 4.7 9.4 10 10-5.3.6-9.4 4.7-10 10-.6-5.3-4.7-9.4-10-10 5.3-.6 9.4-4.7 10-10z" fill="#4c7cf0" />
      </svg>
    );
  if (n.includes("grok") || n === "x")
    return (
      <svg {...base(p)} strokeWidth={1.8}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M6 19 18.5 5.5" />
      </svg>
    );
  if (n.includes("copilot"))
    return (
      <svg {...base(p)} strokeWidth={1.5}>
        <path d="M8 4h6.5a3 3 0 0 1 2.9 2.2L20 15.5a3 3 0 0 1-2.9 3.5H14" />
        <path d="M16 20H9.5a3 3 0 0 1-2.9-2.2L4 8.5A3 3 0 0 1 6.9 5H10" />
      </svg>
    );
  return (
    <svg {...base(p)}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    </svg>
  );
}
