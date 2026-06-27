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
  SheetPanel,
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

// ---------------------------------------------------------------------------
// Drawer variants — showBar, inset variant, SheetPanel, bare footer, nesting
// ---------------------------------------------------------------------------

describe("Sheet – drawer variants", () => {
  it("defaults to variant='default' on the content", async () => {
    const user = userEvent.setup();
    render(<SimpleSheet />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");
    expect(
      document.querySelector("[data-slot='sheet-content']")
    ).toHaveAttribute("data-variant", "default");
  });

  it("variant='inset' sets data-variant='inset'", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
        <SheetContent side="right" variant="inset">
          <SheetHeader>
            <SheetTitle>Inset</SheetTitle>
            <SheetDescription>Floating drawer</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    const content = document.querySelector("[data-slot='sheet-content']");
    expect(content).toHaveAttribute("data-variant", "inset");
    expect((content as HTMLElement).className).toContain("rounded-3xl");
  });

  it("showBar renders a grab bar; omitting it does not", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Sheet defaultOpen>
        <SheetContent side="bottom" showBar showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Bar</SheetTitle>
            <SheetDescription>Has a grab bar</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
    await screen.findByRole("dialog");
    expect(
      document.querySelector("[data-slot='sheet-bar']")
    ).toBeInTheDocument();

    rerender(
      <Sheet defaultOpen>
        <SheetContent side="bottom" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>No bar</SheetTitle>
            <SheetDescription>No grab bar</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
    expect(document.querySelector("[data-slot='sheet-bar']")).toBeNull();
    void user;
  });

  it("SheetPanel renders a body region and forwards className", async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="right" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Record</SheetTitle>
            <SheetDescription>Details</SheetDescription>
          </SheetHeader>
          <SheetPanel className="grid gap-4">
            <p>Body content</p>
          </SheetPanel>
        </SheetContent>
      </Sheet>
    );
    await screen.findByRole("dialog");
    const panel = document.querySelector("[data-slot='sheet-panel']");
    expect(panel).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect((panel as HTMLElement).className).toContain("grid");
    expect((panel as HTMLElement).className).toContain("flex-1");
  });

  it("SheetFooter variant='bare' lays out as a row", async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="bottom" showBar showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Step</SheetTitle>
            <SheetDescription>Footer is bare</SheetDescription>
          </SheetHeader>
          <SheetFooter variant="bare" className="justify-center">
            <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
    await screen.findByRole("dialog");
    const footer = document.querySelector("[data-slot='sheet-footer']");
    expect(footer).toHaveAttribute("data-variant", "bare");
    expect((footer as HTMLElement).className).toContain("flex-row");
  });

  it("default footer stays a column", async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="right" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>T</SheetTitle>
            <SheetDescription>D</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
    await screen.findByRole("dialog");
    const footer = document.querySelector("[data-slot='sheet-footer']");
    expect(footer).toHaveAttribute("data-variant", "default");
    expect((footer as HTMLElement).className).toContain("flex-col");
  });

  it("opens a nested drawer from within a footer", async () => {
    const user = userEvent.setup();
    render(
      <Sheet defaultOpen>
        <SheetContent side="right" variant="inset" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>First</SheetTitle>
            <SheetDescription>Outer drawer</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>
                Edit details
              </SheetTrigger>
              <SheetContent side="right" variant="inset" showCloseButton={false}>
                <SheetHeader>
                  <SheetTitle>Edit details</SheetTitle>
                  <SheetDescription>Inner drawer</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
    await user.click(screen.getByRole("button", { name: "Edit details" }));
    expect(await screen.findByText("Inner drawer")).toBeInTheDocument();
  });

  it("an inset drawer with a grab bar has no axe violations", async () => {
    const { container } = render(
      <Sheet defaultOpen>
        <SheetContent side="bottom" showBar showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Accessible drawer</SheetTitle>
            <SheetDescription>With a grab bar.</SheetDescription>
          </SheetHeader>
          <SheetPanel>
            <p>Body</p>
          </SheetPanel>
        </SheetContent>
      </Sheet>
    );
    await screen.findByRole("dialog");
    expect(await axe(container)).toHaveNoViolations();
  });
});
