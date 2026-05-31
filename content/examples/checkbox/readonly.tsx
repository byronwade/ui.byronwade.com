"use client";

import { Checkbox } from "@/components/ui/checkbox";

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm font-medium text-muted-foreground mb-1">Read-only states</p>

      <label className="flex items-center gap-2 cursor-default">
        <Checkbox readOnly checked />
        <span className="text-sm">Read-only checked</span>
      </label>

      <label className="flex items-center gap-2 cursor-default">
        <Checkbox readOnly />
        <span className="text-sm">Read-only unchecked</span>
      </label>

      <p className="text-xs text-muted-foreground mt-1">
        Read-only checkboxes display state but cannot be toggled by the user.
      </p>
    </div>
  );
}
