"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handlePublish() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setDone(true);
    setOpen(false);
  }

  return (
    <div className="flex items-center justify-center gap-4 p-16">
      {done && (
        <p className="text-sm text-muted-foreground">
          Published!{" "}
          <button
            className="underline underline-offset-2 hover:text-foreground"
            onClick={() => setDone(false)}
          >
            Reset
          </button>
        </p>
      )}
      <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
        <DialogTrigger render={<Button />}>Publish</DialogTrigger>
        <DialogContent showCloseButton={!loading}>
          <DialogHeader>
            <DialogTitle>Publish changes</DialogTitle>
            <DialogDescription>
              This will make your changes visible to everyone. Review them
              before continuing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" disabled={loading} />}
            >
              Cancel
            </DialogClose>
            <Button onClick={handlePublish} disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Publishing…
                </>
              ) : (
                "Publish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
