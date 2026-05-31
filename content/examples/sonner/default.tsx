"use client";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Example() {
  return (
    <div className="flex flex-col gap-3 p-8">
      <Toaster position="top-right" />
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.success("File saved successfully.")}
      >
        Show success
      </button>
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.error("Something went wrong.")}
      >
        Show error
      </button>
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.info("Update available.")}
      >
        Show info
      </button>
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.warning("Low disk space.")}
      >
        Show warning
      </button>
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.loading("Uploading…")}
      >
        Show loading
      </button>
    </div>
  );
}
