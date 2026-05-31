"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <span className="text-sm">{enabled ? "Enabled" : "Disabled"}</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch size="sm" defaultChecked />
        <span className="text-sm">Small (default on)</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch disabled />
        <span className="text-sm text-muted-foreground">Disabled</span>
      </div>
    </div>
  );
}
