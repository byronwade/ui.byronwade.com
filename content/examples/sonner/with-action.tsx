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
          toast("Item moved to trash.", {
            action: {
              label: "Undo",
              onClick: () => toast.success("Item restored."),
            },
          })
        }
      >
        With undo action
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.error("Submission failed.", {
            description: "Check your connection and try again.",
            action: {
              label: "Retry",
              onClick: () => toast.loading("Retrying…"),
            },
          })
        }
      >
        Error with retry action
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.info("New update available.", {
            description: "Version 4.0.0 is ready to install.",
            action: {
              label: "Install now",
              onClick: () => toast.loading("Installing update…"),
            },
            cancel: {
              label: "Later",
              onClick: () => {},
            },
          })
        }
      >
        With action and cancel
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.warning("Unsaved changes.", {
            description: "You have unsaved changes that will be lost.",
            action: {
              label: "Save",
              onClick: () => toast.success("Changes saved."),
            },
            cancel: {
              label: "Discard",
              onClick: () => toast("Changes discarded."),
            },
          })
        }
      >
        With save and discard
      </button>
    </div>
  );
}
