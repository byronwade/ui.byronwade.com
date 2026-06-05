import { FolderOpen } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-0 bg-background p-8">
      <div className="w-full max-w-md">
        <EmptyState
          icon={FolderOpen}
          title="No files yet"
          description="Upload your first file to get started. Supported formats include PDF, PNG, and JPEG."
          action={<Button size="sm">Upload file</Button>}
        />
      </div>
    </div>
  )
}
