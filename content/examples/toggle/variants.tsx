import { TextB, TextItalic } from "@/lib/icons"
import { Toggle } from "@/components/ui/toggle"

export default function Example() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          <Toggle aria-label="Bold" defaultPressed>
            <TextB />
          </Toggle>
          <Toggle aria-label="Italic">
            <TextItalic />
          </Toggle>
        </div>
        <span className="text-xs text-muted-foreground">default</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          <Toggle aria-label="Bold" variant="outline" defaultPressed>
            <TextB />
          </Toggle>
          <Toggle aria-label="Italic" variant="outline">
            <TextItalic />
          </Toggle>
        </div>
        <span className="text-xs text-muted-foreground">outline</span>
      </div>
    </div>
  )
}
