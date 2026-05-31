"use client";

import { useState } from "react";
import { CheckCircle2Icon, AlertTriangleIcon, InfoIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Variant = "success" | "warning" | "info";

const variants: Record<
  Variant,
  {
    icon: React.ElementType;
    iconClass: string;
    title: string;
    description: string;
    label: string;
  }
> = {
  success: {
    icon: CheckCircle2Icon,
    iconClass: "text-emerald-500",
    title: "Changes saved",
    description:
      "Your settings have been updated and are now live. No further action is required.",
    label: "Success",
  },
  warning: {
    icon: AlertTriangleIcon,
    iconClass: "text-amber-500",
    title: "Unsaved changes",
    description:
      "You have unsaved changes. Leaving now will discard them. Do you want to continue?",
    label: "Warning",
  },
  info: {
    icon: InfoIcon,
    iconClass: "text-blue-500",
    title: "New feature available",
    description:
      "A new version of the editor is available. Upgrade to access the latest improvements and fixes.",
    label: "Info",
  },
};

export default function Example() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<Variant>("success");

  function openWith(v: Variant) {
    setVariant(v);
    setOpen(true);
  }

  const { icon: Icon, iconClass, title, description, label } = variants[variant];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-16">
      {(Object.keys(variants) as Variant[]).map((v) => (
        <Button key={v} variant="outline" onClick={() => openWith(v)}>
          {variants[v].label}
        </Button>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 shrink-0 ${iconClass}`}>
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button onClick={() => setOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
