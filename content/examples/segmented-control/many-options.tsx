"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

const timeRangeOptions = [
  { label: "1h", value: "1h" },
  { label: "6h", value: "6h" },
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
];

export default function Example() {
  const [range, setRange] = useState("24h");

  return (
    <SegmentedControl
      options={timeRangeOptions}
      value={range}
      onValueChange={setRange}
    />
  );
}
