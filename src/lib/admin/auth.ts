import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { admin } from "@/lib/admin/path";

// Returns the session client for a signed-in admin, or redirects to the login page.
export async function requireAdmin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(admin("/login"));

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect(admin("/login?error=not-admin"));

  return { supabase, user };
}
