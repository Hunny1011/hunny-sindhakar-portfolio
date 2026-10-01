"use client";

import { useEffect, useRef, useState } from "react";

type Item = { slug: string; kind: string; platform: string[] };
type Option = { value: string; label: string; tone?: string };

/**
 * Filter chips for the server-rendered work grid. Cards stay in the HTML (good for SEO);
 * filtering only toggles the `hidden` attribute on list items.
 */
export function WorkFilter({
  items,
  kinds,
  platforms,
  children,
}: {
  items: Item[];
  kinds: Option[];
  platforms: Option[];
  children: React.ReactNode;
}) {
  const [kind, setKind] = useState("all");
  const [platform, setPlatform] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const matches = (i: Item, k = kind, p = platform) => (k === "all" || i.kind === k) && (p === "all" || i.platform.includes(p));
  const visible = items.filter((i) => matches(i)).length;

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const k = q.get("kind");
    const p = q.get("platform");
    // Restore a shared filter URL once, after hydration.
    const id = requestAnimationFrame(() => {
      if (k && kinds.some((o) => o.value === k)) setKind(k);
      if (p && platforms.some((o) => o.value === p)) setPlatform(p);
    });
    return () => cancelAnimationFrame(id);
  }, [kinds, platforms]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    for (const li of grid.querySelectorAll<HTMLElement>("[data-slug]")) {
      const item = items.find((i) => i.slug === li.dataset.slug);
      li.hidden = !!item && !matches(item);
    }
    const url = new URL(window.location.href);
    if (kind === "all") url.searchParams.delete("kind");
    else url.searchParams.set("kind", kind);
    if (platform === "all") url.searchParams.delete("platform");
    else url.searchParams.set("platform", platform);
    window.history.replaceState(window.history.state, "", url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, platform, items]);

  const count = (k: string, p: string) => items.filter((i) => matches(i, k, p)).length;

  return (
    <>
      <div className="filters" role="group" aria-label="Filter by type">
        {[{ value: "all", label: "All work" }, ...kinds].map((o) => (
          <button
            key={o.value}
            type="button"
            className="chip chip--tone"
            data-tone={"tone" in o ? o.tone : undefined}
            aria-pressed={kind === o.value}
            onClick={() => setKind(o.value)}
          >
            {o.label}
            <span className="chip__count">{count(o.value, platform)}</span>
          </button>
        ))}
      </div>
      <div className="filters filters--sub" role="group" aria-label="Filter by platform">
        {[{ value: "all", label: "Any platform" }, ...platforms].map((o) => (
          <button key={o.value} type="button" className="chip" aria-pressed={platform === o.value} onClick={() => setPlatform(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {visible} {visible === 1 ? "project" : "projects"} shown
      </p>
      <div ref={gridRef}>
        {children}
        {visible === 0 && (
          <div className="empty-state">
            <p>No frames match this combination yet.</p>
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => {
                setKind("all");
                setPlatform("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
