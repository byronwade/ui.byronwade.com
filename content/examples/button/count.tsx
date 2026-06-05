import { ThumbsUp, Star, GitFork } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Outline button with a trailing count, divided by a hairline — adapted to our
 * tokens (border via `bg-border`, count in `text-muted-foreground`). `pe-0`
 * drops the right padding so the count segment sits flush inside the pill.
 */
export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button variant="outline" className="pe-0">
        <ThumbsUp aria-hidden="true" />
        Like
        <span className="relative ms-1 px-3 text-xs font-medium text-muted-foreground before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border">
          86
        </span>
      </Button>

      <Button variant="outline" className="pe-0">
        <Star aria-hidden="true" />
        Star
        <span className="relative ms-1 px-3 text-xs font-medium text-muted-foreground before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border">
          1.2k
        </span>
      </Button>

      <Button variant="outline" size="sm" className="pe-0">
        <GitFork aria-hidden="true" />
        Fork
        <span className="relative ms-1 px-2.5 text-xs font-medium text-muted-foreground before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border">
          312
        </span>
      </Button>
    </div>
  )
}
