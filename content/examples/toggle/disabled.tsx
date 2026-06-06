import { BoldIcon, ItalicIcon } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex items-center gap-3">
        <Toggle aria-label="Bold" variant="outline" disabled>
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Italic" variant="outline" defaultPressed disabled>
          <ItalicIcon />
        </Toggle>
      </div>

      <p className="text-muted-foreground text-sm">
        Disabled toggles can&apos;t be focused or pressed, the second one starts
        in its pressed state.
      </p>
    </div>
  )
}
