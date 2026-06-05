"use client";

import { MorphBar } from "@/components/ui/morph-bar";

export default function Example() {
  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl edge">
      <MorphBar
        brand="byronwade/ui"
        items={[
          { id: "home", label: "Home", active: true },
          { id: "docs", label: "Docs" },
          { id: "catalog", label: "Catalog" },
          { id: "pricing", label: "Pricing" },
        ]}
        panel={
          <div className="grid grid-cols-3 gap-4">
            {["Primitives", "Composites", "Patterns"].map((g) => (
              <div key={g} className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{g}</p>
                <p className="text-[13px] text-muted-foreground">Browse {g.toLowerCase()} →</p>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}
