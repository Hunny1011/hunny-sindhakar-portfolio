import Link from "next/link";
import { notFound } from "next/navigation";
import { RowForm } from "@/components/admin/row-form";
import { requireAdmin } from "@/lib/admin/auth";
import { collections, isCollectionKey, type Collection, type Field } from "@/lib/admin/collections";
import { admin } from "@/lib/admin/path";

export default async function EditRowPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection: key, id } = await params;
  if (!isCollectionKey(key)) notFound();
  const c: Collection = collections[key];
  const { supabase } = await requireAdmin();

  let row: Record<string, unknown> = key === "projects" ? { status: "draft", kind: "case-study" } : {};
  if (id !== "new") {
    const { data } = await supabase.from(c.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data;
  }

  const title = id === "new" ? `New ${c.singular.toLowerCase()}` : String(row[c.titleField] ?? c.singular);
  const folder = key === "projects" ? `projects/${row.slug ?? "new"}` : key;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-zinc-500">
        <Link href={admin(`/c/${key}`)} className="underline">
          {c.title}
        </Link>{" "}
        / {title}
      </nav>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {key === "projects" && row.slug && row.status === "published" ? (
          <a href={`/work/${row.slug}`} target="_blank" rel="noopener" className="admin-btn">
            View live ↗
          </a>
        ) : null}
      </header>
      <RowForm collectionKey={key} fields={c.fields as Field[]} row={row} id={id === "new" ? null : id} folder={folder} />
    </div>
  );
}
