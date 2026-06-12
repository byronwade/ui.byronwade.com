"use client"

import { MagnifyingGlass } from "@/lib/icons"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function Example() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <MagnifyingGlass className="size-4 opacity-50" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search projects…" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Go</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
