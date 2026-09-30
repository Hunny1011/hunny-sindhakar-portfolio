"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { track } from "@/lib/analytics";

export function CopyEmail({ email, className = "btn btn--sm", from }: { email: string; className?: string; from: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        } catch {
          window.location.href = `mailto:${email}`;
        }
        track("copy_email", { from });
      }}
    >
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      <span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span>
    </button>
  );
}
