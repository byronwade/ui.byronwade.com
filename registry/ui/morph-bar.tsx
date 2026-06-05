"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MorphSurface } from "@/components/ui/morph-surface";

export interface MorphBarItem {
  id: string;
  label: string;
  href?: string;
  onSelect?: () => void;
  active?: boolean;
}

export interface MorphBarProps {
  brand: React.ReactNode;
  items: MorphBarItem[];
  /** Content bloomed below the bar (mega-menu / search / command). */
  panel: React.ReactNode;
  /** Open height in px of the bloomed panel (not including the bar row). */
  panelHeight?: number;
  navLabel?: string;
  className?: string;
}

/** A full-width top navigation bar that blooms a panel DOWN via the morph
 *  technique (`placement="top"`, `grow="height"`). */
export function MorphBar({
  brand,
  items,
  panel,
  panelHeight = 272,
  navLabel = "Primary",
  className,
}: MorphBarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <nav
      aria-label={navLabel}
      className={cn("w-full border-b border-border bg-card", className)}
    >
      {/* The bar row — rendered once for accessibility and layout. */}
      <div className="flex h-14 items-center justify-between gap-4 px-4">
        <span className="text-sm font-medium tracking-tight">{brand}</span>
        <div className="flex items-center gap-2">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href ?? "#"}
                  aria-current={item.active ? "page" : undefined}
                  onClick={(e) => {
                    if (item.onSelect) {
                      e.preventDefault();
                      item.onSelect();
                    }
                  }}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                    item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-8 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>

      {/* The morph bloom — grows a panel down from height=0 to panelHeight. */}
      <MorphSurface
        open={open}
        onOpenChange={setOpen}
        placement="top"
        grow="height"
        navLabel={`${navLabel} panel`}
        size={{ h: panelHeight }}
        collapsed={<div />}
        panel={
          <div className="border-t border-border p-4">{panel}</div>
        }
      />
    </nav>
  );
}
