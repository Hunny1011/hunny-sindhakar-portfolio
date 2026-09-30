"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command } from "lucide-react";
import { PAGES, isActive } from "./nav";
import { useShell } from "./shell-provider";

const DOCK = ["/", "/work", "/about", "/contact"];

// Mobile bottom dock: four key pages + "More" (opens the command palette).
export function Dock() {
  const pathname = usePathname();
  const { openPalette } = useShell();
  return (
    <nav className="dock" aria-label="Quick navigation">
      {PAGES.filter((p) => DOCK.includes(p.href)).map((page) => {
        const Icon = page.icon;
        return (
          <Link key={page.href} href={page.href} aria-current={isActive(pathname, page.href) ? "page" : undefined}>
            <Icon aria-hidden />
            {page.label}
          </Link>
        );
      })}
      <button type="button" onClick={openPalette} aria-haspopup="dialog">
        <Command aria-hidden />
        More
      </button>
    </nav>
  );
}
