"use client";

import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    heading: "Highlights",
    body: "This release focuses on performance and polish. Cold starts are faster, the command palette opens instantly, and dozens of small layout issues have been resolved across the app.",
  },
  {
    heading: "New components",
    body: "We shipped a sheet primitive that slides in from any edge, a refreshed command menu, and a navigation menu with keyboard support. Each ships with sensible defaults and full theming.",
  },
  {
    heading: "Accessibility",
    body: "Focus is now trapped and restored correctly for every overlay. Screen reader announcements were tuned, and all interactive targets meet the minimum size guidance for pointer and touch input.",
  },
  {
    heading: "Theming",
    body: "Brand accent now flows through rings, charts, and success states from a single token. Override it once in your project and every component re-skins to match without touching component source.",
  },
  {
    heading: "Performance",
    body: "Bundle size dropped after removing the animation runtime in favor of pure CSS transitions. Lists virtualize sooner, and large tables scroll smoothly even with thousands of rows on screen.",
  },
  {
    heading: "Bug fixes",
    body: "Resolved a flicker when opening overlays back to back, fixed a tooltip that lingered after navigation, and corrected the date picker rolling to the wrong month near time zone boundaries.",
  },
  {
    heading: "Deprecations",
    body: "The legacy drawer export is deprecated in favor of the sheet component and will be removed in the next major version. A codemod is available to migrate existing usages automatically.",
  },
  {
    heading: "Upgrade notes",
    body: "No breaking changes are required for most projects. Re-run the registry sync to pull the latest component source, then review the migration guide if you relied on the deprecated drawer.",
  },
];

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" />}>
        View release notes
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Release notes</SheetTitle>
          <SheetDescription>
            Everything that shipped in the latest version.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col gap-4">
            {SECTIONS.map(({ heading, body }) => (
              <div key={heading} className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">{heading}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button />}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
