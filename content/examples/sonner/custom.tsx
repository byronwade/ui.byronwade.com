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
          toast.custom((id) => (
            <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 shadow-md w-72">
              <span className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-700 text-base">
                🎉
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">Milestone reached!</p>
                <p className="text-xs text-muted-foreground mt-0.5">You&apos;ve completed 100 tasks.</p>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground text-xs shrink-0"
                onClick={() => toast.dismiss(id)}
              >
                ✕
              </button>
            </div>
          ))
        }
      >
        Custom JSX toast
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.custom((id) => (
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 shadow-md w-80">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-900">Invite sent</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  An invitation has been sent to <strong>alex@example.com</strong>.
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => toast.dismiss(id)}
                  >
                    View team
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded text-blue-700 hover:underline"
                    onClick={() => toast.dismiss(id)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      >
        Custom styled toast with actions
      </button>
    </div>
  );
}
