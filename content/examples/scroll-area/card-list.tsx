import { ScrollArea } from "@/components/ui/scroll-area"

const projects = Array.from({ length: 8 }, (_, i) => ({
  title: `Project ${i + 1}`,
  subtitle: `Updated ${i + 1} day${i === 0 ? "" : "s"} ago`,
}))

export default function Example() {
  return (
    <ScrollArea className="h-64 w-72 rounded-xl edge">
      <div className="space-y-2 p-4">
        {projects.map((project) => (
          <div key={project.title} className="rounded-lg edge p-3">
            <p className="text-sm font-medium">{project.title}</p>
            <p className="text-xs text-muted-foreground">{project.subtitle}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
