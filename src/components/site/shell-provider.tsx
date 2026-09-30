"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";

export type PaletteData = {
  email: string;
  resumeUrl: string | null;
  projects: { slug: string; title: string; kind: string }[];
  ai: { name: string; url: string }[];
};

type Shell = {
  inspect: boolean;
  toggleInspect: () => void;
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  toggleTheme: () => void;
  announce: (message: string) => void;
};

const ShellContext = createContext<Shell | null>(null);

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used inside <ShellProvider>");
  return ctx;
}

// Heavy, rarely used pieces load only when first needed.
const CommandPalette = dynamic(() => import("./command-palette").then((m) => m.CommandPalette), { ssr: false });
const InspectOverlay = dynamic(() => import("./inspect-overlay").then((m) => m.InspectOverlay), { ssr: false });

const canInspect = () => typeof window !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

export function ShellProvider({ palette, children }: { palette: PaletteData; children: React.ReactNode }) {
  const [inspect, setInspect] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [message, setMessage] = useState("");
  const returnFocus = useRef<HTMLElement | null>(null);

  const announce = useCallback((m: string) => {
    setMessage("");
    requestAnimationFrame(() => setMessage(m));
  }, []);

  const toggleInspect = useCallback(() => {
    if (!canInspect()) return;
    setInspect((on) => {
      const next = !on;
      document.documentElement.dataset.inspect = next ? "on" : "off";
      announce(next ? "Inspect mode on. Hover any element to see its measurements. Press I to turn off." : "Inspect mode off.");
      track("inspect_mode_toggle", { on: next });
      return next;
    });
  }, [announce]);

  const openPalette = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setPaletteLoaded(true);
    setPaletteOpen(true);
    track("command_palette_open");
  }, []);

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
    requestAnimationFrame(() => returnFocus.current?.focus?.());
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    announce(`${next === "dark" ? "Dark" : "Light"} theme`);
    track("theme_toggle", { theme: next });
  }, [announce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (paletteOpen) closePalette();
        else openPalette();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target) || paletteOpen) return;
      if (e.key === "i" || e.key === "I") toggleInspect();
      else if (e.key === "Escape") {
        if (inspect) toggleInspect();
        setPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, inspect, openPalette, closePalette, toggleInspect]);

  const value = useMemo<Shell>(
    () => ({ inspect, toggleInspect, paletteOpen, openPalette, closePalette, panelOpen, setPanelOpen, toggleTheme, announce }),
    [inspect, toggleInspect, paletteOpen, openPalette, closePalette, panelOpen, toggleTheme, announce],
  );

  return (
    <ShellContext.Provider value={value}>
      {children}
      {paletteLoaded && <CommandPalette open={paletteOpen} data={palette} />}
      {inspect && <InspectOverlay />}
      <div className="sr-only-live" role="status" aria-live="polite">
        {message}
      </div>
    </ShellContext.Provider>
  );
}
