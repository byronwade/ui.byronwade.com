import { ScrollArea } from "@/components/ui/scroll-area";

export default function Example() {
  return (
    <ScrollArea className="h-48 w-72 rounded-xl border">
      <div className="space-y-4 p-4 text-sm text-muted-foreground">
        <p>
          The scroll area keeps long-form content within a fixed footprint so a
          dense block of text never pushes the rest of the layout around. The
          viewport clips the overflow and reveals a slim scrollbar only when it
          is needed.
        </p>
        <p>
          Because the bar overlays the content rather than reserving its own
          column, the reading measure stays constant whether or not the region
          is scrollable. This avoids the subtle layout shift that plain
          overflow containers introduce.
        </p>
        <p>
          Keyboard users can focus the viewport and move through the text with
          the arrow keys, page up and page down, exactly as they would with a
          native scrolling element. Pointer users get a draggable thumb on
          hover.
        </p>
        <p>
          Drop any amount of prose inside and the component will take care of
          the rest, deriving the thumb size from the ratio between the visible
          viewport and the full content height.
        </p>
      </div>
    </ScrollArea>
  );
}
