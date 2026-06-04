import { Kbd, KbdGroup } from "@/components/ui/kbd";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-5 p-6 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        Search
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </span>
      <span className="inline-flex items-center gap-1.5">
        Save
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </span>
      <Kbd size="sm">Esc</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd size="lg">Shift</Kbd>
    </div>
  );
}
