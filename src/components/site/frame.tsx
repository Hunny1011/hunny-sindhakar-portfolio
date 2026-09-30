import Link from "next/link";
import type { ReactNode } from "react";
import { FrameGlyph } from "./icons";

/** Small mono label above a frame, like Figma's frame names. Decorative. */
export function FrameLabel({ name, size, className = "" }: { name: string; size?: string; className?: string }) {
  return (
    <p className={`frame-label ${className}`} aria-hidden>
      <FrameGlyph />
      {name}
      {size && <span className="frame-label__size">{size}</span>}
    </p>
  );
}

/** A page section that shows up as a child layer in the Layers panel. */
export function Block({
  id,
  layer,
  children,
  className = "",
  labelledBy,
}: {
  id: string;
  layer: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} data-layer={layer} className={`blk ${className}`} aria-labelledby={labelledBy ?? `${id}-title`}>
      {children}
    </section>
  );
}

export function BlockHead({
  id,
  eyebrow,
  title,
  lede,
  action,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="block-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`} className="h-section">
          {title}
        </h2>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {action}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => (
          <li key={item.name}>
            {item.href && i < items.length - 1 ? (
              <Link href={item.href}>{item.name}</Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
