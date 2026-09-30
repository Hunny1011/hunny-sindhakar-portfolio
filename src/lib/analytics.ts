"use client";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

// Sends a custom event to Firebase/GA4 and tags the Clarity session. No-op when analytics is off.
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  window.clarity?.("event", event);
}
