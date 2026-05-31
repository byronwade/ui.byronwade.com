"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

export default function Example() {
  const [v, setV] = useState("ref");
  return (
    <SegmentedControl
      options={[
        { label: "Referrer", value: "ref" },
        { label: "Links", value: "links" },
        { label: "Campaign", value: "camp" },
      ]}
      value={v}
      onValueChange={setV}
    />
  );
}
