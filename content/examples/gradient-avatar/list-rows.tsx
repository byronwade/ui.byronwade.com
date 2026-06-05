import { GradientAvatar } from "@/components/ui/gradient-avatar"

const members = [
  {
    seed: "nova-1",
    name: "Remarkable Falcon",
    role: "Admin",
    joined: "2 days ago",
  },
  {
    seed: "prism-2",
    name: "Curious Otter",
    role: "Editor",
    joined: "1 week ago",
  },
  {
    seed: "tide-3",
    name: "Gentle Lynx",
    role: "Viewer",
    joined: "3 weeks ago",
  },
  {
    seed: "cedar-4",
    name: "Rapid Crane",
    role: "Editor",
    joined: "1 month ago",
  },
  {
    seed: "grove-5",
    name: "Sleepy Gecko",
    role: "Viewer",
    joined: "2 months ago",
  },
]

export default function Example() {
  return (
    <div className="w-full max-w-md rounded-2xl border bg-card p-4">
      <p className="mb-3 text-sm font-semibold">Team Members</p>
      <ul className="space-y-1">
        {members.map((m) => (
          <li
            key={m.seed}
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50"
          >
            <GradientAvatar seed={m.seed} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.role}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {m.joined}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
