import { cn } from "@/lib/utils";

type MediaPlaneProps = {
  className?: string;
};

/** Lightweight theater wash — one gradient, no grid/blend/filter. */
function MediaPlane({ className }: MediaPlaneProps) {
  return (
    <div
      aria-hidden
      data-slot="media-plane"
      className={cn(
        "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_oklch,var(--brand)_18%,transparent),transparent_70%)]",
        className,
      )}
    />
  );
}

export { MediaPlane };
export type { MediaPlaneProps };
