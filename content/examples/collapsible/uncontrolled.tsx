import { ChevronDownIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <Collapsible defaultOpen className="w-72 space-y-2">
      <CollapsibleTrigger
        render={<Button variant="outline" className="w-full justify-between" />}
      >
        What&apos;s included
        <ChevronDownIcon className="size-4 transition-transform group-aria-expanded/button:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
        Unlimited projects, priority support, and advanced analytics, managed
        entirely by the component&apos;s own state.
      </CollapsibleContent>
    </Collapsible>
  )
}
