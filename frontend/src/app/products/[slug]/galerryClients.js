"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function GalleryClient({ images = [], alt = "Produit" }) {
  const valid = images.filter(Boolean);
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  const prev = useCallback(
    () => setI((v) => (v - 1 + valid.length) % valid.length),
    [valid.length]
  );
  const next = useCallback(
    () => setI((v) => (v + 1) % valid.length),
    [valid.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  if (!valid.length) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
        Pas d’image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
        onClick={() => {
          setI(0);
          setOpen(true);
        }}
        aria-label="Ouvrir la galerie"
      >
        <Image
          src={valid[0]}
          alt={alt}
          fill
          priority
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          Voir les images
        </span>
      </button>

      {valid.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {valid.slice(0, 10).map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setI(idx);
                setOpen(true);
              }}
              className={`relative aspect-square overflow-hidden rounded-xl border bg-slate-100 ${
                idx === i
                  ? "border-brand-500 ring-2 ring-brand-500/30"
                  : "border-slate-200"
              }`}
              aria-label={`Ouvrir image ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} ${idx + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black">
              <Image
                src={valid[i]}
                alt={`${alt} agrandie`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {valid.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm hover:bg-white"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm hover:bg-white"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm hover:bg-white"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
