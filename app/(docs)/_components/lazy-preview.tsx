"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A viewport-lazy preview: renders `placeholder` immediately and mounts a scaled
 * `<iframe src>` only once the container nears the viewport. Degrades to the
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
          className="pointer-events-none absolute left-0 top-0 h-[320%] w-[320%] origin-top-left scale-[0.3125] border-0 bg-background"
        />
      )}
    </div>
  );
}
