import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-0 bg-background p-8">
      <div className="w-full max-w-md">
        <EmptyState
          title="Nothing here yet"
          description="Once you add some items they'll show up here. Get started by creating your first one."
          action={
            <Button size="sm" variant="outline">
              Create item
            </Button>
          }
        />
      </div>
    </div>
  )
}
