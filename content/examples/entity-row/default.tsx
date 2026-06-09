import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EntityRow } from "@/components/ui/entity-row"
import { StatusDot } from "@/components/ui/status-dot"

export default function Example() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2">
      <EntityRow
        variant="card"
        leading={
          <span className="flex size-9 items-center justify-center rounded-md bg-muted font-mono text-xs text-muted-foreground">
            AC
          </span>
        }
        title="Ariana Cole"
        description="Enterprise customer"
        meta="12 orders"
        status={
          <Badge variant="success" className="gap-1">
            <StatusDot tone="success" />
            Active
          </Badge>
        }
        actions={
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <MoreHorizontalIcon />
          </Button>
        }
        onActivate={() => {}}
      />
      <EntityRow
        variant="compact"
        leading={<StatusDot tone="warning" size="md" />}
        title="Payout review"
        description="Finance queue"
        meta="8m"
      />
    </div>
  )
}
