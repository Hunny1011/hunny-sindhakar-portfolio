import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NotFoundFrame({ bare = false }: { bare?: boolean }) {
  return (
    <div className={`nf ${bare ? "nf--bare" : ""}`}>
      <div>
        <p className="frame-label" aria-hidden>
          # Frame 404 <span className="frame-label__size">0 × 0</span>
        </p>
        <div className="nf__frame">
          <p className="nf__code">Error 404 · layer missing</p>
          <h1 className="nf__title">
            Frame <em>not found.</em>
          </h1>
          <p className="nf__text">This frame was moved, renamed or never made it off the sketchpad. Let’s get you back onto the canvas.</p>
          <div className="nf__row">
            <Link href="/" className="btn btn--honey">
              Back to home <ArrowRight aria-hidden />
            </Link>
            <Link href="/work" className="btn">
              Browse work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
