"use client";

import { useEffect } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

// Keeps the admin's Supabase session cookie fresh while the panel is open
// (the browser client auto-refreshes the access token and rewrites the cookie).
export function SessionRefresher() {
  useEffect(() => {
    const supabase = createBrowserSupabase();
    void supabase.auth.getSession();
    const { data } = supabase.auth.onAuthStateChange(() => {});
    return () => data.subscription.unsubscribe();
  }, []);
  return null;
}
