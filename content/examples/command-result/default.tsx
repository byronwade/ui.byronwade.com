import { FileText, Folder, Image } from "@/lib/icons"
import { CommandResult } from "@/components/command-result"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

export default function Example() {
  return (
    <div className="w-96 rounded-xl edge">
      <Command>
        <CommandInput placeholder="Search files…" />
        <CommandList>
          <CommandGroup heading="Files">
            <CommandItem>
              <CommandResult
                media={
                  <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <FileText className="size-4" />
                  </span>
                }
                title="proposal.md"
                description="Drafts / Q3"
                meta="2.4 KB"
              />
            </CommandItem>
            <CommandItem>
              <CommandResult
                media={
                  <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Image className="size-4" />
                  </span>
                }
                title="hero-banner.png"
                description="Assets / marketing"
                action={<Badge variant="secondary">Image</Badge>}
              />
            </CommandItem>
            <CommandItem>
              <CommandResult
                media={
                  <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Folder className="size-4" />
                  </span>
                }
                title="Components"
                meta="48 items"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
