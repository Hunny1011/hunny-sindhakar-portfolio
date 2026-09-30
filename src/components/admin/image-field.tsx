"use client";

import { useState } from "react";
import { uploadMedia } from "./upload";
import { useToast } from "./toast";

export function ImageField({
  name,
  value,
  onChange,
  folder,
  accept = "image/*",
}: {
  name: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const isImage = accept.startsWith("image");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await uploadMedia(file, folder);
      onChange(url);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload failed", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {value && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-20 w-28 rounded-lg border border-zinc-200 object-cover" />
      )}
      {value && !isImage && (
        <a href={value} target="_blank" rel="noopener" className="text-sm underline">
          Current file ↗
        </a>
      )}
      <label className="admin-btn">
        {busy ? "Uploading…" : value ? "Replace" : "Upload"}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          disabled={busy}
          aria-label={`Upload ${name}`}
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
      {value && (
        <button type="button" className="admin-btn-danger" onClick={() => onChange(null)}>
          Remove
        </button>
      )}
      <input
        className="admin-input min-w-0 flex-1 basis-full"
        placeholder="…or paste a URL"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      />
    </div>
  );
}
