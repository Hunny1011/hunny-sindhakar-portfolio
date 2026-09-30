import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { admin } from "@/lib/admin/path";

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const [projects, drafts, messages, newMessages, profile] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("messages").select("id,name,intent,created_at,status").order("created_at", { ascending: false }).limit(5),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("profile").select("name,availability,availability_note,updated_at").eq("id", 1).single(),
  ]);

  const stats = [
    { label: "Published projects", value: projects.count ?? 0, href: admin("/c/projects") },
    { label: "Drafts", value: drafts.count ?? 0, href: admin("/c/projects") },
    { label: "New messages", value: newMessages.count ?? 0, href: admin("/messages") },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Hi {profile.data?.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-zinc-500">Everything you save here goes live on the site within seconds.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="admin-card p-5 hover:border-zinc-300">
            <p className="text-3xl font-semibold">{s.value}</p>
            <p className="text-sm text-zinc-500">{s.label}</p>
          </Link>
        ))}
      </section>

      <section className="admin-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <h2 className="font-semibold">Availability</h2>
          <p className="text-sm text-zinc-500">
            {profile.data?.availability} · {profile.data?.availability_note ?? "—"}
          </p>
        </div>
        <Link href={admin("/profile")} className="admin-btn">
          Change
        </Link>
      </section>

      <section className="admin-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Latest messages</h2>
          <Link href={admin("/messages")} className="text-sm underline">
            All messages
          </Link>
        </div>
        {messages.data?.length ? (
          <ul className="divide-y divide-zinc-100 text-sm">
            {messages.data.map((m) => (
              <li key={m.id} className="flex justify-between gap-3 py-2">
                <span className="truncate">
                  {m.status === "new" && <span className="mr-2 inline-block size-2 rounded-full bg-amber-400" aria-label="new" />}
                  {m.name} · {m.intent}
                </span>
                <time className="shrink-0 text-zinc-500">{new Date(m.created_at).toLocaleDateString("en-IN")}</time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">No messages yet.</p>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {[
          ["Add a project", admin("/c/projects/new")],
          ["Edit profile & bio", admin("/profile")],
          ["Edit FAQ (AEO)", admin("/c/faqs")],
          ["SEO & Ask-AI prompt", admin("/settings")],
        ].map(([label, href]) => (
          <Link key={href} href={href} className="admin-card p-4 text-sm font-medium hover:border-zinc-300">
            {label} →
          </Link>
        ))}
      </section>
    </div>
  );
}
