"use client";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Popover>
        <PopoverTrigger className="px-4 py-2 rounded-md border text-sm font-medium">
          Open Popover
        </PopoverTrigger>
        <PopoverContent side="bottom" align="center">
          <PopoverHeader>
            <PopoverTitle>Quick Info</PopoverTitle>
            <PopoverDescription>Here are some helpful details about this item.</PopoverDescription>
          </PopoverHeader>
          <p className="text-sm text-muted-foreground">
            You can place any content inside the popover body.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
