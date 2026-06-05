"use client";

import * as React from "react";
import {
  Bell,
  Boxes,
  Check,
  Command,
  Home,
  LayoutGrid,
  LayoutTemplate,
  LogOut,
  PanelsTopLeft,
  Search,
  Settings,
  User,
} from "lucide-react";

import { MorphDock } from "@/components/ui/morph-dock";

const APPS = [
  ["Design system", "Components, tokens"],
  ["Layouts", "Page archetypes"],
  ["Templates", "Starter kits"],
];
type Icon = React.ComponentType<{ className?: string }>;
const NOTES: [string, string, Icon][] = [
  ["New release", "v2.4 shipped to production", Check],
  ["Mention", "@you in “Morph dock” review", Bell],
  ["Build passed", "CI green on main", Check],
];
const ACCOUNT: [string, Icon][] = [
  ["Profile", User],
  ["Settings", Settings],
  ["Sign out", LogOut],
];

type Panel = "search" | "notif" | "profile";

/**
 * A full-width app bar where the pills bloom DIFFERENT panels: the launcher morphs
 * into an app switcher (from the left), and the right toolbar's Search / bell /
 * avatar each bloom their own panel — results, a notifications list, an account
 * menu — from the right edge. The centered nav stays put.
 */
export default function Example() {
  const [launcher, setLauncher] = React.useState(false);
  const [panel, setPanel] = React.useState<Panel | null>(null);

  return (
    <div className="flex min-h-80 w-full items-start p-8">
      <div className="flex w-full items-start gap-2">
        {/* Launcher → app switcher, from the left */}
        <MorphDock
          navLabel="Launcher"
          expandable={false}
          origin="start"
          open={launcher}
          onOpenChange={setLauncher}
          panelWidth={248}
          items={[]}
          action={{ label: "Apps", icon: LayoutGrid }}
        >
          <div className="p-2">
            <div className="px-2 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-dock-foreground/50">
              Switch app
            </div>
            {APPS.map(([title, desc]) => (
              <button
                key={title}
                type="button"
                onClick={() => setLauncher(false)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-dock-active"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-dock-active-foreground">
                  <span className="size-2 rounded-full bg-brand" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-dock-active-foreground">{title}</span>
                  <span className="block truncate text-[11px] text-dock-foreground/60">{desc}</span>
                </span>
              </button>
            ))}
          </div>
        </MorphDock>

        {/* Centered main nav */}
        <MorphDock
          navLabel="Primary"
          expandable={false}
          items={[
            { id: "home", label: "Home", icon: Home, href: "#", active: true, core: true },
            { id: "components", label: "Components", icon: Boxes, href: "#", core: true },
            { id: "layouts", label: "Layouts", icon: PanelsTopLeft, href: "#", core: true },
            { id: "templates", label: "Templates", icon: LayoutTemplate, href: "#", core: true },
          ]}
        />

        {/* Right toolbar → each icon blooms a different panel, from the right */}
        <div className="ml-auto">
          <MorphDock
            navLabel="Tools"
            expandable={false}
            origin="end"
            open={panel !== null}
            onOpenChange={(o) => {
              if (!o) setPanel(null);
            }}
            panelWidth={panel === "profile" ? 224 : 288}
            items={[
              { id: "search", label: "Search", icon: Search, core: true, onSelect: () => setPanel("search") },
              { id: "notif", label: "Notifications", icon: Bell, core: true, badge: 3, onSelect: () => setPanel("notif") },
              { id: "profile", label: "Account", icon: User, core: true, onSelect: () => setPanel("profile") },
            ]}
          >
            {panel === "search" ? (
              <div className="p-1.5">
                <div className="flex h-9 items-center gap-2 rounded-lg bg-dock-active px-3 text-[13px] text-dock-foreground/60">
                  <Search className="size-4 shrink-0" />
                  Search components…
                </div>
                <div className="mt-1.5 space-y-0.5">
                  {["Button", "Morph dock", "Activity grid"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setPanel(null)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
                    >
                      <Command className="size-4 shrink-0 opacity-70" />
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            ) : panel === "notif" ? (
              <div className="p-1.5">
                <div className="px-2 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-dock-foreground/50">
                  Notifications
                </div>
                {NOTES.map(([title, desc, Icon]) => (
                  <button
                    key={title as string}
                    type="button"
                    onClick={() => setPanel(null)}
                    className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-dock-active"
                  >
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-dock-active text-dock-active-foreground">
                      {React.createElement(Icon as React.ComponentType<{ className?: string }>, { className: "size-3.5" })}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-dock-active-foreground">{title}</span>
                      <span className="block truncate text-[11px] text-dock-foreground/60">{desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : panel === "profile" ? (
              <div className="p-1.5">
                <div className="mb-1 flex items-center gap-2.5 px-2 py-1.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-medium text-brand-foreground">
                    B
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-dock-active-foreground">Byron</span>
                    <span className="block truncate text-[11px] text-dock-foreground/60">bcw@byronwade.com</span>
                  </span>
                </div>
                {ACCOUNT.map(([label, Icon]) => (
                  <button
                    key={label as string}
                    type="button"
                    onClick={() => setPanel(null)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
                  >
                    {React.createElement(Icon as React.ComponentType<{ className?: string }>, {
                      className: "size-4 shrink-0 opacity-70",
                    })}
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </MorphDock>
        </div>
      </div>
    </div>
  );
}
