import { LockIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <Collapsible defaultOpen disabled className="w-72 space-y-2">
      <CollapsibleTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-between aria-disabled:pointer-events-none aria-disabled:opacity-50"
          />
        }
      >
        Workspace policy
        <LockIcon className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-lg edge px-4 py-3 text-sm text-muted-foreground">
        This section is managed by your administrator and can&apos;t be toggled.
      </CollapsibleContent>
    </Collapsible>
  )
}
