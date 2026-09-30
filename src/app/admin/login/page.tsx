import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { admin } from "@/lib/admin/path";
import { createSessionClient } from "@/lib/supabase/server";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && !error) redirect(admin());
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-amber-400 font-semibold text-zinc-900">HS</span>
          <div>
            <h1 className="text-lg font-semibold">Portfolio admin</h1>
            <p className="text-sm text-zinc-500">Sign in to edit your site</p>
          </div>
        </div>
        {error === "not-admin" && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">This account does not have admin access.</p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
