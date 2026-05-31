import { PlusCircle } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-md">
        <EmptyState
          icon={PlusCircle}
          title="Your workspace is empty"
          description="Invite teammates or create your first project to start collaborating."
          action={
            <div className="flex gap-2">
              <Button size="sm">Create project</Button>
              <Button size="sm" variant="outline">Invite team</Button>
            </div>
          }
        />
      </div>
    </div>
  );
}
