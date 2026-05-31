"use client";

import { AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function Example() {
  const handleRetry = () => {
    // Simulate retry
    console.log("Retrying...");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-md">
        <EmptyState
          icon={AlertCircle}
          title="Something went wrong"
          description="We couldn't load your data. This might be a temporary issue — please try again."
          action={
            <Button size="sm" variant="destructive" onClick={handleRetry}>
              Try again
            </Button>
          }
          className="border-destructive/30"
        />
      </div>
    </div>
  );
}
