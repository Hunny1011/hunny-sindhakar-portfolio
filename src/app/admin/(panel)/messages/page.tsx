import { MessageActions } from "@/components/admin/message-actions";
import { requireAdmin } from "@/lib/admin/auth";
import type { Message } from "@/lib/types";

const intentLabel = { hiring: "Hiring", freelance: "Freelance project", hello: "Just saying hi" };

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  const messages = (data ?? []) as Message[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-zinc-500">Submissions from the contact form.</p>
      </header>
      {messages.length === 0 && <p className="admin-card p-6 text-sm text-zinc-500">No messages yet.</p>}
      <ul className="space-y-4">
        {messages.map((m) => (
          <li key={m.id} className={`admin-card p-5 ${m.status === "new" ? "border-amber-300" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{m.name}</p>
                <a href={`mailto:${m.email}`} className="text-sm underline">
                  {m.email}
                </a>
              </div>
              <div className="text-right text-xs text-zinc-500">
                <p className="font-medium text-zinc-700">{intentLabel[m.intent]}</p>
                <time>{new Date(m.created_at).toLocaleString("en-IN")}</time>
              </div>
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap">{m.message}</p>
            <MessageActions id={m.id} status={m.status} email={m.email} />
          </li>
        ))}
      </ul>
    </div>
  );
}
