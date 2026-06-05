import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function Example() {
  return (
    <div className="flex flex-wrap items-end gap-8 p-6">
      <div className="flex flex-col items-center gap-2">
        <KbdGroup>
          <Kbd size="sm">⌘</Kbd>
          <Kbd size="sm">K</Kbd>
        </KbdGroup>
        <span className="font-mono text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <KbdGroup>
          <Kbd size="default">⌘</Kbd>
          <Kbd size="default">K</Kbd>
        </KbdGroup>
        <span className="font-mono text-xs text-muted-foreground">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <KbdGroup>
          <Kbd size="lg">⌘</Kbd>
          <Kbd size="lg">K</Kbd>
        </KbdGroup>
        <span className="font-mono text-xs text-muted-foreground">lg</span>
      </div>
    </div>
  )
}
