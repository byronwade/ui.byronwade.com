"use client";

import { useState } from "react";
import {
  Dialog,
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

  return (
    <div className="flex items-center justify-center p-16">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open required dialog
      </Button>

      {/* disablePointerDismissal — user must choose an action to close */}
      <Dialog
        open={open}
        onOpenChange={setOpen}
        disablePointerDismissal={true}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Session expired</DialogTitle>
            <DialogDescription>
              Your session has expired. Please choose how you would like to
              continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Log out
            </DialogClose>
            <Button onClick={() => setOpen(false)}>Refresh session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
