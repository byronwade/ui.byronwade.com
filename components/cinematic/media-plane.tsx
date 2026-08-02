import { cn } from "@/lib/utils";

type MediaPlaneProps = {
  className?: string;
  drift?: boolean;
};

/**
 * Full-bleed atmospheric plane — the Meridian stand-in for product video
 * until real footage lands. Light fields + grain, never a card.
 */
function MediaPlane({ className, drift = true }: MediaPlaneProps) {
  return (
    <div
      aria-hidden
      data-slot="media-plane"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <div
        className={cn(
          "absolute inset-[-8%] cinema-light",
          drift && "cinema-drift",
        )}
      />
      <div className="absolute inset-0 bg-grid opacity-[0.35]" />
      <div className="absolute inset-0 cinema-grain" />
      <div className="absolute inset-0 cinema-veil" />
    </div>
  );
}

export { MediaPlane };
export type { MediaPlaneProps };
