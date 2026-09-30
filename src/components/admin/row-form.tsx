"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteRow, saveRow, type SaveResult } from "@/lib/admin/actions";
import type { Field } from "@/lib/admin/collections";
import type { GalleryImage } from "@/lib/types";
import { GalleryManager } from "./gallery-manager";
import { ImageField } from "./image-field";
import { useToast } from "./toast";
import { admin } from "@/lib/admin/path";

type Values = Record<string, unknown>;

// Turns DB values into form-friendly values (lists → lines, JSON → pretty text).
function toForm(fields: Field[], row: Values): Values {
  const out: Values = {};
  for (const f of fields) {
    const v = row[f.name];
    if (f.type === "list") out[f.name] = Array.isArray(v) ? v.join("\n") : "";
    else if (f.type === "json" && f.name !== "gallery") out[f.name] = JSON.stringify(v ?? [], null, 2);
    else if (f.type === "boolean") out[f.name] = Boolean(v ?? (f.name === "visible" || f.name === "enabled"));
    else if (f.type === "date") out[f.name] = typeof v === "string" ? v.slice(0, 10) : "";
    else out[f.name] = v ?? (f.name === "gallery" ? [] : "");
  }
  return out;
}

export function RowForm({
  collectionKey,
  fields,
  row,
  id,
  folder,
  save,
}: {
  collectionKey: string;
  fields: Field[];
  row: Values;
  id: string | null;
  folder: string;
  /** Custom save action for single-row forms (profile, settings). Hides Back/Delete. */
  save?: (values: Values) => Promise<SaveResult>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<Values>(() => toForm(fields, row));
  const [pending, start] = useTransition();
  const set = (name: string, v: unknown) => setValues((s) => ({ ...s, [name]: v }));

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = save ? await save(values) : await saveRow(collectionKey, id, { ...values, published_at: row.published_at });
      if (!res.ok) return toast(res.error ?? "Save failed", "error");
      toast("Saved — live site updated");
      if (save) return router.refresh();
      if (!id && res.id) router.replace(admin(`/c/${collectionKey}/${res.id}`));
      else router.refresh();
    });
  }

  function onDelete() {
    if (!id || !confirm("Delete this item permanently?")) return;
    start(async () => {
      const res = await deleteRow(collectionKey, id);
      if (!res.ok) return toast(res.error ?? "Delete failed", "error");
      toast("Deleted");
      router.replace(admin(`/c/${collectionKey}`));
    });
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="admin-card grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        {fields.map((f) => {
          const inputId = `f-${f.name}`;
          const v = values[f.name];
          return (
            <div key={f.name} className={f.wide || f.type === "textarea" || f.type === "json" ? "sm:col-span-2" : ""}>
              {f.type === "boolean" ? (
                <label className="flex min-h-10 items-center gap-3 text-sm font-medium">
                  <input
                    id={inputId}
                    type="checkbox"
                    className="size-5 accent-amber-500"
                    checked={Boolean(v)}
                    onChange={(e) => set(f.name, e.target.checked)}
                  />
                  {f.label}
                </label>
              ) : (
                <>
                  <label htmlFor={inputId} className="mb-1 block text-sm font-medium">
                    {f.label}
                    {f.required && <span className="text-red-600"> *</span>}
                  </label>
                  {f.name === "gallery" ? (
                    <GalleryManager
                      value={(v as GalleryImage[]) ?? []}
                      onChange={(imgs) => set(f.name, imgs)}
                      folder={folder}
                      title={String(values.title ?? "Project")}
                    />
                  ) : f.type === "image" || f.type === "file" ? (
                    <ImageField
                      name={f.label}
                      value={(v as string) || null}
                      onChange={(url) => set(f.name, url ?? "")}
                      folder={folder}
                      accept={f.type === "file" ? "application/pdf" : "image/*"}
                    />
                  ) : f.type === "select" ? (
                    <select id={inputId} className="admin-input" value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)}>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "textarea" || f.type === "list" || f.type === "json" || f.type === "richtext" ? (
                    <textarea
                      id={inputId}
                      className={`admin-input ${f.type === "json" ? "font-mono text-xs" : ""}`}
                      rows={f.type === "list" ? 4 : 5}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={String(v ?? "")}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  ) : (
                    <input
                      id={inputId}
                      className="admin-input"
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={String(v ?? "")}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  )}
                  {f.help && <p className="mt-1 text-xs text-zinc-500">{f.help}</p>}
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-zinc-200 bg-zinc-50/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
        <button className="admin-btn-primary" disabled={pending}>
          {pending ? "Saving…" : "Save & publish"}
        </button>
        {!save && (
          <button type="button" className="admin-btn" onClick={() => router.push(admin(`/c/${collectionKey}`))}>
            Back
          </button>
        )}
        {id && !save && (
          <button type="button" className="admin-btn-danger ml-auto" onClick={onDelete} disabled={pending}>
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
