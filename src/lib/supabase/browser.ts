"use client";
import { createBrowserClient } from "@supabase/ssr";

// Browser client for the admin panel (login, direct-to-storage uploads). Uses the admin's session.
export function createBrowserSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}
