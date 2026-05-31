"use client";

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress";

const items = [
  {
    label: "Primary (default)",
    value: 72,
    indicator: "",
    track: "",
  },
  {
    label: "Success",
    value: 91,
    indicator: "bg-emerald-500",
    track: "bg-emerald-100 dark:bg-emerald-950",
  },
  {
    label: "Warning",
    value: 45,
    indicator: "bg-amber-500",
    track: "bg-amber-100 dark:bg-amber-950",
  },
  {
    label: "Destructive",
    value: 18,
    indicator: "bg-destructive",
    track: "bg-destructive/10",
  },
  {
    label: "Muted",
    value: 60,
    indicator: "bg-muted-foreground",
    track: "",
  },
];

export default function Example() {
  return (
    <div className="w-full max-w-sm space-y-6 p-6">
      {items.map(({ label, value, indicator, track }) => (
        <Progress key={label} value={value}>
          <ProgressLabel>{label}</ProgressLabel>
          <ProgressValue>{(f) => f}</ProgressValue>
          <ProgressTrack className={track || undefined}>
            <ProgressIndicator className={indicator || undefined} />
          </ProgressTrack>
        </Progress>
      ))}
    </div>
  );
}
