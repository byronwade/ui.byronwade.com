import { FloatingDock } from "@/components/ui/floating-dock";
import { Home, Inbox, BarChart3, Settings, Search } from "lucide-react";

export default function Example() {
  const items = [
    { title: "Home", icon: <Home className="h-full w-full" />, href: "#" },
    { title: "Inbox", icon: <Inbox className="h-full w-full" />, href: "#" },
    { title: "Analytics", icon: <BarChart3 className="h-full w-full" />, href: "#" },
    { title: "Search", icon: <Search className="h-full w-full" />, href: "#" },
    { title: "Settings", icon: <Settings className="h-full w-full" />, href: "#" },
  ];

  return (
    <div className="flex min-h-48 items-end justify-center p-8">
      <FloatingDock items={items} />
    </div>
  );
}
