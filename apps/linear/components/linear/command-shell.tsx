"use client"

import * as React from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type CommandShellItem = {
  id: string
  label: string
  meta?: string
  group?: string
}

type CommandShellProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandShellItem[]
  placeholder?: string
  title?: string
  description?: string
  onSelect?: (id: string) => void
  className?: string
}

function CommandShell({
  open,
  onOpenChange,
  items,
  placeholder = "Search issues, projects, people…",
  title = "Command menu",
  description = "Jump to an issue or run a workspace action.",
  onSelect,
  className,
}: CommandShellProps) {
  const groups = React.useMemo(() => {
    const map = new Map<string, CommandShellItem[]>()
    for (const item of items) {
      const key = item.group ?? "Results"
      const list = map.get(key) ?? []
      list.push(item)
      map.set(key, list)
    }
    return [...map.entries()]
  }, [items])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="linear-command-shell"
        className={cn("gap-0 overflow-hidden p-0 sm:max-w-lg", className)}
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command className="rounded-none border-0 bg-transparent shadow-none ring-0">
          <CommandInput placeholder={placeholder} />
          <CommandList className="max-h-80">
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map(([group, groupItems], index) => (
              <React.Fragment key={group}>
                {index > 0 ? <CommandSeparator /> : null}
                <CommandGroup heading={group}>
                  {groupItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.id} ${item.label}`}
                      onSelect={() => {
                        onSelect?.(item.id)
                        onOpenChange(false)
                      }}
                    >
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.id}
                      </span>
                      <span className="truncate">{item.label}</span>
                      {item.meta ? (
                        <span className="ml-auto font-mono text-xs text-muted-foreground">
                          {item.meta}
                        </span>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export { CommandShell }
export type { CommandShellItem, CommandShellProps }
