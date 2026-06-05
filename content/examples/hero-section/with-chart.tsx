"use client";

import { HeroSection } from "@/components/hero-section";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", value: 210 },
  { time: "04:00", value: 140 },
  { time: "08:00", value: 380 },
  { time: "10:00", value: 520 },
  { time: "12:00", value: 690 },
  { time: "14:00", value: 750 },
  { time: "16:00", value: 620 },
  { time: "18:00", value: 530 },
  { time: "20:00", value: 410 },
  { time: "23:00", value: 290 },
];

/** HeroSection wrapping a real full-bleed area chart — the hero-chart archetype. */
export default function Example() {
  return (
    <div className="overflow-x-clip w-full">
      <HeroSection
        header={
          <>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Visitors today
              </span>
              <span className="text-3xl font-semibold tabular-nums">5,540</span>
            </div>
            <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
              +18.2%
            </span>
          </>
        }
      >
        <ResponsiveContainer width="100%" height={192}>
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval="preserveStartEnd"
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#heroGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-1)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </HeroSection>
    </div>
  );
}
