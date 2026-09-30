"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { reorderRows } from "@/lib/admin/actions";
import { useToast } from "./toast";
import { admin } from "@/lib/admin/path";

type Item = { id: string; title: string; subtitle?: string; badge?: string; muted?: boolean };

// List of rows with drag-and-drop (mouse) and move buttons (keyboard/touch) for ordering.
export function SortableList({ collectionKey, items, sortable }: { collectionKey: string; items: Item[]; sortable: boolean }) {
  const [list, setList] = useState(items);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const toast = useToast();

  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length || from === to) return;
    const next = [...list];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setList(next);
    setDirty(true);
  };

  const save = () =>
    start(async () => {
      const res = await reorderRows(collectionKey, list.map((i) => i.id));
      if (!res.ok) return toast(res.error ?? "Could not save order", "error");
      setDirty(false);
      toast("Order saved");
    });

  if (!list.length) return <p className="admin-card p-6 text-sm text-zinc-500">Nothing here yet.</p>;

  return (
    <div className="space-y-3">
      {sortable && dirty && (
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3 text-sm">
          New order not saved yet.
          <button className="admin-btn-primary ml-auto" onClick={save} disabled={pending}>
            {pending ? "Saving…" : "Save order"}
          </button>
        </div>
      )}
      <ul className="admin-card divide-y divide-zinc-100">
        {list.map((item, i) => (
          <li
            key={item.id}
            draggable={sortable}
            onDragStart={() => setDragging(i)}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragging !== null && dragging !== i) {
                move(dragging, i);
                setDragging(i);
              }
            }}
            onDragEnd={() => setDragging(null)}
            className={`flex items-center gap-3 p-3 sm:p-4 ${dragging === i ? "bg-amber-50" : ""}`}
          >
            {sortable && (
              <span aria-hidden className="hidden cursor-grab select-none text-zinc-400 sm:inline">
                ⋮⋮
              </span>
            )}
            <Link href={admin(`/c/${collectionKey}/${item.id}`)} className="min-w-0 flex-1">
              <span className={`block truncate font-medium ${item.muted ? "text-zinc-400" : ""}`}>{item.title}</span>
              {item.subtitle && <span className="block truncate text-xs text-zinc-500">{item.subtitle}</span>}
            </Link>
            {item.badge && <span className="hidden rounded-full bg-zinc-100 px-2 py-0.5 text-xs sm:inline">{item.badge}</span>}
            {sortable && (
              <span className="flex gap-1">
                <button className="admin-btn px-2" aria-label={`Move ${item.title} up`} onClick={() => move(i, i - 1)} disabled={i === 0}>
                  ↑
                </button>
                <button
                  className="admin-btn px-2"
                  aria-label={`Move ${item.title} down`}
                  onClick={() => move(i, i + 1)}
                  disabled={i === list.length - 1}
                >
                  ↓
                </button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
