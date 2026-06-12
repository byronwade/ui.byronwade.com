import { PushPin } from "@/lib/icons"
import { Toggle } from "@/components/ui/toggle"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-8">
      <Toggle variant="outline" defaultPressed>
        <PushPin />
        Pinned
      </Toggle>

      <Toggle variant="outline">Show details</Toggle>
    </div>
  )
}
