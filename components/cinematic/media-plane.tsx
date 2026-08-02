import { cn } from "@/lib/utils";

type MediaPlaneProps = {
  className?: string;
};

/** Full-bleed atmospheric plane — cinematic styling, no animation. */
function MediaPlane({ className }: MediaPlaneProps) {
  return (
    <div
      aria-hidden
      data-slot="media-plane"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <div className="absolute inset-0 cinema-light" />
      <div className="absolute inset-0 bg-grid opacity-[0.35]" />
      <div className="absolute inset-0 cinema-grain" />
      <div className="absolute inset-0 cinema-veil" />
    </div>
  );
}

export { MediaPlane };
export type { MediaPlaneProps };
