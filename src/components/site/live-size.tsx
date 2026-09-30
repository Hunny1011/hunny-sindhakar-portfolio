"use client";

import { useEffect, useRef } from "react";

/** Live "W × Hug" readout of a frame's rendered width, like Figma's frame size label. */
export function LiveSize({ target }: { target: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (ref.current) ref.current.textContent = `${Math.round(el.getBoundingClientRect().width)} × Hug`;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [target]);
  return (
    <span ref={ref} className="frame-label__size">
      Fill × Hug
    </span>
  );
}
