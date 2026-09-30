import Link from "next/link";
import { notFound } from "next/navigation";
import { SortableList } from "@/components/admin/sortable-list";
import { requireAdmin } from "@/lib/admin/auth";
import { collections, isCollectionKey, type Collection } from "@/lib/admin/collections";
import { admin } from "@/lib/admin/path";

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: key } = await params;
  if (!isCollectionKey(key)) notFound();
  const c: Collection = collections[key];
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from(c.table)
    .select("*")
    .order(c.orderBy, { ascending: c.orderBy === "sort_order" });
  if (error) throw new Error(error.message);

  const items = (data ?? []).map((row: Record<string, unknown>) => {
    const hidden = row.status === "draft" || row.visible === false || row.enabled === false;
    return {
      id: String(row.id),
      title: String(row[c.titleField] ?? "Untitled"),
      subtitle: c.subtitleField ? String(row[c.subtitleField] ?? "") : undefined,
      badge: row.status ? String(row.status) : hidden ? "hidden" : row.featured ? "featured" : undefined,
      muted: hidden,
    };
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{c.title}</h1>
          <p className="text-sm text-zinc-500">{c.description}</p>
        </div>
        <Link href={admin(`/c/${key}/new`)} className="admin-btn-primary">
          + New {c.singular.toLowerCase()}
        </Link>
      </header>
      <SortableList collectionKey={key} items={items} sortable={c.sortable} />
    </div>
  );
}
