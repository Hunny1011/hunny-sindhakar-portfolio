"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";

// Uploads a file straight from the browser to the public `media` bucket (RLS: admins only).
// Returns the public URL plus pixel size for images.
export async function uploadMedia(file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safe = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  const path = `${folder}/${Date.now()}-${safe}.${ext}`;
  const supabase = createBrowserSupabase();
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;

  let width = 0;
  let height = 0;
  if (file.type.startsWith("image/")) {
    const bitmap = await createImageBitmap(file);
    width = bitmap.width;
    height = bitmap.height;
    bitmap.close();
  }
  return { url, width, height };
}
