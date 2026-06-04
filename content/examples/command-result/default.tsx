import { FileTextIcon, ImageIcon, FolderIcon } from "lucide-react";
import { CommandResult } from "@/components/command-result";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export default function Example() {
  return (
    <div className="w-96 rounded-xl border">
      <Command>
        <CommandInput placeholder="Search files…" />
        <CommandList>
          <CommandGroup heading="Files">
            <CommandItem>
              <CommandResult
                media={
                  <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <FileTextIcon className="size-4" />
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
                    <ImageIcon className="size-4" />
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
                    <FolderIcon className="size-4" />
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
  );
}
