"use client";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function Example() {
  // Seed the query with text that matches nothing so CommandEmpty is shown.
  const [query, setQuery] = useState("flux capacitor");

  return (
    <div className="w-80 rounded-xl border">
      <Command>
        <CommandInput
          placeholder="Search…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>New project</CommandItem>
            <CommandItem>Invite teammate</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
