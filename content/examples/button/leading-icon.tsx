"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button><Download data-icon="inline-start" />Download</Button>
    </div>
  );
}
