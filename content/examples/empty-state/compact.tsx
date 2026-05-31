import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-sm">
        {/* Reduced padding via className — useful inside sidebars, panels, or cards */}
        <EmptyState
          icon={Inbox}
          title="Inbox is empty"
          description="New notifications will appear here."
          className="py-8"
        />
      </div>
    </div>
  );
}
