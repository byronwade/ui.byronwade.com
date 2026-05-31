"use client";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-3 p-8">
      <Toaster position="bottom-right" richColors />

      <p className="text-sm text-muted-foreground mb-1">
        Rich colors — each variant gets a distinct background.
      </p>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.success("Account created successfully.", { richColors: true })}
      >
        Rich success
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.error("Permission denied.", { richColors: true })}
      >
        Rich error
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.info("Two-factor authentication enabled.", { richColors: true })}
      >
        Rich info
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.warning("Password expires in 3 days.", { richColors: true })}
      >
        Rich warning
      </button>
    </div>
  );
}
