"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

export default function Example() {
  const [view, setView] = useState("week");
  return (
    <SegmentedControl
      options={[
        { label: "Day", value: "day" },
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
      ]}
      value={view}
      onValueChange={setView}
    />
  );
}
