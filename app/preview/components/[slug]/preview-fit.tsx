"use client";

import * as React from "react";

/**
 * Wraps a component preview, centers it on a fixed canvas, and reports its
 * measured natural size to the parent window (the catalog card) via postMessage
 * so the card can fit-scale the iframe — each component fills its card regardless
 * of its natural size, instead of a one-size-fits-all zoom.
 */
export function PreviewFit({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const post = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      window.parent?.postMessage(
        { __previewFit: true, w: Math.ceil(r.width), h: Math.ceil(r.height) },
        "*",
      );
    };

    post();
    // Re-measure after async layout (fonts, images, charts mounting).
    const timers = [120, 400, 900].map((ms) => setTimeout(post, ms));
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(post) : null;
    ro?.observe(el);

    return () => {
      ro?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="grid min-h-dvh place-items-center bg-background p-4">
      <div ref={ref} className="inline-flex w-max max-w-none">
        {children}
      </div>
    </div>
  );
}
