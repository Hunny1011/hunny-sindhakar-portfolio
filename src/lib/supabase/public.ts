import { createClient } from "@supabase/supabase-js";

// Cookie-less client for public, cacheable reads. RLS limits it to published content.
export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
