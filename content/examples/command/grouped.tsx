"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export default function Example() {
  return (
    <div className="w-80 rounded-xl border">
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>New file</CommandItem>
            <CommandItem>New window</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              Preferences
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
            <CommandItem>Keyboard shortcuts</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Help">
            <CommandItem>Documentation</CommandItem>
            <CommandItem>Contact support</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
