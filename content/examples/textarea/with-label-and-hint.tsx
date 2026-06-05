import { Textarea } from "@/components/ui/textarea"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-md">
      {/* Label + hint below */}
      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <Textarea id="notes" placeholder="Add any relevant notes…" rows={3} />
        <p className="text-xs text-muted-foreground">
          These notes are only visible to you and your team.
        </p>
      </div>

      {/* Label + required indicator */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <span className="text-xs text-destructive">*</span>
        </div>
        <Textarea
          id="description"
          placeholder="Describe the item in detail…"
          required
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Minimum 20 characters. Markdown is supported.
        </p>
      </div>

      {/* Label + helper above */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="feedback" className="text-sm font-medium">
            Feedback
          </label>
          <span className="text-xs text-muted-foreground">Optional</span>
        </div>
        <Textarea id="feedback" placeholder="Share your thoughts…" rows={3} />
      </div>
    </div>
  )
}
