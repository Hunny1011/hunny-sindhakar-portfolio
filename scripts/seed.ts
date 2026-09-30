// Seeds Supabase with the initial content from seed-data.ts.
// Images are downloaded from Behance/Medium, converted to WebP and stored in the `media` bucket.
// Safe to re-run: rows are replaced, uploaded files are overwritten.
// Usage: pnpm db:seed
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import * as data from "./seed-data";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

async function upload(sourceUrl: string, path: string) {
  const res = await fetch(sourceUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`download failed ${res.status} ${sourceUrl}`);
  const input = Buffer.from(await res.arrayBuffer());
  const image = sharp(input).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 });
  const { data: buffer, info } = await image.toBuffer({ resolveWithObject: true });
  const { error } = await supabase.storage.from("media").upload(path, buffer, { contentType: "image/webp", upsert: true });
  if (error) throw error;
  const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  return { url, width: info.width, height: info.height };
}

async function replace(table: string, rows: object[]) {
  const del = await supabase.from(table).delete().not("id", "is", null);
  if (del.error) throw del.error;
  if (!rows.length) return;
  const ins = await supabase.from(table).insert(rows);
  if (ins.error) throw new Error(`${table}: ${ins.error.message}`);
  console.log(`${table}: ${rows.length}`);
}

async function main() {
  const p = await supabase.from("profile").upsert(data.profile);
  if (p.error) throw p.error;
  console.log("profile: 1");

  await replace("social_links", data.socialLinks);
  await replace("experiences", data.experiences);
  await replace("education", data.education);
  await replace("skills", data.skills);
  await replace("faqs", data.faqs);
  await replace("ai_links", data.aiLinks);

  const posts = [];
  for (const { cover_source, ...post } of data.posts) {
    const cover = await upload(cover_source, `posts/${post.url.split("-").pop()}.webp`);
    posts.push({ ...post, cover_url: cover.url });
  }
  await replace("posts", posts);

  const s = await supabase
    .from("site_settings")
    .upsert(Object.entries(data.settings).map(([key, value]) => ({ key, value })));
  if (s.error) throw s.error;
  console.log(`site_settings: ${Object.keys(data.settings).length}`);

  const projects = [];
  for (const [index, { images = [], behanceId: _b, ...project }] of data.projects.entries()) {
    const gallery = [];
    for (const [i, src] of images.entries()) {
      const img = await upload(src, `projects/${project.slug}/${String(i + 1).padStart(2, "0")}.webp`);
      gallery.push({ ...img, alt: `${project.title} — screen ${i + 1}` });
    }
    projects.push({
      featured: false,
      highlights: [],
      ...project,
      gallery,
      cover_url: gallery[0]?.url ?? null,
      cover_alt: gallery[0] ? `${project.title} — ${project.subtitle ?? project.category}` : null,
      sort_order: index + 1,
      status: "published",
      published_at: new Date().toISOString(),
    });
    console.log(`  ${project.slug}: ${gallery.length} images`);
  }
  await replace("projects", projects);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
