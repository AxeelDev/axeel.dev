"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { GalleryImage } from "@/features/content/types";

// The main screenshot plus any extra ones. Any of them opens full size; arrow keys move between them.
export type GalleryLabels = { viewFull: string; more: string; viewer: string; previous: string; next: string; close: string };
const view = (template: string, alt: string) => template.replace("{alt}", alt);

export function ProjectGallery({ main, caption, images, labels }: { main: React.ReactNode; caption?: string; images: GalleryImage[]; labels: GalleryLabels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const open = (at: number) => { setIndex(at); dialog.current?.showModal(); };
  const step = useCallback((by: number) => setIndex((current) => (current + by + images.length) % images.length), [images.length]);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "ArrowRight") step(1); if (event.key === "ArrowLeft") step(-1); };
    element.addEventListener("keydown", onKey);
    return () => element.removeEventListener("keydown", onKey);
  }, [step]);
  const current = images[index];
  return <>
    {images.length ? <button type="button" className="shot-open" onClick={() => open(0)} aria-label={view(labels.viewFull, images[0].alt)}>{main}</button> : main}
    {caption && <p className="shot-caption">{caption}</p>}
    {images.length > 1 && <ul className="gallery-grid" aria-label={labels.more}>{images.slice(1).map((image, i) => <li key={image.src}>
      <button type="button" onClick={() => open(i + 1)} aria-label={view(labels.viewFull, image.alt)}><img src={image.src} alt="" loading="lazy" decoding="async" /></button>
    </li>)}</ul>}
    <dialog ref={dialog} className="lightbox" aria-label={labels.viewer} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {current && <figure>
        <img src={current.src} alt={current.alt} />
        <figcaption><span>{index + 1} / {images.length}</span>{current.alt}</figcaption>
      </figure>}
      <div className="lightbox-controls">
        {images.length > 1 && <><button type="button" onClick={() => step(-1)} aria-label={labels.previous}><ArrowLeft size={18} /></button><button type="button" onClick={() => step(1)} aria-label={labels.next}><ArrowRight size={18} /></button></>}
        <button type="button" onClick={() => dialog.current?.close()} aria-label={labels.close}><X size={18} /></button>
      </div>
    </dialog>
  </>;
}
