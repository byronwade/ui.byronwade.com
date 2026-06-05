import {
  Cursor,
  CursorBody,
  CursorMessage,
  CursorName,
  CursorPointer,
} from "@/components/ui/cursor";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-10">
      <Cursor className="text-brand">
        <CursorPointer />
        <CursorBody className="bg-brand text-brand-foreground">
          <CursorName>Byron</CursorName>
          <CursorMessage className="text-brand-foreground/70">
            Editing the hero…
          </CursorMessage>
        </CursorBody>
      </Cursor>
    </div>
  );
}
