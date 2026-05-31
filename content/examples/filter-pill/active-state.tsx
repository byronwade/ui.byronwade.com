"use client";

import * as React from "react";
import { FilterPill } from "@/components/ui/filter-pill";
import { Tag, X } from "lucide-react";

const OPTIONS = ["All", "Documents", "Images", "Video", "Audio", "Archives"];

export default function Example() {
  const [selected, setSelected] = React.useState("All");

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        Selected: <span className="text-foreground">{selected}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => (
          <FilterPill
            key={option}
            aria-pressed={selected === option}
            onClick={() => setSelected(option)}
            className={
              selected === option
                ? "border-foreground bg-foreground text-background hover:bg-foreground/90"
                : undefined
            }
          >
            {option}
          </FilterPill>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Active filter with clear action
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterPill
            icon={<Tag className="size-3.5 text-muted-foreground" />}
            className="border-foreground bg-foreground text-background hover:bg-foreground/90"
          >
            Type: {selected}
          </FilterPill>
          <button
            type="button"
            onClick={() => setSelected("All")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-card transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
            aria-label="Clear filter"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
