"use client"

import { FileText, FilmStrip, Image, type Icon } from "@/lib/icons"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CommandResult } from "@/components/command-result"

function Thumb({ icon: Icon }: { icon: Icon }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
      <Icon className="size-4" />
    </span>
  )
}

const files = [
  { name: "hero-banner.png", meta: "1.2 MB · 2d ago", icon: Image },
  { name: "brand-deck.pdf", meta: "4.8 MB · 1w ago", icon: FileText },
  { name: "launch-teaser.mp4", meta: "18 MB · 3w ago", icon: FilmStrip },
]

export default function Example() {
  return (
    <div className="w-80 rounded-xl edge">
      <Command>
        <CommandInput placeholder="Search files…" />
        <CommandList>
          <CommandEmpty>No files found.</CommandEmpty>
          <CommandGroup heading="Files">
            {files.map((f) => (
              <CommandItem key={f.name} value={f.name}>
                <CommandResult
                  media={<Thumb icon={f.icon} />}
                  title={f.name}
                  meta={f.meta}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
