"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export default function Example() {
  return (
    <div className="w-80 rounded-xl border">
      <Command>
        <CommandInput placeholder="Search actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>New project</CommandItem>
            <CommandItem>Invite teammate</CommandItem>
            <CommandItem>Open documentation</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
