"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Fixed logical canvas the preview iframe renders at — matches the card's 4:3
 *  aspect so scaling fills the card exactly. The preview page centers content in
 *  it (flex), so components sit centered, not top-anchored. */
const CANVAS_W = 540;
const CANVAS_H = 405;

/**
 * A preview iframe that loads PREEMPTIVELY — it mounts well before the card
 * enters the viewport (large rootMargin), so previews are ready by the time you
 * scroll to them rather than popping in. The fixed-aspect canvas is scaled to
 * fill the card; the placeholder shows until the iframe finishes loading, then it
 * fades in. Degrades to the placeholder when IntersectionObserver is unavailable.
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
  const [show, setShow] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);

  // Preemptive mount: load when within ~2 screens of the viewport, not just when in view.
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
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  // Measure the card width so the fixed canvas scales to fill it.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);

  const scale = width > 0 ? width / CANVAS_W : 0;

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {(!show || !loaded) && placeholder}
      {show && (
        <iframe
          src={src}
          title={title}
          aria-hidden
          tabIndex={-1}
          onLoad={() => setLoaded(true)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: CANVAS_W,
            height: CANVAS_H,
            border: 0,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            opacity: loaded ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
          className="pointer-events-none bg-background"
        />
      )}
    </div>
  );
}
