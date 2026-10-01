"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Frame, Hand, MessageCircle, Moon, MousePointer2, PanelLeft, ScanSearch, Sun, Type } from "lucide-react";
import type { Availability } from "@/lib/types";
import { pageLabel } from "./nav";
import { useShell } from "./shell-provider";
import { PresenceStack } from "./presence";

const subscribeResize = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const zoomSnapshot = () => {
  // Zoom relative to the 1440px design frame.
  return Math.round((window.innerWidth / 1440) * 100);
};
const noop = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const STATUS_LABEL: Record<Availability, string> = {
  open: "Available",
  freelance: "Freelance only",
  busy: "Booked",
};

export function Toolbar({ availability, availabilityNote }: { availability: Availability; availabilityNote: string | null }) {
  const pathname = usePathname();
  const { inspect, toggleInspect, openPalette, toggleTheme, panelOpen, setPanelOpen } = useShell();
  const zoom = useSyncExternalStore(subscribeResize, zoomSnapshot, () => 100);
  const mac = useSyncExternalStore(noop, isMac, () => true);

  return (
    <header className="toolbar" role="banner">
      <button
        type="button"
        className="tool panel-toggle"
        aria-label={panelOpen ? "Close layers panel" : "Open layers panel"}
        aria-expanded={panelOpen}
        aria-controls="layers-panel"
        onClick={() => setPanelOpen(!panelOpen)}
      >
        <PanelLeft aria-hidden />
      </button>
      <Link href="/" className="toolbar__brand" aria-label="Hunny Sindhakar — home">
        <span className="mark" aria-hidden>
          H
        </span>
        <span className="toolbar__brand-name">
          Hunny Sindhakar <span className="max-[420px]:hidden">/ Portfolio</span>
        </span>
      </Link>
      <span className="toolbar__sep max-[899px]:hidden" aria-hidden />
      <nav className="toolbar__tools" aria-label="Canvas tools">
        <button type="button" className="tool" aria-pressed={!inspect} onClick={() => inspect && toggleInspect()}>
          <MousePointer2 aria-hidden />
          <span className="tool__tip" aria-hidden>Move · V</span>
          <span className="sr-only">Move tool</span>
        </button>
        <Link className="tool" href="/work">
          <Frame aria-hidden />
          <span className="tool__tip" aria-hidden>Frames · Work</span>
          <span className="sr-only">Work</span>
        </Link>
        <Link className="tool" href="/writing">
          <Type aria-hidden />
          <span className="tool__tip" aria-hidden>Text · Writing</span>
          <span className="sr-only">Writing</span>
        </Link>
        <Link className="tool" href="/contact">
          <MessageCircle aria-hidden />
          <span className="tool__tip" aria-hidden>Comment · Contact</span>
          <span className="sr-only">Contact</span>
        </Link>
        <button type="button" className="tool" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Hand aria-hidden />
          <span className="tool__tip" aria-hidden>Hand · Back to top</span>
          <span className="sr-only">Back to top</span>
        </button>
      </nav>
      <div className="toolbar__center">
        <p className="toolbar__file">
          Portfolio / <strong>{pageLabel(pathname)}</strong>
        </p>
      </div>
      <div className="toolbar__right">
        <PresenceStack />
        <Link href="/contact" className="status-pill" data-status={availability} title={availabilityNote ?? undefined}>
          <span className="status-pill__dot" aria-hidden />
          {STATUS_LABEL[availability]}
        </Link>
        <span className="toolbar__zoom" aria-hidden>
          {zoom}%
        </span>
        <button
          type="button"
          className="tool inspect-only"
          aria-pressed={inspect}
          onClick={toggleInspect}
          aria-keyshortcuts="I"
        >
          <ScanSearch aria-hidden />
          <span className="tool__tip" aria-hidden>Inspect · I</span>
          <span className="sr-only">Inspect mode</span>
        </button>
        <button type="button" className="tool" onClick={toggleTheme}>
          <Sun aria-hidden className="ti-sun" />
          <Moon aria-hidden className="ti-moon" />
          <span className="tool__tip" aria-hidden>Theme</span>
          <span className="sr-only">Toggle dark theme</span>
        </button>
        <button type="button" className="toolbar__k" onClick={openPalette} aria-keyshortcuts="Control+K Meta+K" aria-haspopup="dialog">
          <kbd>{mac ? "⌘K" : "Ctrl K"}</kbd>
          <span className="toolbar__k-label">Quick actions</span>
          <span className="sr-only"> — open command palette</span>
        </button>
      </div>
    </header>
  );
}
