import { cn } from "@/lib/utils";

type MediaPlaneProps = {
  className?: string;
};

/**
 * Full-bleed atmosphere as a single painted layer.
 * Avoids stacked blend modes / SVG filters that jank mobile scroll.
 */
function MediaPlane({ className }: MediaPlaneProps) {
  return (
    <div
      aria-hidden
      data-slot="media-plane"
      className={cn(
        "pointer-events-none absolute inset-0 cinema-plane",
        className,
      )}
    />
  );
}

export { MediaPlane };
export type { MediaPlaneProps };
