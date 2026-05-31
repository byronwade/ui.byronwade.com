"use client";

import * as React from "react";
import { Bell, Home, Inbox, Search, Settings, Users, Zap } from "lucide-react";
import { BloomDock, type BloomDockItem, type BloomDockAction } from "@/components/ui/bloom-dock";
import { type BloomFlowDef } from "@/components/ui/bloom-flow";

interface QuickAddState {
  title: string;
  type: "note" | "task" | "";
}

const quickAddFlow: BloomFlowDef<QuickAddState, { title: string; type: string }> = {
  id: "quick-add",
  initial: { title: "", type: "" },
  steps: [
    {
      title: "Choose type",
      caption: "What would you like to add?",
      body: (state, set) => (
        <div className="flex gap-2">
          {(["note", "task"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set({ type: t })}
              className={[
                "flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors",
                state.type === t
                  ? "border-brand bg-brand/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      ),
      primaryLabel: "Next",
      canAdvance: (s) => s.type !== "",
    },
    {
      title: "Add details",
      body: (state, set) => (
        <input
          type="text"
          value={state.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder={state.type === "note" ? "Note title…" : "Task name…"}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          autoFocus
        />
      ),
      primaryLabel: "Create",
      canAdvance: (s) => s.title.trim().length > 0,
    },
  ],
  onComplete: async (state) => {
    await new Promise((r) => setTimeout(r, 700));
    return { title: state.title, type: state.type };
  },
  success: (result) => ({
    title: `${result.type === "note" ? "Note" : "Task"} "${result.title}" added`,
  }),
};

const dockItems: BloomDockItem[] = [
  { id: "home", label: "Home", icon: Home, core: true, active: true },
  { id: "inbox", label: "Inbox", icon: Inbox, core: true, badge: 3 },
  { id: "search", label: "Search", icon: Search },
  { id: "team", label: "Team", icon: Users },
  { id: "settings", label: "Settings", icon: Settings, pinned: true },
];

const dockAction: BloomDockAction = {
  label: "New",
  icon: Zap,
  flow: quickAddFlow,
};

export default function Example() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-end rounded-xl border border-border p-8">
      <BloomDock
        items={dockItems}
        placement="top"
        expandable
        cluster={
          <span className="ml-1 flex h-8 items-center gap-1.5 rounded-full bg-dock-active/20 px-3 text-xs font-medium text-dock-foreground">
            <Bell className="size-3.5" />
            <span>2</span>
          </span>
        }
        action={dockAction}
      />
    </div>
  );
}
