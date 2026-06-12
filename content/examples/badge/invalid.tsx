import { Badge } from "@/components/ui/badge"
import { WarningCircle } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* aria-invalid applies destructive ring styling */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Validation state
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge aria-invalid>
            <WarningCircle data-icon="inline-start" />
            Required field missing
          </Badge>
          <Badge variant="outline" aria-invalid>
            Invalid format
          </Badge>
          <Badge variant="secondary" aria-invalid>
            Out of range
          </Badge>
        </div>
      </div>

      {/* Normal vs invalid comparison */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Normal vs invalid
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Username</Badge>
          <Badge variant="outline" aria-invalid>
            Username
          </Badge>
        </div>
      </div>
    </div>
  )
}
