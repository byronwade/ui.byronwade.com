"use client";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-3 p-8">
      <Toaster position="top-right" />
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.success("File saved successfully.")}
      >
        Success
      </button>
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.error("Something went wrong.")}
      >
        Error
      </button>
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.info("Update available.")}
      >
        Info
      </button>
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.warning("Low disk space.")}
      >
        Warning
      </button>
      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.loading("Uploading…")}
      >
        Loading
      </button>
    </div>
  );
}
