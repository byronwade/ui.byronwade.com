import { FloatingDock } from "@/components/ui/floating-dock"
import { ChartBar, Gear, House, MagnifyingGlass, Tray } from "@/lib/icons"

export default function Example() {
  const items = [
    { title: "Home", icon: <House className="h-full w-full" />, href: "#" },
    { title: "Inbox", icon: <Tray className="h-full w-full" />, href: "#" },
    {
      title: "Analytics",
      icon: <ChartBar className="h-full w-full" />,
      href: "#",
    },
    {
      title: "Search",
      icon: <MagnifyingGlass className="h-full w-full" />,
      href: "#",
    },
    {
      title: "Settings",
      icon: <Gear className="h-full w-full" />,
      href: "#",
    },
  ]

  return (
    <div className="flex min-h-48 items-end justify-center p-8">
      <FloatingDock items={items} />
    </div>
  )
}
