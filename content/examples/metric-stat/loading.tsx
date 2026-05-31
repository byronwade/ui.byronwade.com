"use client";

import { useState } from "react";
import { MetricStat } from "@/components/metric-stat";
import { Loader2 } from "lucide-react";

function SkeletonValue() {
  return <span className="inline-block h-8 w-20 animate-pulse rounded-md bg-muted" />;
}

export default function Example() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-8">
        {loaded ? (
          <>
            <MetricStat
              label="Downloads"
              value="58,200"
              delta={{ value: "+22.1%", direction: "up" }}
            />
            <MetricStat
              label="Open Rate"
              value="34.6%"
              delta={{ value: "-1.0%", direction: "down" }}
            />
            <MetricStat
              label="NPS Score"
              value="72"
              delta={{ value: "+4", direction: "up" }}
            />
          </>
        ) : (
          <>
            <MetricStat label="Downloads" value={<SkeletonValue />} />
            <MetricStat label="Open Rate" value={<SkeletonValue />} />
            <MetricStat label="NPS Score" value={<SkeletonValue />} />
          </>
        )}
      </div>
      <button
        onClick={() => setLoaded((v) => !v)}
        className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted"
      >
        {loaded ? "Reset" : <><Loader2 className="size-3.5 animate-spin" /> Simulate load</>}
      </button>
    </div>
  );
}
