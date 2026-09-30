import { createPublicClient } from "@/lib/supabase/public";

// Daily Vercel Cron ping so the free Supabase project never pauses for inactivity.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { error } = await createPublicClient().from("profile").select("id").limit(1);
  return Response.json({ ok: !error, at: new Date().toISOString() }, { status: error ? 500 : 200 });
}
