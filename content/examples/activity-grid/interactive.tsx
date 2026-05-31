"use client";

import { useState } from "react";
import { ActivityGrid } from "@/components/ui/activity-grid";

type Period = "week" | "month" | "quarter" | "year";

const PERIODS: { label: string; value: Period; columns: number; weeks: number }[] = [
  { label: "1W", value: "week", columns: 7, weeks: 1 },
  { label: "1M", value: "month", columns: 5, weeks: 5 },
  { label: "3M", value: "quarter", columns: 13, weeks: 13 },
  { label: "1Y", value: "year", columns: 52, weeks: 52 },
];

function generateData(weeks: number) {
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const row = i % 7;
    if (row === 0 || row === 6) return 0;
    return Math.random() > 0.3 ? Math.round(Math.random() * 10) : 0;
  });
}

// Pre-generate datasets for each period
const datasets: Record<Period, number[]> = {
  week: generateData(1),
  month: generateData(5),
  quarter: generateData(13),
  year: generateData(52),
};

export default function Example() {
  const [period, setPeriod] = useState<Period>("quarter");
  const current = PERIODS.find((p) => p.value === period)!;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-full bg-muted p-1 w-fit">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              period === p.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>

      <ActivityGrid
        data={datasets[period]}
        columns={current.columns}
        className="transition-all duration-200"
      />
    </div>
  );
}
