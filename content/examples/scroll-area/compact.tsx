import { ScrollArea } from "@/components/ui/scroll-area"

const items = Array.from({ length: 15 }, (_, i) => `Item ${i + 1}`)

export default function Example() {
  return (
    <ScrollArea className="h-32 w-56 rounded-xl edge">
      <ul className="p-2 text-sm">
        {items.map((item) => (
          <li key={item} className="truncate rounded px-2 py-1">
            {item}
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
