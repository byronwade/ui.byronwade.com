import { SearchIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function Example() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <SearchIcon className="size-4 opacity-50" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
      <InputGroupAddon align="inline-end">
        <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded edge bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}
