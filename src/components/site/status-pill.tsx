import type { Availability } from "@/lib/types";

const LABEL: Record<Availability, string> = {
  open: "Available for work",
  freelance: "Available for freelance",
  busy: "Currently booked",
};

export function StatusPill({ availability, note }: { availability: Availability; note?: string | null }) {
  return (
    <span className="status-pill" data-status={availability} title={note ?? undefined}>
      <span className="status-pill__dot" aria-hidden />
      {note ?? LABEL[availability]}
    </span>
  );
}
