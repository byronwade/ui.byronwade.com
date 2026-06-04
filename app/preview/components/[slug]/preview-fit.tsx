"use client";

import * as React from "react";

/**
 * Wraps a component preview at the iframe's fixed canvas width (so full-bleed
 * components lay out correctly — no shrink-wrap collapse) and reports its
 * measured height to the parent card via postMessage, so the card can scale tall
 * components down to fit instead of center-clipping them.
 */
export function PreviewFit({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const post = () => {
      const h = el.getBoundingClientRect().height;
      if (h) window.parent?.postMessage({ __previewFit: true, h: Math.ceil(h) }, "*");
    };

    post();
    // Re-measure after async layout (fonts, images, charts, motion).
    const timers = [120, 400, 900].map((ms) => setTimeout(post, ms));
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(post) : null;
    ro?.observe(el);

    return () => {
      ro?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="bg-background p-6">
      <div ref={ref}>{children}</div>
    </div>
  );
}
