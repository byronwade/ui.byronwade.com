"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CodeBlock } from "@/app/(docs)/_components/code-block";

export function ExampleTabs({ title, preview, code }: { title: string; preview: React.ReactNode; code: string }) {
  const [view, setView] = useState<"preview" | "code">("preview");
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <SegmentedControl
          options={[
            { label: "Preview", value: "preview" as const },
            { label: "Code", value: "code" as const },
          ]}
          value={view}
          onValueChange={setView}
        />
      </div>
      {view === "preview" ? (
        <div className="grid min-h-56 max-h-[36rem] place-items-center overflow-auto rounded-xl edge p-8">
          {preview}
        </div>
      ) : (
        <CodeBlock code={code} />
      )}
    </div>
  );
}
