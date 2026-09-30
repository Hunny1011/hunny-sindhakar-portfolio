"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Copy, Download, Frame, Mail, Moon, ScanSearch, Search } from "lucide-react";
import { track } from "@/lib/analytics";
import { AiGlyph } from "./icons";
import { PAGES } from "./nav";
import { useShell, type PaletteData } from "./shell-provider";

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  icon: React.ReactNode;
  run: () => void;
};

export function CommandPalette({ open, data }: { open: boolean; data: PaletteData }) {
  if (!open) return null;
  return <Palette data={data} />;
}

function Palette({ data }: { data: PaletteData }) {
  const router = useRouter();
  const { closePalette, toggleTheme, toggleInspect, announce } = useShell();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      closePalette();
      router.push(href);
    };
    const fine = typeof window !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;
    const list: Item[] = [
      ...PAGES.map((p) => {
        const Icon = p.icon;
        return { id: `page-${p.href}`, group: "Pages", label: p.label, hint: p.href, icon: <Icon aria-hidden />, run: go(p.href) };
      }),
      ...data.projects.map((p) => ({
        id: `work-${p.slug}`,
        group: "Work",
        label: p.title,
        hint: p.kind === "case-study" ? "Case study" : p.kind === "graphic" ? "Graphic" : "Concept",
        keywords: p.kind,
        icon: <Frame aria-hidden />,
        run: go(`/work/${p.slug}`),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: data.email,
        keywords: "mail contact",
        icon: <Copy aria-hidden />,
        run: () => {
          navigator.clipboard?.writeText(data.email).then(
            () => announce("Email address copied"),
            () => announce(data.email),
          );
          track("copy_email", { from: "palette" });
          closePalette();
        },
      },
      {
        id: "send-email",
        group: "Actions",
        label: "Write an email",
        hint: "mailto",
        keywords: "contact hire",
        icon: <Mail aria-hidden />,
        run: () => {
          closePalette();
          window.location.href = `mailto:${data.email}`;
        },
      },
      ...(data.resumeUrl
        ? [
            {
              id: "resume",
              group: "Actions",
              label: "Download résumé (PDF)",
              keywords: "cv resume pdf",
              icon: <Download aria-hidden />,
              run: () => {
                track("resume_download", { from: "palette" });
                closePalette();
                window.open(data.resumeUrl!, "_blank", "noopener");
              },
            },
          ]
        : []),
      {
        id: "theme",
        group: "Actions",
        label: "Toggle light / dark theme",
        keywords: "dark mode light appearance",
        icon: <Moon aria-hidden />,
        run: () => {
          toggleTheme();
          closePalette();
        },
      },
      ...(fine
        ? [
            {
              id: "inspect",
              group: "Actions",
              label: "Toggle Inspect mode",
              hint: "I",
              keywords: "dev mode measure redline",
              icon: <ScanSearch aria-hidden />,
              run: () => {
                closePalette();
                toggleInspect();
              },
            },
          ]
        : []),
      ...data.ai.map((a) => ({
        id: `ai-${a.name}`,
        group: "Ask AI about Hunny",
        label: `Ask ${a.name} about Hunny`,
        keywords: "ai chat",
        icon: <AiGlyph name={a.name} />,
        run: () => {
          track("ask_ai_click", { ai: a.name, from: "palette" });
          closePalette();
          window.open(a.url, "_blank", "noopener");
        },
      })),
    ];
    return list;
  }, [data, router, closePalette, toggleTheme, toggleInspect, announce]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.keywords ?? ""} ${i.group}`.toLowerCase().includes(q));
  }, [items, query]);

  const current = Math.min(active, Math.max(0, filtered.length - 1));

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [current, filtered]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((current + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((current - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Home") {
      setActive(0);
    } else if (e.key === "End") {
      setActive(filtered.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[current]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  let lastGroup = "";
  const listId = `${uid}-list`;

  return (
    <div className="cmdk" onMouseDown={(e) => e.target === e.currentTarget && closePalette()}>
      <div className="cmdk__panel" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKeyDown}>
        <div className="cmdk__search">
          <Search aria-hidden />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={filtered[current] ? `${uid}-${filtered[current].id}` : undefined}
            aria-label="Search pages, work and actions"
            placeholder="Jump to a project, copy email, ask AI…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="cmdk__esc" onClick={closePalette} tabIndex={-1}>
            esc
          </button>
        </div>
        <ul id={listId} ref={listRef} className="cmdk__list" role="listbox" aria-label="Results">
          {filtered.length === 0 && (
            <li className="cmdk__empty" role="presentation">
              Nothing matches “{query}”. Try “work”, “email” or “ChatGPT”.
            </li>
          )}
          {filtered.map((item, i) => {
            const header = item.group !== lastGroup;
            lastGroup = item.group;
            return (
              <li key={item.id} role="presentation">
                {header && (
                  <div className="cmdk__group" role="presentation" aria-hidden>
                    {item.group}
                  </div>
                )}
                <div
                  id={`${uid}-${item.id}`}
                  role="option"
                  aria-selected={i === current}
                  className="cmdk__item"
                  onMouseMove={() => i !== current && setActive(i)}
                  onClick={item.run}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.group === "Ask AI about Hunny" ? <ArrowUpRight aria-hidden /> : item.hint && <small>{item.hint}</small>}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="cmdk__foot" aria-hidden>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
