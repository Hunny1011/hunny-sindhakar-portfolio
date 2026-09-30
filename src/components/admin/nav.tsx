"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/admin/actions";
import { admin } from "@/lib/admin/path";

const links = [
  { href: admin(), label: "Dashboard" },
  { href: admin("/profile"), label: "Profile" },
  { href: admin("/c/projects"), label: "Projects" },
  { href: admin("/c/experiences"), label: "Experience" },
  { href: admin("/c/education"), label: "Education" },
  { href: admin("/c/skills"), label: "Toolkit" },
  { href: admin("/c/testimonials"), label: "Testimonials" },
  { href: admin("/c/faqs"), label: "FAQ" },
  { href: admin("/c/posts"), label: "Writing" },
  { href: admin("/c/social_links"), label: "Social links" },
  { href: admin("/c/ai_links"), label: "Ask-AI buttons" },
  { href: admin("/settings"), label: "Settings & SEO" },
  { href: admin("/messages"), label: "Messages" },
];

export function AdminNav({ email, newMessages }: { email: string; newMessages: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === admin() ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="border-b border-zinc-200 bg-white lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-3 p-4">
        <Link href={admin()} className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-amber-400 text-sm">HS</span>
          Admin
        </Link>
        <button
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="admin-menu"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      <nav id="admin-menu" className={`${open ? "block" : "hidden"} px-2 pb-4 lg:block`}>
        <ul className="space-y-0.5">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`flex min-h-10 items-center justify-between rounded-lg px-3 text-sm ${
                  isActive(l.href) ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {l.label}
                {l.href === admin("/messages") && newMessages > 0 && (
                  <span className="rounded-full bg-amber-400 px-2 text-xs font-semibold text-zinc-900">{newMessages}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-zinc-200 px-3 pt-4 text-xs text-zinc-500">
          <p className="truncate">{email}</p>
          <div className="mt-3 flex gap-3">
            <a href="/" target="_blank" rel="noopener" className="underline">View site ↗</a>
            <button
              className="underline"
              onClick={async () => {
                await signOut();
                router.replace(admin("/login"));
                router.refresh();
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
