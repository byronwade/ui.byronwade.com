"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const STEPS = [
  { value: 0, label: "Details" },
  { value: 1, label: "Review" },
  { value: 2, label: "Confirm" },
] as const;

export default function Example() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const isFirst = activeTab === 0;
  const isLast = activeTab === STEPS.length - 1;

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as number)}>
          <TabsList>
            {STEPS.map((step) => (
              <TabsTrigger key={step.value} value={step.value}>
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={0} className="rounded-xl border p-4">
            <p className="text-sm font-medium">Step 1 — Fill in your details</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the required information to proceed.
            </p>
          </TabsContent>

          <TabsContent value={1} className="rounded-xl border p-4">
            <p className="text-sm font-medium">Step 2 — Review your input</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Make sure everything looks correct before confirming.
            </p>
          </TabsContent>

          <TabsContent value={2} className="rounded-xl border p-4">
            <p className="text-sm font-medium">Step 3 — Confirm &amp; submit</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click Confirm to finalise your submission.
            </p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <button
            onClick={() => setActiveTab((v) => Math.max(0, v - 1))}
            disabled={isFirst}
            className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            Back
          </button>
          <span className="text-xs text-muted-foreground self-center">
            Step {activeTab + 1} of {STEPS.length}
          </span>
          <button
            onClick={() => setActiveTab((v) => Math.min(STEPS.length - 1, v + 1))}
            disabled={isLast}
            className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
