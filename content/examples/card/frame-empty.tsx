import { FolderIcon, PlusIcon } from "lucide-react"
import {
  Card,
  CardPanel,
  CardFrame,
  CardFrameHeader,
  CardFrameTitle,
  CardFrameDescription,
  CardFrameAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"

export default function Example() {
  return (
    <div className="flex min-h-[420px] items-center justify-center bg-background p-8">
      <CardFrame className="w-full max-w-md">
        <CardFrameHeader>
          <CardFrameTitle>Project</CardFrameTitle>
          <CardFrameDescription>Manage your projects</CardFrameDescription>
          <CardFrameAction>
            <Button variant="outline" size="sm">
              <PlusIcon className="size-4" />
              Add
            </Button>
          </CardFrameAction>
        </CardFrameHeader>
        <Card>
          <CardPanel>
            <EmptyState
              icon={FolderIcon}
              title="No projects yet"
              description="Get started by adding your first project."
              className="border-0 py-10"
            />
          </CardPanel>
        </Card>
      </CardFrame>
    </div>
  )
}
