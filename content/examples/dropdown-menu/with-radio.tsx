"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Example() {
  const [view, setView] = useState("comfortable");

  return (
    <div className="flex items-center justify-center p-16">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md border px-4 py-2 text-sm">
          View density
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuLabel>Row density</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={view} onValueChange={setView}>
            <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
