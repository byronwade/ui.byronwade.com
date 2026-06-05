import { Badge } from "@/components/ui/badge"

const tags = ["typescript", "react", "performance", "accessibility", "testing"]

const plan = { name: "Pro", seats: 5, used: 3 }

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Tag cloud */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Tags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Inline in a heading */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Inline usage
        </p>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Components
          <Badge variant="outline">48</Badge>
        </h2>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          Plan: <Badge variant="default">{plan.name}</Badge> &mdash; {plan.used}{" "}
          of {plan.seats} seats used
        </p>
      </div>

      {/* Notification count */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Counts
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm">Inbox</span>
          <Badge variant="destructive">3</Badge>
          <span className="text-sm ml-4">Updates</span>
          <Badge variant="secondary">12</Badge>
          <span className="text-sm ml-4">Archived</span>
          <Badge variant="ghost">0</Badge>
        </div>
      </div>
    </div>
  )
}
