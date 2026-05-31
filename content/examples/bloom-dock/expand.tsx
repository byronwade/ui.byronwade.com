"use client";

import { BarChart2, BookOpen, Calendar, Home, Inbox, MessageSquare, Settings } from "lucide-react";
import { BloomDock, type BloomDockItem } from "@/components/ui/bloom-dock";

const items: BloomDockItem[] = [
  { id: "home", label: "Home", icon: Home, core: true, active: true },
  { id: "inbox", label: "Inbox", icon: Inbox, core: true, badge: 5 },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "docs", label: "Docs", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings, pinned: true },
];

export default function Example() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-end gap-4 rounded-xl border border-border p-8">
      <p className="text-xs text-muted-foreground">
        Click the expand icon to reveal non-core items
      </p>
      <BloomDock items={items} placement="bottom" expandable={true} />
    </div>
  );
}
