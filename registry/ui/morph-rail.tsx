"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MorphSurface } from "@/components/ui/morph-surface";

export interface MorphRailItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Content shown when this item is active. */
  panel: React.ReactNode;
}

export interface MorphRailProps {
  items: MorphRailItem[];
  /** Expanded width in px (content panel + rail). */
  expandedWidth?: number;
  navLabel?: string;
  className?: string;
}

/** A right icon rail (activity-bar style) that blooms a wide labeled panel to
 *  its left via the morph technique (`placement="right"`, `grow="width"`). The
 *  rail re-appears pinned to the right edge of the bloomed panel. */
export function MorphRail({
  items,
  expandedWidth = 360,
  navLabel = "Activity rail",
  className,
}: MorphRailProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const open = activeId !== null;
  const activeItem = items.find((i) => i.id === activeId) ?? null;

  const Rail = (
    <div className="flex h-full w-14 flex-col items-center gap-1 p-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            aria-expanded={open && activeId === item.id}
            onClick={() => setActiveId((cur) => (cur === item.id ? null : item.id))}
            className={cn(
              "grid size-9 place-items-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              open && activeId === item.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );

  return (
    <MorphSurface
      open={open}
      onOpenChange={(o) => {
        if (!o) setActiveId(null);
      }}
      placement="right"
      grow="width"
      navLabel={navLabel}
      size={{ w: expandedWidth }}
      className={cn("h-full border-l border-border bg-card", className)}
      collapsed={Rail}
      panel={
        <div className="flex h-full" style={{ width: expandedWidth }}>
          <div className="min-w-0 flex-1 overflow-auto border-r border-border p-4">
            {activeItem ? (
              <>
                <p className="mb-2 text-sm font-medium tracking-tight">{activeItem.label}</p>
                {activeItem.panel}
              </>
            ) : null}
          </div>
          {Rail}
        </div>
      }
    />
  );
}
