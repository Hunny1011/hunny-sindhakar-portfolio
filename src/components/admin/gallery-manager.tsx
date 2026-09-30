"use client";

import { useState } from "react";
import type { GalleryImage } from "@/lib/types";
import { uploadMedia } from "./upload";
import { useToast } from "./toast";

// Upload, reorder, caption and remove project screens. The first image doubles as the default cover.
export function GalleryManager({
  value,
  onChange,
  folder,
  title,
}: {
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  folder: string;
  title: string;
}) {
  const [busy, setBusy] = useState(0);
  const toast = useToast();

  async function add(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    setBusy(list.length);
    const added: GalleryImage[] = [];
    for (const file of list) {
      try {
        const img = await uploadMedia(file, folder);
        added.push({ ...img, alt: `${title} — screen ${value.length + added.length + 1}` });
      } catch (e) {
        toast(e instanceof Error ? e.message : "Upload failed", "error");
      }
      setBusy((n) => n - 1);
    }
    onChange([...value, ...added]);
  }

  const move = (i: number, dir: -1 | 1) => {
    const next = [...value];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {value.map((img, i) => (
          <li key={img.url} className="admin-card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="aspect-[4/3] w-full bg-zinc-100 object-cover" />
            <div className="space-y-2 p-3">
              <input
                className="admin-input"
                aria-label={`Alt text for image ${i + 1}`}
                value={img.alt}
                onChange={(e) => onChange(value.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))}
              />
              <div className="flex gap-2">
                <button type="button" className="admin-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">
                  ←
                </button>
                <button type="button" className="admin-btn" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move later">
                  →
                </button>
                <button type="button" className="admin-btn-danger ml-auto" onClick={() => onChange(value.filter((_, k) => k !== i))}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <label className="admin-btn">
        {busy ? `Uploading ${busy}…` : "Add images"}
        <input type="file" accept="image/*" multiple className="sr-only" disabled={busy > 0} onChange={(e) => add(e.target.files)} />
      </label>
    </div>
  );
}
