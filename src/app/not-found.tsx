import type { Metadata } from "next";
import { NotFoundFrame } from "@/components/site/not-found-frame";

export const metadata: Metadata = { title: "Frame not found", robots: { index: false } };

// Unmatched URLs render outside the (site) shell, so this page carries its own canvas background.
export default function NotFound() {
  return (
    <div className="site">
      <main id="main">
        <NotFoundFrame bare />
      </main>
    </div>
  );
}
