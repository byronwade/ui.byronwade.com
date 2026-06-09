"use client";

import { cn } from "@/lib/utils";
import { Controls as ControlsPrimitive } from "@xyflow/react";
import { useCallback, type ComponentProps } from "react";

export type ControlsProps = ComponentProps<typeof ControlsPrimitive>;

/**
 * React Flow's `<Controls>` primitive renders its own panel element and only
 * forwards a fixed prop set (`className`, `aria-label`, …) — it does not spread
 * arbitrary DOM attributes, so a `data-slot` passed to it never reaches the DOM.
 * We wrap it in a layout-neutral (`display: contents`) host whose callback ref
 * tags the rendered panel with `data-slot="ai-controls"` so the part is
 * addressable like every other primitive in the system.
 */
export const Controls = ({ className, ...props }: ControlsProps) => {
  const tagPanel = useCallback((host: HTMLElement | null) => {
    host
      ?.querySelector(".react-flow__controls")
      ?.setAttribute("data-slot", "ai-controls");
  }, []);

  return (
    <div className="contents" data-slot="ai-controls-host" ref={tagPanel}>
      <ControlsPrimitive
        className={cn(
          "gap-px overflow-hidden rounded-md edge bg-card p-1 shadow-none!",
          "[&>button]:rounded-md [&>button]:border-none! [&>button]:bg-transparent! [&>button]:text-foreground [&>button]:hover:bg-secondary!",
          className
        )}
        {...props}
      />
    </div>
  );
};
