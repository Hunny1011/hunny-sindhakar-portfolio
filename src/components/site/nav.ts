import { BookOpen, Briefcase, FileText, House, Mail, User, type LucideIcon } from "lucide-react";

export type NavPage = { href: string; label: string; icon: LucideIcon; short?: string };

// The site's pages, shown as layers in the panel, the dock and the command palette.
export const PAGES: NavPage[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/work", label: "Work", icon: Briefcase },
  { href: "/about", label: "About", icon: User },
  { href: "/writing", label: "Writing", icon: BookOpen },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/contact", label: "Contact", icon: Mail },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export const pageLabel = (pathname: string) => PAGES.find((p) => isActive(pathname, p.href))?.label ?? "Canvas";
