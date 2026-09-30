import { AdminNav } from "@/components/admin/nav";
import { ToastProvider } from "@/components/admin/toast";
import { requireAdmin } from "@/lib/admin/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user, supabase } = await requireAdmin();
  const { count } = await supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", "new");
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <AdminNav email={user.email ?? ""} newMessages={count ?? 0} />
      <ToastProvider>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </ToastProvider>
    </div>
  );
}
