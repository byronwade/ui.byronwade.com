"use client";

import * as React from "react";
import { BarChart3, Check, Home, Inbox, LayoutGrid, Settings, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { MorphDock } from "@/components/ui/morph-dock";

const items = [
  { id: "home", label: "Home", icon: Home, href: "#", active: true, core: true },
  { id: "inbox", label: "Inbox", icon: Inbox, href: "#", core: true },
  { id: "reports", label: "Reports", icon: BarChart3, href: "#", core: true },
  { id: "settings", label: "Settings", icon: Settings, href: "#", pinned: true },
];

const products = [
  { name: "Line", desc: "Calls, texts & voicemail", mark: "L", current: true },
  { name: "Developer", desc: "API, numbers & observability", mark: "D" },
  { name: "Operator", desc: "AI receptionist", mark: "O" },
];

/** A product switcher blooming from the dock — the SignalRoute launcher design. */
export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex min-h-72 items-start justify-center p-8">
      <MorphDock
        open={open}
        onOpenChange={setOpen}
        origin="center"
        action={{ label: "Apps", icon: LayoutGrid }}
        panelWidth={288}
        items={items}
      >
        <div className="p-2">
          <div className="flex items-center justify-between px-1.5 pb-1 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-dock-foreground/70">
              Switch product
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid size-7 shrink-0 place-items-center rounded-lg text-dock-foreground outline-none transition-colors hover:bg-dock-active hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <X className="size-4" />
            </button>
          </div>
          {products.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setOpen(false)}
              aria-current={p.current ? "true" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors",
                p.current ? "bg-brand/10" : "hover:bg-dock-active",
              )}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg text-[13px] font-bold",
                  p.current
                    ? "bg-gradient-to-br from-brand to-brand/70 text-brand-foreground"
                    : "bg-dock-foreground/10 text-dock-active-foreground",
                )}
              >
                {p.mark}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-dock-active-foreground">{p.name}</span>
                <span className="block truncate text-[11px] text-dock-foreground">{p.desc}</span>
              </span>
              {p.current ? <Check className="size-4 shrink-0 text-brand" /> : null}
            </button>
          ))}
        </div>
      </MorphDock>
    </div>
  );
}
