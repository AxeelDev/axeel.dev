"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { GalleryImage } from "@/features/content/types";

// The main screenshot plus any extra ones. Any of them opens full size; arrow keys move between them.
export function ProjectGallery({ main, caption, images }: { main: React.ReactNode; caption?: string; images: GalleryImage[] }) {
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
    {images.length ? <button type="button" className="shot-open" onClick={() => open(0)} aria-label={`View ${images[0].alt} full size`}>{main}</button> : main}
    {caption && <p className="shot-caption">{caption}</p>}
    {images.length > 1 && <ul className="gallery-grid" aria-label="More screenshots">{images.slice(1).map((image, i) => <li key={image.src}>
      <button type="button" onClick={() => open(i + 1)} aria-label={`View full size: ${image.alt}`}><img src={image.src} alt="" loading="lazy" decoding="async" /></button>
    </li>)}</ul>}
    <dialog ref={dialog} className="lightbox" aria-label="Screenshot viewer" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {current && <figure>
        <img src={current.src} alt={current.alt} />
        <figcaption><span>{index + 1} / {images.length}</span>{current.alt}</figcaption>
      </figure>}
      <div className="lightbox-controls">
        {images.length > 1 && <><button type="button" onClick={() => step(-1)} aria-label="Previous screenshot"><ArrowLeft size={18} /></button><button type="button" onClick={() => step(1)} aria-label="Next screenshot"><ArrowRight size={18} /></button></>}
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close"><X size={18} /></button>
      </div>
    </dialog>
  </>;
}
