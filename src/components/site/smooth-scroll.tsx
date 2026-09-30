"use client";

import { useEffect } from "react";

// Lenis smooth scrolling: desktop mouse/trackpad only, never with reduced motion.
// Loaded lazily so it never blocks first paint.
export function SmoothScroll() {
  useEffect(() => {
    const ok = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
    if (!ok) return;
    let lenis: { destroy: () => void } | undefined;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        autoRaf: true,
        anchors: { offset: -80 },
        allowNestedScroll: true,
        prevent: (node: HTMLElement) => !!node.closest(".cmdk, .board--scroll, .lightbox"),
      });
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);
  return null;
}
