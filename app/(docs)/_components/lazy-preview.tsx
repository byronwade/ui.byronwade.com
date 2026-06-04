"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Fixed logical canvas width the preview iframe renders at (full-bleed fills it). */
const CANVAS_W = 860;
/** Height used before the iframe reports its real content height. */
const FALLBACK_H = 900;

/**
 * A viewport-lazy preview: renders `placeholder` immediately and mounts an
 * `<iframe src>` only once the container nears the viewport. The iframe (a
 * `PreviewFit` page) renders at a fixed canvas width — so full-bleed components
 * lay out correctly — and posts back its content height. We scale the canvas to
 * fit BOTH the card width and that height and center it, so normal components
 * fill the frame and tall ones shrink to fit instead of center-clipping.
 * Degrades to the placeholder alone when IntersectionObserver is unavailable.
 */
export function LazyPreview({
  src,
  title,
  placeholder,
  className,
}: {
  src: string;
  title: string;
  placeholder?: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [show, setShow] = React.useState(false);
  const [box, setBox] = React.useState<{ w: number; h: number } | null>(null);
  const [contentH, setContentH] = React.useState<number | null>(null);

  // Mount the iframe only when the card nears the viewport.
  React.useEffect(() => {
    if (show || typeof IntersectionObserver === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  // Track the card's pixel size so we can fit the component to it.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);

  // Receive the component's measured height from this card's own iframe.
  React.useEffect(() => {
    if (!show) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      const d = e.data as { __previewFit?: boolean; h?: number };
      if (d?.__previewFit && typeof d.h === "number" && d.h > 0) setContentH(d.h);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [show]);

  const canvasH = contentH ?? FALLBACK_H;
  const scale = box ? Math.min(box.w / CANVAS_W, box.h / canvasH) : null;
  const ready = scale !== null && contentH !== null;

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {(!show || !ready) && placeholder}
      {show && (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          aria-hidden
          tabIndex={-1}
          loading="lazy"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: CANVAS_W,
            height: canvasH,
            border: 0,
            transformOrigin: "center",
            transform: `translate(-50%, -50%) scale(${scale ?? 0})`,
            opacity: ready ? 1 : 0,
            transition: "opacity 200ms ease",
          }}
          className="pointer-events-none bg-background"
        />
      )}
    </div>
  );
}
