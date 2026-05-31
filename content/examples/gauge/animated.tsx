"use client";

import { useState } from "react";
import { Gauge, scoreTone } from "@/components/ui/gauge";

const PRESETS = [
  { label: "Critical", value: 18 },
  { label: "Poor", value: 42 },
  { label: "Fair", value: 67 },
  { label: "Good", value: 84 },
  { label: "Excellent", value: 97 },
];

export default function Example() {
  const [value, setValue] = useState(67);
  const tone = scoreTone(value);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <Gauge value={value} tone={tone} label={PRESETS.find((p) => p.value === value)?.label ?? "Score"} size={180} />

      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => setValue(p.value)}
            className={
              "rounded-full border px-4 py-1.5 text-sm transition-colors " +
              (value === p.value
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:bg-muted")
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>Custom: {value}</span>
          <span>100</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-foreground"
        />
      </div>
    </div>
  );
}
