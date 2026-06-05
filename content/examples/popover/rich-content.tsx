"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const MEMBERS = [
  {
    id: 1,
    name: "Ada Lovelace",
    role: "Engineer",
    initials: "AL",
    color: "bg-chart-1/15 text-chart-1",
  },
  {
    id: 2,
    name: "Grace Hopper",
    role: "Architect",
    initials: "GH",
    color: "bg-chart-2/15 text-chart-2",
  },
  {
    id: 3,
    name: "Alan Turing",
    role: "Researcher",
    initials: "AT",
    color: "bg-chart-3/15 text-chart-3",
  },
]

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      className={`inline-flex size-8 items-center justify-center rounded-full text-xs font-semibold ${color}`}
    >
      {initials}
    </span>
  )
}

export default function Example() {
  const [following, setFollowing] = useState<Set<number>>(new Set())

  function toggle(id: number) {
    setFollowing((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-8">
      {MEMBERS.map((member) => (
        <Popover key={member.id}>
          <PopoverTrigger className="flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors">
            <Avatar initials={member.initials} color={member.color} />
            <span>{member.name}</span>
          </PopoverTrigger>

          <PopoverContent side="bottom" align="center" className="w-64">
            {/* Profile header */}
            <div className="flex items-center gap-3">
              <Avatar
                initials={member.initials}
                color={`${member.color} size-10`}
              />
              <div>
                <p className="text-sm font-semibold leading-tight">
                  {member.name}
                </p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>

            <div className="my-2 h-px bg-border" />

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-md bg-muted/60 px-2 py-1.5">
                <p className="font-semibold text-foreground">142</p>
                <p className="text-muted-foreground">Commits</p>
              </div>
              <div className="rounded-md bg-muted/60 px-2 py-1.5">
                <p className="font-semibold text-foreground">38</p>
                <p className="text-muted-foreground">Reviews</p>
              </div>
            </div>

            {/* Follow action */}
            <button
              onClick={() => toggle(member.id)}
              className={`mt-2 w-full rounded-full border py-1 text-sm font-medium transition-colors ${
                following.has(member.id)
                  ? "border-border bg-muted text-foreground hover:bg-muted/70"
                  : "border-primary bg-primary text-primary-foreground hover:bg-primary/80"
              }`}
            >
              {following.has(member.id) ? "Following" : "Follow"}
            </button>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
