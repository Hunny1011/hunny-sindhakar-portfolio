"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" className="btn btn--sm" onClick={() => window.print()}>
      <Printer aria-hidden /> Print / save as PDF
    </button>
  );
}
