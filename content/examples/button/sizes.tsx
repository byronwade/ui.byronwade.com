import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Text button sizes */}
      <div className="flex flex-wrap items-end gap-3">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>

      {/* Icon button sizes */}
      <div className="flex flex-wrap items-end gap-3">
        <Button size="icon-xs" aria-label="Settings extra small">
          <Settings />
        </Button>
        <Button size="icon-sm" aria-label="Settings small">
          <Settings />
        </Button>
        <Button size="icon" aria-label="Settings default">
          <Settings />
        </Button>
        <Button size="icon-lg" aria-label="Settings large">
          <Settings />
        </Button>
      </div>
    </div>
  )
}
