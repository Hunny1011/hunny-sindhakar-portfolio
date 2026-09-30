"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Command, Ellipsis, Moon, Search } from "lucide-react";
import { PAGES, isActive } from "./nav";
import { useShell } from "./shell-provider";

const DOCK = ["/", "/work", "/about", "/contact"];

// Mobile bottom dock: four key pages + "More" (a small sheet with the other pages and actions).
export function Dock() {
  const pathname = usePathname();
  const { openPalette, toggleTheme } = useShell();
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const extra = PAGES.filter((p) => !DOCK.includes(p.href));

  useEffect(() => {
    if (!open) return;
    sheet.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {open && (
        <>
          <button type="button" className="more-scrim" aria-label="Close menu" tabIndex={-1} onClick={close} />
          <div ref={sheet} id="more-sheet" className="more-sheet" role="dialog" aria-label="More">
            <p className="more-sheet__h">Pages</p>
            {extra.map((page) => {
              const Icon = page.icon;
              return (
                <Link key={page.href} href={page.href} onClick={close} aria-current={isActive(pathname, page.href) ? "page" : undefined}>
                  <Icon aria-hidden />
                  {page.label}
                </Link>
              );
            })}
            <p className="more-sheet__h">Actions</p>
            <button
              type="button"
              onClick={() => {
                close();
                openPalette();
              }}
            >
              <Search aria-hidden />
              Search work & actions
            </button>
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                close();
              }}
            >
              <Moon aria-hidden />
              Toggle dark theme
            </button>
          </div>
        </>
      )}
      <nav className="dock" aria-label="Quick navigation">
        {PAGES.filter((p) => DOCK.includes(p.href)).map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.href} href={page.href} aria-current={isActive(pathname, page.href) ? "page" : undefined} onClick={close}>
              <Icon aria-hidden />
              {page.label}
            </Link>
          );
        })}
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="more-sheet"
          aria-current={extra.some((p) => isActive(pathname, p.href)) ? "page" : undefined}
        >
          {open ? <Command aria-hidden /> : <Ellipsis aria-hidden />}
          More
        </button>
      </nav>
    </>
  );
}
