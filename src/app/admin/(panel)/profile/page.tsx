import { PasswordForm } from "@/components/admin/password-form";
import { RowForm } from "@/components/admin/row-form";
import { saveProfile } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { profileFields } from "@/lib/admin/collections";

export default async function ProfilePage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).single();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-zinc-500">Name, bio, availability, photo and resume used across the whole site.</p>
      </header>
      <RowForm collectionKey="profile" fields={profileFields} row={data ?? {}} id="1" folder="profile" save={saveProfile} />
      <PasswordForm />
    </div>
  );
}
