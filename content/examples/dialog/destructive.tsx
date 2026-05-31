"use client";

import { useState } from "react";
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
  const [deleted, setDeleted] = useState(false);

  function handleDelete() {
    setDeleted(true);
    setOpen(false);
  }

  return (
    <div className="flex items-center justify-center gap-4 p-16">
      {deleted ? (
        <p className="text-sm text-muted-foreground">
          Item deleted.{" "}
          <button
            className="underline underline-offset-2 hover:text-foreground"
            onClick={() => setDeleted(false)}
          >
            Undo
          </button>
        </p>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button variant="destructive" />}>
            Delete item
          </DialogTrigger>
          <DialogContent showCloseButton>
            <DialogHeader>
              <DialogTitle>Delete this item?</DialogTitle>
              <DialogDescription>
                This will permanently remove the item and all associated data.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button variant="destructive" onClick={handleDelete}>
                Yes, delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
