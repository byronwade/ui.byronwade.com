import {
  Cursor,
  CursorBody,
  CursorName,
  CursorPointer,
} from "@/components/ui/cursor"

const peers = [
  { tone: "brand", name: "Byron" },
  { tone: "success", name: "Ada" },
  { tone: "warning", name: "Lin" },
  { tone: "neutral", name: "Guest" },
] as const

export default function Example() {
  return (
    <div className="flex flex-wrap items-start gap-10 p-10">
      {peers.map((peer) => (
        <Cursor key={peer.name} tone={peer.tone}>
          <CursorPointer />
          <CursorBody>
            <CursorName>{peer.name}</CursorName>
          </CursorBody>
        </Cursor>
      ))}
    </div>
  )
}
