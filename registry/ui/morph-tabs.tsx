"use client";

import * as React from "react";
import { ChevronUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MorphSurface } from "@/components/ui/morph-surface";

export interface MorphTabsItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect?: () => void;
  active?: boolean;
}

export interface MorphTabsProps {
  items: MorphTabsItem[];
  /** Content bloomed UP above the tab row. */
  sheet: React.ReactNode;
  /** Open height in px (sheet + tab row). */
  sheetHeight?: number;
  navLabel?: string;
  className?: string;
}

/** A bottom tab bar that blooms a sheet UP via the morph technique
 *  (`placement="bottom"`, `grow="height"`). The tab row is the resting state and
 *  re-appears pinned to the bottom of the bloomed panel. */
export function MorphTabs({
  items,
  sheet,
  sheetHeight = 320,
  navLabel = "Tabs",
  className,
}: MorphTabsProps) {
  const [open, setOpen] = React.useState(false);

  const Row = (
    <div className="flex h-16 items-stretch justify-around gap-1 px-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={item.active ? "page" : undefined}
            onClick={() => item.onSelect?.()}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 rounded-md text-[11px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-5" />
            <span className="font-mono">{item.label}</span>
          </button>
        );
      })}
      <button
        type="button"
        aria-label="Open sheet"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid w-10 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronUp className="size-4" />
      </button>
    </div>
  );

  return (
    <MorphSurface
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
      grow="height"
      navLabel={navLabel}
      size={{ h: sheetHeight }}
      className={cn("border-t border-border bg-card", className)}
      collapsed={Row}
      panel={
        <div className="flex h-full flex-col">
          <div className="min-h-0 flex-1 overflow-auto p-4">{sheet}</div>
          <div className="border-t border-border">{Row}</div>
        </div>
      }
    />
  );
}
