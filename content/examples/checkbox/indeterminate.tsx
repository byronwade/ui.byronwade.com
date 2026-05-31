"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const ITEMS = ["Apples", "Bananas", "Cherries"];

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["Apples"]);

  const allChecked = selected.length === ITEMS.length;
  const someChecked = selected.length > 0 && !allChecked;

  function toggleAll(checked: boolean) {
    setSelected(checked ? [...ITEMS] : []);
  }

  function toggleItem(item: string, checked: boolean) {
    setSelected((prev) =>
      checked ? [...prev, item] : prev.filter((i) => i !== item)
    );
  }

  return (
    <div className="flex flex-col gap-3 p-6">
      <label className="flex items-center gap-2 cursor-pointer font-medium">
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={(checked) => toggleAll(checked)}
        />
        <span className="text-sm">Select all fruits</span>
      </label>

      <div className="flex flex-col gap-2 ml-6">
        {ITEMS.map((item) => (
          <label key={item} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={(checked) => toggleItem(item, checked)}
            />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-1">
        Selected: {selected.length === 0 ? "none" : selected.join(", ")}
      </p>
    </div>
  );
}
