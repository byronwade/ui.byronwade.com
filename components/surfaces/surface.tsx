import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SurfaceId } from "@/lib/surfaces";

type SurfaceProps = {
  id: SurfaceId;
  children: ReactNode;
  className?: string;
};

/** Marks a composition with a Meridian surface lane (`data-surface`). */
function Surface({ id, children, className }: SurfaceProps) {
  return (
    <div data-surface={id} data-slot="surface" className={cn(className)}>
      {children}
    </div>
  );
}

export { Surface };
export type { SurfaceProps };
