"use client";

import * as React from "react";
import { LayoutGrid } from "lucide-react";
import { Bloom, type BloomPlacement } from "@/components/ui/bloom";

const PLACEMENTS: BloomPlacement[] = ["top", "bottom", "right", "bottom-end"];

export default function Example() {
  const [placement, setPlacement] = React.useState<BloomPlacement>("bottom");
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-[320px] flex-col items-center gap-6 rounded-xl border border-border p-8">
      {/* Placement switcher */}
      <div className="flex flex-wrap justify-center gap-2">
        {PLACEMENTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setPlacement(p);
              setOpen(true);
            }}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              placement === p
                ? "border-brand bg-brand/10 text-brand"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Controlled Bloom */}
      <div className="flex flex-1 items-center justify-center">
        <Bloom
          open={open}
          onOpenChange={setOpen}
          placement={placement}
          tone="surface"
          size={360}
          bar={
            <span className="flex items-center gap-2">
              <LayoutGrid className="size-4" />
              {placement}
            </span>
          }
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Placement: <code className="rounded bg-muted px-1 py-0.5 text-xs">{placement}</code>
            </p>
            <p className="text-sm text-muted-foreground">
              Click a placement button above to see the panel bloom in a different direction.
            </p>
          </div>
        </Bloom>
      </div>
    </div>
  );
}
