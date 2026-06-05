"use client"

import { PackageIcon } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CommandResult } from "@/components/command-result"
import { Button } from "@/components/ui/button"

const packages = [
  {
    name: "@byronwade/ui",
    description: "Design-system registry",
    cta: "Install",
  },
  { name: "cmdk", description: "Command menu for React", cta: "Install" },
  { name: "lucide-react", description: "Icon library", cta: "Add" },
]

export default function Example() {
  return (
    <div className="w-80 rounded-xl border">
      <Command>
        <CommandInput placeholder="Search packages…" />
        <CommandList>
          <CommandEmpty>No packages found.</CommandEmpty>
          <CommandGroup heading="Packages">
            {packages.map((p) => (
              <CommandItem key={p.name} value={p.name}>
                <CommandResult
                  media={
                    <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <PackageIcon className="size-4" />
                    </span>
                  }
                  title={p.name}
                  description={p.description}
                  action={
                    <Button size="sm" variant="outline">
                      {p.cta}
                    </Button>
                  }
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
