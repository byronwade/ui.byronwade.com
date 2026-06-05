import { ScrollArea } from "@/components/ui/scroll-area"

const notifications = Array.from(
  { length: 12 },
  (_, i) => `Notification ${i + 1}`,
)

export default function Example() {
  return (
    <div className="w-72 overflow-hidden rounded-xl border">
      <div className="border-b px-4 py-3">
        <p className="text-sm font-medium">Notifications</p>
        <p className="text-xs text-muted-foreground">12 unread</p>
      </div>
      <ScrollArea className="h-56">
        <ul className="divide-y">
          {notifications.map((notification) => (
            <li key={notification} className="px-4 py-2 text-sm">
              {notification}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
