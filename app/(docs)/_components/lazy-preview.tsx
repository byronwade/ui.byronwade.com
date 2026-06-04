"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Logical canvas the preview iframe renders at; the component is centered in it. */
const CANVAS_W = 1280;
const CANVAS_H = 820;

/**
 * Fit factor that maps a `content` box into a `box`, clamped. `max` caps how far
 * a small component is upscaled (so a lone button doesn't blow up); large
 * components scale down to fit. Returns null until both boxes are known.
 */
export function fitScale(
  box: { w: number; h: number },
  content: { w: number; h: number },
  opts?: { min?: number; max?: number },
): number | null {
  const { min = 0.05, max = 1.5 } = opts ?? {};
  if (!box.w || !box.h || !content.w || !content.h) return null;
  return Math.max(min, Math.min(max, Math.min(box.w / content.w, box.h / content.h)));
}

/**
 * A viewport-lazy preview: renders `placeholder` immediately and mounts an
 * `<iframe src>` only once the container nears the viewport. The iframe (a
 * `PreviewFit` page) posts back its content size, and we fit-scale + center it so
 * the component fills the frame regardless of its natural size. Degrades to the
 * placeholder alone when IntersectionObserver is unavailable (SSR / jsdom).
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
  const [content, setContent] = React.useState<{ w: number; h: number } | null>(null);

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

  // Receive the component's measured size from this card's own iframe.
  React.useEffect(() => {
    if (!show) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      const d = e.data as { __previewFit?: boolean; w?: number; h?: number };
      if (d?.__previewFit && typeof d.w === "number" && typeof d.h === "number") {
        setContent({ w: d.w, h: d.h });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [show]);

  const scale = box && content ? fitScale(box, content) : null;

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {(!show || scale === null) && placeholder}
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
            height: CANVAS_H,
            border: 0,
            transformOrigin: "center",
            transform: `translate(-50%, -50%) scale(${scale ?? 0})`,
            opacity: scale === null ? 0 : 1,
            transition: "opacity 200ms ease",
          }}
          className="pointer-events-none bg-background"
        />
      )}
    </div>
  );
}
