"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { useToast } from "./toast";

export function PasswordForm() {
  const toast = useToast();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password"));
    if (password !== data.get("confirm")) return toast("Passwords do not match", "error");
    setPending(true);
    const { error } = await createBrowserSupabase().auth.updateUser({ password });
    setPending(false);
    if (error) return toast(error.message, "error");
    form.reset();
    toast("Password changed");
  }

  return (
    <form onSubmit={onSubmit} className="admin-card grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6">
      <h2 className="font-semibold sm:col-span-3">Change password</h2>
      <label className="block text-sm font-medium">
        New password
        <input name="password" type="password" minLength={10} required autoComplete="new-password" className="admin-input mt-1" />
      </label>
      <label className="block text-sm font-medium">
        Confirm
        <input name="confirm" type="password" minLength={10} required autoComplete="new-password" className="admin-input mt-1" />
      </label>
      <button className="admin-btn-primary" disabled={pending}>
        {pending ? "Saving…" : "Update"}
      </button>
    </form>
  );
}
