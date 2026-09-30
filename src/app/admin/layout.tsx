import "./admin.css";
import type { Metadata } from "next";
import { SessionRefresher } from "@/components/admin/session-refresher";

export const metadata: Metadata = {
  title: "Admin · Hunny Sindhakar",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 antialiased [color-scheme:light]">
      <SessionRefresher />
      {children}
    </div>
  );
}
