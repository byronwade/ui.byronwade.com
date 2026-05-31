"use client";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-3 p-8">
      <Toaster position="bottom-right" />

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.success("Export complete.", {
            description: "Your report has been saved to Downloads/report.csv.",
          })
        }
      >
        Success with description
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.error("Upload failed.", {
            description: "The file exceeds the 25 MB size limit. Please compress it and try again.",
          })
        }
      >
        Error with description
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.info("New version available.", {
            description: "Version 3.2.0 includes performance improvements and bug fixes.",
          })
        }
      >
        Info with description
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.warning("API rate limit approaching.", {
            description: "You have used 80% of your hourly quota. Requests may be throttled.",
          })
        }
      >
        Warning with description
      </button>
    </div>
  );
}
