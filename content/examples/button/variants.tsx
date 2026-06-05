import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="text-muted-foreground text-sm">
        <p className="font-medium text-foreground mb-1">
          When to use each variant
        </p>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <strong>default</strong> — primary call-to-action
          </li>
          <li>
            <strong>outline</strong> — secondary action alongside a primary
          </li>
          <li>
            <strong>secondary</strong> — neutral emphasis, no competing with
            primary
          </li>
          <li>
            <strong>ghost</strong> — lowest emphasis, toolbars and inline
            actions
          </li>
          <li>
            <strong>destructive</strong> — irreversible or dangerous operations
          </li>
          <li>
            <strong>link</strong> — inline hyperlink-style action
          </li>
        </ul>
      </div>
    </div>
  )
}
