"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine the list without leaving the page.
          </SheetDescription>
        </SheetHeader>
        <p className="px-4 text-sm text-muted-foreground">
          Sheet panels slide in from any edge and work well for filters, detail
          drawers, and mobile navigation.
        </p>
      </SheetContent>
    </Sheet>
  );
}
