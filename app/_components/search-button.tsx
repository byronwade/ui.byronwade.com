"use client";

import * as React from "react";
import { Search } from "lucide-react";

/** Fires a CustomEvent that CommandPalette listens for. */
export function SearchButton() {
  function open() {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  }

  return (
    <button
      type="button"
      onClick={open}
      className={[
        "flex items-center gap-2 rounded-full border border-border bg-muted/50",
        "px-3 py-1.5 text-sm text-muted-foreground",
        "transition-colors hover:bg-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      ].join(" ")}
      aria-label="Search components and sections (⌘K)"
    >
      <Search className="size-3.5 shrink-0" />
      <span className="hidden sm:inline">Search…</span>
      <kbd className="hidden rounded border border-border bg-background px-1 font-mono text-[10px] sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
