"use client";

import * as React from "react";
import { BarChart3, Delete, Home, Inbox, Phone, Settings } from "lucide-react";

import { MorphDock } from "@/components/ui/morph-dock";

const items = [
  { id: "home", label: "Home", icon: Home, href: "#", active: true, core: true },
  { id: "calls", label: "Calls", icon: Phone, href: "#", core: true },
  { id: "inbox", label: "Inbox", icon: Inbox, href: "#", core: true },
  { id: "reports", label: "Reports", icon: BarChart3, href: "#" },
  { id: "settings", label: "Settings", icon: Settings, href: "#", pinned: true },
];

// The dial pad layout from SignalRoute — digits with their letter sub-labels.
const KEYS: { d: string; sub?: string }[] = [
  { d: "1" },
  { d: "2", sub: "ABC" },
  { d: "3", sub: "DEF" },
  { d: "4", sub: "GHI" },
  { d: "5", sub: "JKL" },
  { d: "6", sub: "MNO" },
  { d: "7", sub: "PQRS" },
  { d: "8", sub: "TUV" },
  { d: "9", sub: "WXYZ" },
  { d: "*" },
  { d: "0", sub: "+" },
  { d: "#" },
];

/**
 * A detachable dial pad — the SignalRoute dialer design (round keys with letter
 * sub-labels, a caret display) blooming out of the dock as a draggable window.
 */
export default function Example() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="flex min-h-[26rem] items-start justify-center p-8">
      <MorphDock
        draggable
        open={open}
        onOpenChange={setOpen}
        origin="center"
        action={{ label: "Dial", icon: Phone }}
        panelTitle="Dial pad"
        panelWidth={252}
        panelHeight={404}
        items={items}
      >
        <div className="flex h-full flex-col px-3 pb-3">
          {/* Display */}
          <div className="flex h-14 items-center justify-between gap-2 rounded-xl bg-dock-active px-4">
            <span className="flex items-center truncate text-3xl font-semibold tracking-tight text-dock-active-foreground tabular-nums">
              {value || <span className="text-lg font-medium text-dock-foreground/40">Enter a number</span>}
              {value ? <span className="ml-0.5 inline-block h-7 w-px animate-pulse bg-brand" /> : null}
            </span>
            {value ? (
              <button
                type="button"
                aria-label="Delete"
                onClick={() => setValue((v) => v.slice(0, -1))}
                className="shrink-0 text-dock-foreground/60 hover:text-dock-foreground"
              >
                <Delete className="size-5" />
              </button>
            ) : null}
          </div>

          {/* Keypad */}
          <div className="grid flex-1 grid-cols-3 place-items-center gap-1.5 py-1">
            {KEYS.map((k) => (
              <button
                key={k.d}
                type="button"
                onClick={() => setValue((v) => v + k.d)}
                className="flex size-14 flex-col items-center justify-center rounded-full bg-dock-active text-dock-active-foreground ring-brand/40 transition-[transform,background-color] duration-100 hover:bg-dock-foreground/15 active:scale-95 active:bg-dock-foreground/20 active:ring-1 motion-reduce:active:scale-100"
              >
                <span className="text-xl font-medium leading-none">{k.d}</span>
                {k.sub ? (
                  <span className="mt-1 text-[10px] font-semibold tracking-[0.15em] text-dock-foreground">
                    {k.sub}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-1.5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            <Phone className="size-4" />
            Call
          </button>
        </div>
      </MorphDock>
    </div>
  );
}
