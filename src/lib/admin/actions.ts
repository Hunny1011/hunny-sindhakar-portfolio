"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/data";
import { collections, isCollectionKey, type Field } from "./collections";
import { requireAdmin } from "./auth";

export type SaveResult = { ok: boolean; error?: string; id?: string };

function publish() {
  // Expire cached content now so the next visit renders fresh data, and refresh generated files.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

function coerce(field: Field, raw: unknown) {
  const value = typeof raw === "string" ? raw.trim() : raw;
  switch (field.type) {
    case "boolean":
      return Boolean(value);
    case "number":
      return value === "" || value == null ? null : Number(value);
    case "list":
      return String(value ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    case "json":
      if (value === "" || value == null) return [];
      return typeof value === "string" ? JSON.parse(value) : value;
    case "date":
      return value ? String(value) : null;
    default:
      return value === "" ? null : value;
  }
}

export async function saveRow(key: string, id: string | null, values: Record<string, unknown>): Promise<SaveResult> {
  if (!isCollectionKey(key)) return { ok: false, error: "Unknown collection" };
  const { supabase } = await requireAdmin();
  const collection = collections[key];

  const row: Record<string, unknown> = {};
  try {
    for (const field of collection.fields as Field[]) {
      if (!(field.name in values)) continue;
      const v = coerce(field, values[field.name]);
      if (field.required && (v === null || v === "")) return { ok: false, error: `${field.label} is required` };
      row[field.name] = v;
    }
  } catch {
    return { ok: false, error: "One of the JSON fields is not valid JSON" };
  }
  if (key === "projects" && row.status === "published" && !values.published_at) row.published_at = new Date().toISOString();

  const query = id
    ? supabase.from(collection.table).update(row).eq("id", id).select("id").single()
    : supabase.from(collection.table).insert(row).select("id").single();
  const { data, error } = await query;
  if (error) return { ok: false, error: error.message };

  publish();
  return { ok: true, id: data.id };
}

export async function deleteRow(key: string, id: string): Promise<SaveResult> {
  if (!isCollectionKey(key)) return { ok: false, error: "Unknown collection" };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(collections[key].table).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  publish();
  return { ok: true };
}

export async function reorderRows(key: string, ids: string[]): Promise<SaveResult> {
  if (!isCollectionKey(key)) return { ok: false, error: "Unknown collection" };
  const { supabase } = await requireAdmin();
  const table = collections[key].table;
  const results = await Promise.all(
    ids.map((id, i) => supabase.from(table).update({ sort_order: i + 1 }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  publish();
  return { ok: true };
}

export async function saveProfile(values: Record<string, unknown>): Promise<SaveResult> {
  const { supabase } = await requireAdmin();
  const lists = ["alternate_names", "languages", "core_skills"];
  const row: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(values)) {
    if (lists.includes(k)) row[k] = String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
    else row[k] = typeof v === "string" && v.trim() === "" ? null : v;
  }
  const { error } = await supabase.from("profile").update(row).eq("id", 1);
  if (error) return { ok: false, error: error.message };
  publish();
  return { ok: true };
}

export async function saveSettings(values: Record<string, string>): Promise<SaveResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .upsert(Object.entries(values).map(([key, value]) => ({ key, value })));
  if (error) return { ok: false, error: error.message };
  publish();
  return { ok: true };
}

export async function updateMessageStatus(id: string, status: "new" | "replied" | "closed"): Promise<SaveResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("messages").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<SaveResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
}
