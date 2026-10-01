"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FrameGlyph } from "./icons";
import { PAGES, isActive } from "./nav";
import { useShell } from "./shell-provider";

type Child = { id: string; name: string; tone?: string };

// Left "Layers" panel: pages are layers; the current page's frames (sections marked
// with data-layer) are listed as children and highlighted while in view.
export function LayersPanel({ location }: { location: string }) {
  const pathname = usePathname();
  const { panelOpen, setPanelOpen } = useShell();
  const [children, setChildren] = useState<Child[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let io: IntersectionObserver | undefined;
    const frame = requestAnimationFrame(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("#main [data-layer][id]"));
      setChildren(els.map((el) => ({ id: el.id, name: el.dataset.layer ?? el.id, tone: el.dataset.tone })));
      setActiveId(els[0]?.id ?? null);
      io = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]) setActiveId(visible[0].target.id);
        },
        { rootMargin: "-20% 0px -55% 0px" },
      );
      els.forEach((el) => io!.observe(el));
    });
    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
    };
  }, [pathname]);

  const close = () => setPanelOpen(false);

  return (
    <>
      {panelOpen && <button type="button" className="layers__scrim" aria-label="Close layers panel" onClick={close} tabIndex={-1} />}
      <aside id="layers-panel" className="layers" data-open={panelOpen} aria-label="Layers">
        <div className="layers__head">
          <span>Layers</span>
          <span aria-hidden>{PAGES.length} pages</span>
        </div>
        <div className="layers__tabs" aria-hidden>
          <b>Pages</b>
          <span>Assets</span>
        </div>
        <nav aria-label="Main">
          <ul className="layers__pages">
            {PAGES.map((page) => {
              const active = isActive(pathname, page.href);
              const Icon = page.icon;
              return (
                <li key={page.href}>
                  <Link href={page.href} className="layer" aria-current={active ? "page" : undefined} onClick={close}>
                    <Icon aria-hidden />
                    {page.label}
                    {active && children.length > 0 && <span className="layer__meta">{children.length}</span>}
                  </Link>
                  {active && children.length > 0 && (
                    <ul className="layers__children" aria-label={`${page.label} sections`}>
                      {children.map((c) => (
                        <li key={c.id}>
                          <a href={`#${c.id}`} className="layer layer--child" data-active={c.id === activeId} data-tone={c.tone} onClick={close}>
                            <FrameGlyph />
                            {c.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="layers__foot">
          <span>{location}</span>
          <span>
            <kbd>⌘K</kbd> quick actions · <kbd>I</kbd> inspect
          </span>
        </div>
      </aside>
    </>
  );
}
