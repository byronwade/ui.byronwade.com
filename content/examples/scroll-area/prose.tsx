import { ScrollArea } from "@/components/ui/scroll-area"

export default function Example() {
  return (
    <ScrollArea className="h-56 w-80 rounded-xl edge">
      <div className="reading-prose p-4 text-foreground">
        <p>
          The scroll area keeps long-form content within a fixed footprint so a
          dense block of text never pushes the rest of the layout around. The
          viewport clips the overflow and reveals a slim scrollbar only when it
          is needed.
        </p>
        <p>
          Pairing scroll areas with reading-prose preserves the 65ch measure and
          paragraph rhythm even inside a clipped panel — the house standard for
          essay lanes, not ad-hoc text-sm stacks.
        </p>
        <p>
          Keyboard users can focus the viewport and move through the text with
          the arrow keys, page up and page down, exactly as they would with a
          native scrolling element.
        </p>
      </div>
    </ScrollArea>
  )
}
