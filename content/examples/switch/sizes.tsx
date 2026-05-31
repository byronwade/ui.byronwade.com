"use client";

import { Switch } from "@/components/ui/switch";

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Switch size="default" defaultChecked />
        <div>
          <p className="text-sm font-medium">Default size</p>
          <p className="text-xs text-muted-foreground">32 × 18.4 px</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Switch size="sm" defaultChecked />
        <div>
          <p className="text-sm font-medium">Small size</p>
          <p className="text-xs text-muted-foreground">24 × 14 px</p>
        </div>
      </div>
    </div>
  );
}
