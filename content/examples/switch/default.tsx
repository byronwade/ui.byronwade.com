"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Notifications</p>
          <p className="text-xs text-muted-foreground">
            Receive alerts about account activity
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Notifications are <strong>{enabled ? "on" : "off"}</strong>
      </p>
    </div>
  );
}
