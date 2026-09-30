"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/types";

// Case-study gallery with an accessible lightbox: native <dialog> (focus trap + Esc),
// arrow keys, swipe on touch, and focus returns to the thumbnail that opened it.
export function Gallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const touch = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const n = images.length;
  const go = (d: number) => setIndex((i) => (i + d + n) % n);

  const open = (i: number, btn: HTMLButtonElement) => {
    opener.current = btn;
    setIndex(i);
    dialog.current?.showModal();
  };

  const img = images[index];

  return (
    <>
      <ul className="gallery">
        {images.map((im, i) => (
          <li key={im.url} data-wide={im.width / im.height > 2}>
            <button type="button" onClick={(e) => open(i, e.currentTarget)} aria-label={`Open image ${i + 1} of ${n}: ${im.alt}`}>
              <span className="gallery__n" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <Image
                src={im.url}
                alt={im.alt}
                width={im.width}
                height={im.height}
                sizes={i === 0 ? "(min-width: 1280px) 1000px, 100vw" : "(min-width: 1024px) 500px, 100vw"}
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${title} gallery`}
        onClose={() => opener.current?.focus()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        <div className="lightbox__bar">
          <span aria-live="polite">
            {index + 1} / {n} — {img?.alt}
          </span>
          <button type="button" className="lb-btn" onClick={() => dialog.current?.close()} aria-label="Close gallery" autoFocus>
            <X aria-hidden />
          </button>
        </div>
        <div
          className="lightbox__stage"
          onPointerDown={(e) => (touch.current = e.pointerType === "mouse" ? null : e.clientX)}
          onPointerUp={(e) => {
            if (touch.current === null) return;
            const dx = e.clientX - touch.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          {img && (
            <Image key={img.url} src={img.url} alt={img.alt} fill sizes="100vw" />
          )}
        </div>
        {n > 1 && (
          <div className="lightbox__nav">
            <button type="button" className="lb-btn" onClick={() => go(-1)} aria-label="Previous image">
              <ChevronLeft aria-hidden />
            </button>
            <button type="button" className="lb-btn" onClick={() => go(1)} aria-label="Next image">
              <ChevronRight aria-hidden />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
