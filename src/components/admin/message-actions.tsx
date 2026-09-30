"use client";

import { useTransition } from "react";
import { deleteMessage, updateMessageStatus } from "@/lib/admin/actions";
import type { Message } from "@/lib/types";

export function MessageActions({ id, status, email }: { id: string; status: Message["status"]; email: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <a href={`mailto:${email}`} className="admin-btn-primary">
        Reply
      </a>
      <label className="sr-only" htmlFor={`status-${id}`}>
        Status
      </label>
      <select
        id={`status-${id}`}
        className="admin-input w-auto"
        value={status}
        disabled={pending}
        onChange={(e) => start(() => void updateMessageStatus(id, e.target.value as Message["status"]))}
      >
        <option value="new">New</option>
        <option value="replied">Replied</option>
        <option value="closed">Closed</option>
      </select>
      <button
        className="admin-btn-danger ml-auto"
        disabled={pending}
        onClick={() => confirm("Delete this message?") && start(() => void deleteMessage(id))}
      >
        Delete
      </button>
    </div>
  );
}
