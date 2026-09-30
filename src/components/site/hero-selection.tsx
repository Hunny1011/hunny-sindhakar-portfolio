"use client";

import { useEffect, useRef } from "react";
import { CursorArrow } from "./icons";

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

/**
 * The hero statement shown as a selected text layer: honey bounding box, 8 handles,
 * a live W × H label, a "Hunny" multiplayer cursor and a comment bubble.
 * The heading itself is server-rendered (it is the LCP element); this only adds chrome.
 * All motion is CSS and only runs for fine pointers without reduced motion.
 */
export function HeroSelection({
  children,
  comment,
  cursorName,
  initial,
}: {
  children: React.ReactNode;
  comment: string;
  cursorName: string;
  initial: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dims = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.target.getBoundingClientRect();
      el.style.setProperty("--sel-w", String(Math.round(width)));
      el.style.setProperty("--sel-h", String(Math.round(height)));
      if (dims.current) dims.current.textContent = `${Math.round(width)} × ${Math.round(height)}`;
    });
    ro.observe(el);
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "comment-pop") el.dataset.anim = "idle";
    };
    el.addEventListener("animationend", onEnd);
    return () => {
      ro.disconnect();
      el.removeEventListener("animationend", onEnd);
    };
  }, []);

  return (
    <div ref={ref} className="selection">
      {children}
      <span className="selection__box" aria-hidden>
        {HANDLES.map((h) => (
          <span key={h} className="handle" data-h={h} />
        ))}
      </span>
      <span className="selection__name" aria-hidden>
        T&nbsp;&nbsp;hero-statement
      </span>
      <span ref={dims} className="selection__dims" aria-hidden>
        Hug × Hug
      </span>
      <span className="mp-cursor" aria-hidden>
        <CursorArrow />
        <span className="mp-cursor__name">{cursorName}</span>
      </span>
      <p className="comment" role="note">
        <span className="comment__avatar" aria-hidden>
          {initial}
        </span>
        <span>
          <span className="comment__who">{cursorName} · just now</span>
          {comment}
        </span>
      </p>
    </div>
  );
}
