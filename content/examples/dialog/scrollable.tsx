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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TERMS = [
  {
    heading: "1. Acceptance of Terms",
    body: "By accessing or using this service, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use the service.",
  },
  {
    heading: "2. Use License",
    body: "Permission is granted to temporarily use this service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, or remove any copyright or other proprietary notations from the materials.",
  },
  {
    heading: "3. Disclaimer",
    body: "The materials on this service are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
  },
  {
    heading: "4. Limitations",
    body: "In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this service.",
  },
  {
    heading: "5. Accuracy of Materials",
    body: "The materials appearing on this service could include technical, typographical, or photographic errors. We do not warrant that any of the materials on this service are accurate, complete, or current. We may make changes to the materials at any time without notice.",
  },
  {
    heading: "6. Links",
    body: "We have not reviewed all of the sites linked to this service and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.",
  },
  {
    heading: "7. Modifications",
    body: "We may revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.",
  },
  {
    heading: "8. Governing Law",
    body: "These terms and conditions are governed by and construed in accordance with applicable law and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
  },
];

export default function Example() {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  function handleAccept() {
    setAccepted(true);
    setOpen(false);
  }

  return (
    <div className="flex items-center justify-center gap-4 p-16">
      {accepted ? (
        <p className="text-sm text-muted-foreground">
          Terms accepted.{" "}
          <button
            className="underline underline-offset-2 hover:text-foreground"
            onClick={() => setAccepted(false)}
          >
            Reset
          </button>
        </p>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button variant="outline" />}>
            View terms
          </DialogTrigger>
          <DialogContent
            showCloseButton
            className="flex max-h-[80vh] max-w-lg flex-col overflow-hidden"
          >
            <DialogHeader>
              <DialogTitle>Terms of Service</DialogTitle>
              <DialogDescription>
                Please read these terms carefully before using the service.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-2">
              <div className="flex flex-col gap-4">
                {TERMS.map(({ heading, body }) => (
                  <div key={heading} className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{heading}</p>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button onClick={handleAccept}>Accept terms</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
