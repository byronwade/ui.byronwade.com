import { Button } from "@/components/ui/button"
import { FloppyDisk, Trash } from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* All variants in disabled state */}
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled>Default</Button>
        <Button variant="outline" disabled>
          Outline
        </Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
        <Button variant="destructive" disabled>
          <Trash />
          Destructive
        </Button>
        <Button variant="link" disabled>
          Link
        </Button>
      </div>

      {/* Disabled icon buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="icon" aria-label="Save" disabled>
          <FloppyDisk />
        </Button>
        <Button size="icon" variant="outline" aria-label="Delete" disabled>
          <Trash />
        </Button>
      </div>

      <p className="text-muted-foreground text-sm">
        Disabled buttons use{" "}
        <code className="text-xs bg-muted px-1 py-0.5 rounded">
          pointer-events-none
        </code>{" "}
        and reduced opacity, they cannot be focused or triggered.
      </p>
    </div>
  )
}
