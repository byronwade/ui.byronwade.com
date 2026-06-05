"use client";

import * as React from "react";
import { MorphSurface } from "@/components/ui/morph-surface";

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid w-full max-w-md gap-3 p-6">
      <MorphSurface
        open={open}
        onOpenChange={setOpen}
        placement="top"
        grow="height"
        navLabel="Demo"
        className="rounded-xl edge bg-card shadow-float"
        collapsed={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium outline-none"
          >
            Open panel
            <span className="font-mono text-xs text-muted-foreground">⌄</span>
          </button>
        }
        panel={
          <div className="p-4">
            <p className="px-1 pb-2 text-sm font-medium">Panel</p>
            <p className="px-1 text-[13px] leading-relaxed text-muted-foreground">
              The morph box bloomed open. Press Esc or click outside to close.
            </p>
          </div>
        }
      />
    </div>
  );
}
