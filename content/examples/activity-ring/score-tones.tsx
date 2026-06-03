"use client";

import { ActivityRing, scoreTone } from "@/components/ui/activity-ring";

export default function Example() {
  const scores = [32, 67, 91];
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 p-8">
      {scores.map((v) => (
        <ActivityRing key={v} value={v} tone={scoreTone(v)} label={scoreTone(v)} size={110} thickness={8} />
      ))}
    </div>
  );
}
