"use client";

import { useEffect, useRef, useState } from "react";
import { lastPointer } from "./pointer";
import { useShell } from "./shell-provider";

type Box = { top: number; left: number; width: number; height: number };
type Reading = {
  box: Box;
  margin: [number, number, number, number];
  padding: [number, number, number, number];
  name: string;
  font: string;
  color: { hex: string; token?: string };
  fill?: { hex: string; token?: string };
  radius: string;
};

const TOKENS = ["--ink", "--ink-2", "--ink-3", "--paper", "--paper-2", "--surface", "--surface-2", "--chrome", "--honey", "--honey-ink", "--honey-soft", "--on-honey", "--violet", "--on-violet"];

function toHex(color: string) {
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = "1"] = m[1].split(/[\s,/]+/).filter(Boolean);
  if (Number(a) === 0) return null;
  return `#${[r, g, b].map((v) => Math.round(Number(v)).toString(16).padStart(2, "0")).join("")}`;
}

function cleanFamily(family: string) {
  const first = family.split(",")[0].trim().replace(/['"]/g, "");
  return first.replace(/^_+/, "").replace(/_[0-9a-f]{5,}$/i, "").replace(/_Fallback$/i, "").replace(/_/g, " ");
}

function describe(el: HTMLElement) {
  const layer = el.closest<HTMLElement>("[data-layer]")?.dataset.layer;
  const tag = el.tagName.toLowerCase();
  const cls = typeof el.className === "string" ? el.className.split(/\s+/).find((c) => c && !c.includes(":")) : "";
  return `${tag}${cls ? `.${cls}` : ""}${layer ? `  ·  ${layer}` : ""}`;
}

// Figma Dev-Mode style overlay: box, padding/margin redlines, type and colour tokens.
export function InspectOverlay() {
  const { toggleInspect } = useShell();
  const [r, setR] = useState<Reading | null>(null);
  const target = useRef<HTMLElement | null>(null);
  const tokens = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const map = new Map<string, string>();
    const probe = document.createElement("span");
    document.body.appendChild(probe);
    for (const t of TOKENS) {
      probe.style.color = `var(${t})`;
      const hex = toHex(getComputedStyle(probe).color);
      if (hex && !map.has(hex)) map.set(hex, t);
    }
    probe.remove();
    tokens.current = map;

    let raf = 0;
    const measure = () => {
      const el = target.current;
      if (!el) return setR(null);
      const rect = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const px = (v: string) => Math.round(parseFloat(v) || 0);
      const colorHex = toHex(s.color) ?? "transparent";
      const bgHex = toHex(s.backgroundColor);
      setR({
        box: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        margin: [px(s.marginTop), px(s.marginRight), px(s.marginBottom), px(s.marginLeft)],
        padding: [px(s.paddingTop), px(s.paddingRight), px(s.paddingBottom), px(s.paddingLeft)],
        name: describe(el),
        font: `${cleanFamily(s.fontFamily)} · ${px(s.fontSize)}/${s.lineHeight === "normal" ? "auto" : px(s.lineHeight)} · ${s.fontWeight}`,
        color: { hex: colorHex, token: tokens.current.get(colorHex) },
        fill: bgHex ? { hex: bgHex, token: tokens.current.get(bgHex) } : undefined,
        radius: s.borderTopLeftRadius,
      });
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const onMove = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (!el || el === target.current || el.closest(".inspect-badge")) return;
      if (el === document.body || el === document.documentElement || el.classList.contains("site")) {
        target.current = null;
      } else target.current = el;
      schedule();
    };
    const onLeave = () => {
      target.current = null;
      schedule();
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    if (lastPointer.x >= 0) {
      const start = document.elementFromPoint(lastPointer.x, lastPointer.y) as HTMLElement | null;
      if (start && start !== document.body && !start.closest(".inspect-badge, .toolbar")) {
        target.current = start;
        schedule();
      }
    }
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const b = r?.box;
  const tipBelow = b ? b.top + b.height + 150 < window.innerHeight : true;
  const tipLeft = b ? Math.min(Math.max(8, b.left), window.innerWidth - 296) : 0;
  const tipTop = b ? (tipBelow ? b.top + b.height + 26 : Math.max(8, b.top - 142)) : 0;

  return (
    <>
      <div className="inspect-layer" aria-hidden>
        {r && b && (
          <>
            <div
              data-part
              className="inspect-margin"
              style={{
                top: b.top - r.margin[0],
                left: b.left - r.margin[3],
                width: b.width + r.margin[1] + r.margin[3],
                height: b.height + r.margin[0] + r.margin[2],
              }}
            />
            <div data-part className="inspect-padding" style={{ top: b.top, left: b.left, width: b.width, height: r.padding[0] }} />
            <div data-part className="inspect-padding" style={{ top: b.top + b.height - r.padding[2], left: b.left, width: b.width, height: r.padding[2] }} />
            <div data-part className="inspect-padding" style={{ top: b.top + r.padding[0], left: b.left, width: r.padding[3], height: Math.max(0, b.height - r.padding[0] - r.padding[2]) }} />
            <div
              data-part
              className="inspect-padding"
              style={{ top: b.top + r.padding[0], left: b.left + b.width - r.padding[1], width: r.padding[1], height: Math.max(0, b.height - r.padding[0] - r.padding[2]) }}
            />
            <div data-part className="inspect-box" style={{ top: b.top, left: b.left, width: b.width, height: b.height }} />
            <div data-part className="inspect-dim" style={{ top: b.top + b.height + 4, left: b.left + b.width / 2, translate: "-50% 0" }}>
              {Math.round(b.width)} × {Math.round(b.height)}
            </div>
            <div data-part className="inspect-tip" style={{ top: tipTop, left: tipLeft }}>
              <b>{r.name}</b>
              <br />
              <i>font</i> {r.font}
              <br />
              <i>color</i> <span className="sw" style={{ background: r.color.hex }} />
              {r.color.token ?? r.color.hex}
              {r.fill && (
                <>
                  <br />
                  <i>fill</i> <span className="sw" style={{ background: r.fill.hex }} />
                  {r.fill.token ?? r.fill.hex}
                </>
              )}
              <br />
              <i>padding</i> {r.padding.join(" ")} <i>margin</i> {r.margin.join(" ")}
              {r.radius !== "0px" && (
                <>
                  <br />
                  <i>radius</i> {r.radius}
                </>
              )}
            </div>
          </>
        )}
      </div>
      <div className="inspect-badge" role="group" aria-label="Inspect mode">
        <span>Inspect mode</span>
        <kbd>I</kbd>
        <button type="button" onClick={toggleInspect}>
          Exit
        </button>
      </div>
    </>
  );
}
