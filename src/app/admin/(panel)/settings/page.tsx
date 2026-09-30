import { RowForm } from "@/components/admin/row-form";
import { saveSettings } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { settingsFields } from "@/lib/admin/collections";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("key,value");
  const row = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Settings & SEO</h1>
        <p className="text-sm text-zinc-500">Hero text, default search snippet and the Ask-AI prompt.</p>
      </header>
      <RowForm
        collectionKey="settings"
        fields={settingsFields}
        row={row}
        id="settings"
        folder="settings"
        save={saveSettings as (v: Record<string, unknown>) => ReturnType<typeof saveSettings>}
      />
    </div>
  );
}
