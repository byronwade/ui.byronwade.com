"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A viewport-lazy preview: renders `placeholder` immediately and mounts a scaled
 * `<iframe src>` only once the container nears the viewport. The iframe renders a
 * full-width canvas (so full-bleed components lay out correctly) that we scale
 * down by `zoom` to fit the card — a consistent zoom across components rather
 * than a per-component fit. Degrades to the placeholder alone when
 * IntersectionObserver is unavailable (SSR / jsdom).
 */
export function LazyPreview({
  src,
  title,
  placeholder,
  className,
  zoom = 0.6,
}: {
  src: string;
  title: string;
  placeholder?: React.ReactNode;
  className?: string;
  /** Scale the iframed canvas so its content fills the frame (smaller = more zoomed-out). */
  zoom?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);

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

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {placeholder}
      {show && (
        <iframe
          src={src}
          title={title}
          aria-hidden
          tabIndex={-1}
          loading="lazy"
          style={{ width: `${100 / zoom}%`, height: `${100 / zoom}%`, transform: `scale(${zoom})` }}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-background"
        />
      )}
    </div>
  );
}
