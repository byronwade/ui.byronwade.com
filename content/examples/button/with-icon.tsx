import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ArrowsClockwise,
  Check,
  DownloadSimple,
  MagnifyingGlass,
  Plus,
  UploadSimple,
} from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Icon at the start (inline-start slot) */}
      <div className="flex flex-wrap items-center gap-3">
        <Button>
          <Plus data-icon="inline-start" />
          New item
        </Button>
        <Button variant="outline">
          <MagnifyingGlass data-icon="inline-start" />
          Search
        </Button>
        <Button variant="secondary">
          <DownloadSimple data-icon="inline-start" />
          Download
        </Button>
        <Button variant="ghost">
          <ArrowsClockwise data-icon="inline-start" />
          Refresh
        </Button>
      </div>

      {/* Icon at the end (inline-end slot) */}
      <div className="flex flex-wrap items-center gap-3">
        <Button>
          Continue
          <ArrowRight data-icon="inline-end" />
        </Button>
        <Button variant="outline">
          Upload file
          <UploadSimple data-icon="inline-end" />
        </Button>
        <Button variant="secondary">
          Confirm
          <Check data-icon="inline-end" />
        </Button>
      </div>

      {/* Icon-only buttons (use aria-label for accessibility) */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="icon" aria-label="Add new">
          <Plus />
        </Button>
        <Button size="icon" variant="outline" aria-label="Download">
          <DownloadSimple />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Search">
          <MagnifyingGlass />
        </Button>
        <Button size="icon" variant="destructive" aria-label="Refresh">
          <ArrowsClockwise />
        </Button>
      </div>
    </div>
  )
}
