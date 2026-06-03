import * as React from "react";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SimpleSheet({
  side = "right" as const,
  showCloseButton = true,
  defaultOpen = false,
  onOpenChange,
}: {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  function handleChange(value: boolean) {
    setOpen(value);
    onOpenChange?.(value);
  }

  return (
    <Sheet open={open} onOpenChange={handleChange}>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>Sheet description</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button onClick={() => handleChange(false)}>Done</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet – smoke", () => {
  it("renders trigger without crashing", () => {
    render(<SimpleSheet />);
    expect(screen.getByRole("button", { name: "Open sheet" })).toBeInTheDocument();
  });

  it("sheet dialog is absent before open", () => {
    render(<SimpleSheet />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Sheet – open state", () => {
  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(<SimpleSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("shows title and description when open", async () => {
    const user = userEvent.setup();
    render(<SimpleSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    expect(await screen.findByText("Sheet title")).toBeInTheDocument();
    expect(screen.getByText("Sheet description")).toBeInTheDocument();
  });

  it("content has data-side attribute", async () => {
    const user = userEvent.setup();
    render(<SimpleSheet side="left" />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");
    expect(document.querySelector("[data-slot='sheet-content']")).toHaveAttribute(
      "data-side",
      "left"
    );
  });

  it.each(["top", "bottom", "left", "right"] as const)(
    "supports side=%s",
    async (side) => {
      const user = userEvent.setup();
      render(<SimpleSheet side={side} />);
      await user.click(screen.getByRole("button", { name: "Open sheet" }));
      await screen.findByRole("dialog");
      expect(document.querySelector("[data-slot='sheet-content']")).toHaveAttribute(
        "data-side",
        side
      );
    }
  );

  it("showCloseButton=false hides close button", async () => {
    const user = userEvent.setup();
    render(<SimpleSheet showCloseButton={false} />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });
});

describe("Sheet – interaction", () => {
  it("closes via close button", async () => {
    const user = userEvent.setup();
    render(<SimpleSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when opened", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<SimpleSheet onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("SheetClose render prop closes sheet", async () => {
    const user = userEvent.setup();
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetClose render={<Button variant="ghost" />}>Dismiss</SheetClose>
        </SheetContent>
      </Sheet>
    );
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Sheet – structure", () => {
  it("renders header, footer, title, and description slots when open", async () => {
    const user = userEvent.setup();
    render(<SimpleSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");
    expect(
      document.querySelector("[data-slot='sheet-header']")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='sheet-footer']")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='sheet-title']")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='sheet-description']")
    ).toBeInTheDocument();
  });

  it("renders a labeled form field inside the sheet when open", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Edit profile
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Update your details.</SheetDescription>
          </SheetHeader>
          <form className="flex flex-col gap-3 px-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sheet-name">Name</Label>
              <Input id="sheet-name" defaultValue="Ada Lovelace" />
            </div>
          </form>
          <SheetFooter>
            <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    await screen.findByRole("dialog");
    expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace");
    expect(
      screen.getByRole("button", { name: "Cancel" })
    ).toBeInTheDocument();
  });
});

describe("Sheet – accessibility", () => {
  it("open sheet has no axe violations", async () => {
    const user = userEvent.setup();
    const { container } = render(<SimpleSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");
    expect(await axe(container)).toHaveNoViolations();
  });
});
