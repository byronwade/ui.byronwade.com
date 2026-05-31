"use client";

import { Separator } from "@/components/ui/separator";

export default function Example() {
  return (
    <div className="w-80 rounded-xl border bg-card p-5 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Account Summary</h3>
        <p className="text-xs text-muted-foreground">Your usage this billing period</p>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">API Requests</span>
          <span className="font-medium">12,450</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Storage used</span>
          <span className="font-medium">2.3 GB</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Bandwidth</span>
          <span className="font-medium">18 GB</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between text-sm">
        <span className="font-medium">Estimated total</span>
        <span className="font-semibold">$24.00</span>
      </div>
    </div>
  );
}
