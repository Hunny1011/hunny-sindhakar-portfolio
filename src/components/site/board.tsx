"use client";

import { useRef } from "react";

// Horizontal "board" of frames: drag with the mouse to pan (like the Hand tool), scroll or use arrow keys.
// On phones the CSS stacks the frames instead.
export function Board({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
    drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = ref.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      el.dataset.dragging = "true";
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const end = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (el) delete el.dataset.dragging;
    drag.current = null;
  };

  return (
    <div
      ref={ref}
      className="board board--scroll"
      role="region"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
