"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-72 space-y-2">
      <CollapsibleTrigger render={<Button variant="outline" className="w-full justify-between" />}>
        Billing details
        <ChevronDownIcon className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
        Invoices are sent on the first of each month. Update your card in Settings.
      </CollapsibleContent>
    </Collapsible>
  );
}
