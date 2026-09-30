"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ViewTracker({ event, params }: { event: string; params: Record<string, string> }) {
  const key = JSON.stringify(params);
  useEffect(() => {
    track(event, JSON.parse(key));
  }, [event, key]);
  return null;
}
