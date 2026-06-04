"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CommandResult } from "@/components/command-result";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { StatusDot } from "@/components/ui/status-dot";

const people = [
  { name: "Ada Lovelace", role: "Design", email: "ada@example.com", tone: "success" as const },
  { name: "Alan Turing", role: "Engineering", email: "alan@example.com", tone: "neutral" as const },
  { name: "Grace Hopper", role: "Product", email: "grace@example.com", tone: "warning" as const },
];

export default function Example() {
  return (
    <div className="w-80 rounded-xl border">
      <Command>
        <CommandInput placeholder="Search people…" />
        <CommandList>
          <CommandEmpty>No people found.</CommandEmpty>
          <CommandGroup heading="People">
            {people.map((p) => (
              <CommandItem key={p.email} value={p.name}>
                <CommandResult
                  media={<GradientAvatar seed={p.email} size="sm" />}
                  title={p.name}
                  description={`${p.role} · ${p.email}`}
                  action={<StatusDot tone={p.tone} />}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
