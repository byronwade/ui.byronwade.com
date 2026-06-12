"use client"

import { CreditCard, Key, Users, type Icon } from "@/lib/icons"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CommandResult } from "@/components/command-result"
import { Badge } from "@/components/ui/badge"

function Tile({ icon: Icon }: { icon: Icon }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-md bg-brand/10 text-brand">
      <Icon className="size-4" />
    </span>
  )
}

const settings = [
  {
    title: "Billing",
    description: "Manage your plan and invoices",
    icon: CreditCard,
    badge: "Pro",
  },
  {
    title: "Members",
    description: "Invite teammates and set roles",
    icon: Users,
    badge: null,
  },
  {
    title: "API keys",
    description: "Create and rotate access tokens",
    icon: Key,
    badge: null,
  },
]

export default function Example() {
  return (
    <div className="w-80 rounded-xl edge">
      <Command>
        <CommandInput placeholder="Search settings…" />
        <CommandList>
          <CommandEmpty>No settings found.</CommandEmpty>
          <CommandGroup heading="Workspace">
            {settings.map((s) => (
              <CommandItem key={s.title} value={s.title}>
                <CommandResult
                  media={<Tile icon={s.icon} />}
                  title={s.title}
                  description={s.description}
                  action={
                    s.badge ? (
                      <Badge variant="secondary">{s.badge}</Badge>
                    ) : undefined
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
