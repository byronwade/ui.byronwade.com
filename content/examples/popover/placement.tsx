"use client";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

const sides: Side[] = ["top", "bottom", "left", "right"];
const aligns: Align[] = ["start", "center", "end"];

export default function Example() {
  return (
    <div className="flex flex-col gap-10 p-8">
      {/* Side placement */}
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Side
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {sides.map((side) => (
            <Popover key={side}>
              <PopoverTrigger className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors capitalize">
                {side}
              </PopoverTrigger>
              <PopoverContent side={side} align="center">
                <PopoverHeader>
                  <PopoverTitle>Side: {side}</PopoverTitle>
                  <PopoverDescription>
                    Appears on the {side} of the trigger.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Align (side=bottom)
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {aligns.map((align) => (
            <Popover key={align}>
              <PopoverTrigger className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors capitalize">
                align=&ldquo;{align}&rdquo;
              </PopoverTrigger>
              <PopoverContent side="bottom" align={align}>
                <PopoverHeader>
                  <PopoverTitle>Align: {align}</PopoverTitle>
                  <PopoverDescription>
                    Popup aligns to the {align} edge of the trigger.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>

      {/* Offset */}
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Side offset
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {[0, 8, 16, 24].map((offset) => (
            <Popover key={offset}>
              <PopoverTrigger className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors">
                offset={offset}
              </PopoverTrigger>
              <PopoverContent side="bottom" align="center" sideOffset={offset}>
                <PopoverHeader>
                  <PopoverTitle>sideOffset={offset}</PopoverTitle>
                  <PopoverDescription>
                    {offset}px gap between trigger and popup.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </div>
  );
}
