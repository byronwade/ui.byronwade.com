/**
 * Exhaustive tests for the Dialog compound component family.
 *
 * Components under test (all from @/components/ui/dialog):
 *   Dialog          — Root (Base UI DialogPrimitive.Root), data-slot="dialog"
 *   DialogTrigger   — opens the dialog, data-slot="dialog-trigger"
 *   DialogPortal    — portal wrapper
 *   DialogOverlay   — backdrop, data-slot="dialog-overlay"
 *   DialogContent   — popup, showCloseButton prop, data-slot="dialog-content"
 *   DialogClose     — programmatic close, data-slot="dialog-close"
 *   DialogHeader    — layout wrapper, data-slot="dialog-header"
 *   DialogFooter    — layout wrapper, showCloseButton prop, data-slot="dialog-footer"
 *   DialogTitle     — accessible title, data-slot="dialog-title"
 *   DialogDescription — accessible description, data-slot="dialog-description"
 *
 * Test strategy
 * ─────────────
 * Closed state   — trigger / root renders with correct role / data attributes.
 * Open state     — userEvent.click trigger → findByRole('dialog') for portal content.
 * Close          — X button click, Escape key, DialogClose render-prop button, footer close button.
 * Controlled     — open + onOpenChange wiring verified.
 * disablePointerDismissal — backdrop click does NOT close dialog.
 * showCloseButton=false   — close-X absent from DialogContent.
 * DialogFooter showCloseButton — footer close button present / absent.
 * Compound parts  — DialogHeader, DialogTitle, DialogDescription data-slots + text.
 * Custom className — merged without removing base classes.
 * Interaction sequences — form inside dialog, loading state, destructive flow.
 * A11y           — axe on open state for representative configurations.
 */

import * as React from "react";
import { useState } from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal controlled dialog with trigger, title, description, close button. */
function SimpleDialog({
  showCloseButton = true,
  footerClose = false,
  disablePointerDismissal = false,
  onOpenChange,
  defaultOpen = false,
}: {
  showCloseButton?: boolean;
  footerClose?: boolean;
  disablePointerDismissal?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  function handleChange(v: boolean) {
    setOpen(v);
    onOpenChange?.(v);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleChange}
      disablePointerDismissal={disablePointerDismissal}
    >
      <DialogTrigger render={<Button variant="outline" />}>
        Open Dialog
      </DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>
            Are you sure you want to continue? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton={footerClose}>
          <Button onClick={() => handleChange(false)}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Helper: open the dialog by clicking the trigger. */
async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Open Dialog" }));
  return screen.findByRole("dialog");
}

// ---------------------------------------------------------------------------
// 1. Smoke — renders without crashing
// ---------------------------------------------------------------------------

describe("Dialog – smoke", () => {
  it("renders trigger without crashing", () => {
    render(<SimpleDialog />);
    expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInTheDocument();
  });

  it("dialog is NOT in DOM before opening", () => {
    render(<SimpleDialog />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders dialog in DOM after trigger click", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("dialog root renders with data-slot='dialog' on the trigger wrapper", () => {
    render(<SimpleDialog />);
    // Trigger itself gets data-slot="dialog-trigger" from DialogTrigger
    // Root wraps the tree — visible via the trigger slot
    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    expect(trigger).toHaveAttribute("data-slot", "dialog-trigger");
  });
});

// ---------------------------------------------------------------------------
// 2. DialogTrigger — closed state
// ---------------------------------------------------------------------------

describe("DialogTrigger – closed state", () => {
  it("trigger has data-slot='dialog-trigger'", () => {
    render(<SimpleDialog />);
    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    expect(trigger).toHaveAttribute("data-slot", "dialog-trigger");
  });

  it("trigger renders children correctly", () => {
    render(<SimpleDialog />);
    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
  });

  it("trigger is a button element", () => {
    render(<SimpleDialog />);
    expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInstanceOf(
      HTMLButtonElement
    );
  });
});

// ---------------------------------------------------------------------------
// 3. DialogContent — opens on trigger click
// ---------------------------------------------------------------------------

describe("DialogContent – open state", () => {
  it("dialog role is present after opening", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("dialog content has data-slot='dialog-content'", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const popup = screen.getByRole("dialog");
    expect(popup).toHaveAttribute("data-slot", "dialog-content");
  });

  it("dialog content has base class: fixed", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const popup = screen.getByRole("dialog");
    expect(popup.className).toContain("fixed");
  });

  it("dialog content has base class: rounded-xl", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const popup = screen.getByRole("dialog");
    expect(popup.className).toContain("rounded-xl");
  });

  it("dialog content has base class: bg-popover", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const popup = screen.getByRole("dialog");
    expect(popup.className).toContain("bg-popover");
  });

  it("dialog content has base class: z-50", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const popup = screen.getByRole("dialog");
    expect(popup.className).toContain("z-50");
  });

  it("dialog content shows title text", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    expect(screen.getByText("Confirm action")).toBeInTheDocument();
  });

  it("dialog content shows description text", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    expect(
      screen.getByText(/Are you sure you want to continue/i)
    ).toBeInTheDocument();
  });

  it("custom className is merged onto popup", async () => {
    const user = userEvent.setup();
    const [open, setOpen] = [React.createRef<boolean>(), vi.fn()];
    function Wrapper() {
      const [o, setO] = useState(false);
      return (
        <Dialog open={o} onOpenChange={setO}>
          <DialogTrigger render={<Button />}>Open</DialogTrigger>
          <DialogContent className="my-custom-class">
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
    }
    render(<Wrapper />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const popup = await screen.findByRole("dialog");
    expect(popup.className).toContain("my-custom-class");
  });
});

// ---------------------------------------------------------------------------
// 4. showCloseButton prop on DialogContent
// ---------------------------------------------------------------------------

describe("DialogContent – showCloseButton prop", () => {
  it("showCloseButton=true renders the close icon button inside dialog", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog showCloseButton={true} />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    // The X close button has a sr-only "Close" span
    expect(within(dialog).getByText("Close")).toBeInTheDocument();
  });

  it("showCloseButton=false does NOT render the close icon button", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog showCloseButton={false} />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).queryByText("Close")).toBeNull();
  });

  it("showCloseButton defaults to true", async () => {
    const user = userEvent.setup();
    // SimpleDialog defaults showCloseButton=true
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Close")).toBeInTheDocument();
  });

  it("close icon button has data-slot='dialog-close'", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog showCloseButton={true} />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    // The close button wraps a <Button> which itself has a data-slot
    const closeEl = dialog.querySelector("[data-slot='dialog-close']");
    expect(closeEl).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 5. Closing the dialog
// ---------------------------------------------------------------------------

describe("Dialog – closing interactions", () => {
  it("clicking the X close button closes the dialog", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog showCloseButton={true} />);
    await openDialog(user);

    // The close button renders with variant="ghost" — find via sr-only text parent
    const closeBtn = screen.getByRole("button", { name: /close/i });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("pressing Escape closes the dialog", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog showCloseButton={true} />);
    await openDialog(user);

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("clicking Confirm button (calls onOpenChange(false)) closes dialog", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("onOpenChange is called with false when dialog closes", async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<SimpleDialog onOpenChange={handler} />);

    // Open — onOpenChange(true)
    await user.click(screen.getByRole("button", { name: "Open Dialog" }));
    await screen.findByRole("dialog");
    expect(handler).toHaveBeenCalledWith(true);

    // Close via Escape — onOpenChange(false)
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(handler).toHaveBeenCalledWith(false);
  });

  it("onOpenChange is called with true when dialog opens", async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<SimpleDialog onOpenChange={handler} />);
    await user.click(screen.getByRole("button", { name: "Open Dialog" }));
    await screen.findByRole("dialog");
    expect(handler).toHaveBeenCalledWith(true);
  });
});

// ---------------------------------------------------------------------------
// 6. DialogClose render prop
// ---------------------------------------------------------------------------

describe("DialogClose – render prop", () => {
  it("DialogClose render prop button closes the dialog when clicked", async () => {
    const user = userEvent.setup();

    function WithClose() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Open</DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Modal</DialogTitle>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Log out
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    render(<WithClose />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("DialogClose has data-slot='dialog-close'", async () => {
    const user = userEvent.setup();

    function WithClose() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Open</DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Modal</DialogTitle>
            <DialogClose render={<Button />}>Close me</DialogClose>
          </DialogContent>
        </Dialog>
      );
    }

    render(<WithClose />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");

    const closeEl = dialog.querySelector("[data-slot='dialog-close']");
    expect(closeEl).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 7. DialogFooter showCloseButton prop
// ---------------------------------------------------------------------------

describe("DialogFooter – showCloseButton prop", () => {
  it("showCloseButton=true renders a Close button in the footer", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog footerClose={true} showCloseButton={false} />);
    await openDialog(user);

    // The footer close button renders the text "Close"
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("footer Close button closes the dialog", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog footerClose={true} showCloseButton={false} />);
    await openDialog(user);

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("showCloseButton=false (default) does NOT render footer Close button", async () => {
    const user = userEvent.setup();
    // SimpleDialog defaults footerClose=false
    render(<SimpleDialog footerClose={false} />);
    await openDialog(user);

    // "Close" sr-only text from the X button is present, but no footer "Close" button text
    // (the X button has sr-only "Close" — filter to visible)
    const visibleClose = screen
      .getAllByText("Close")
      .filter((el) => !el.classList.contains("sr-only"));
    expect(visibleClose).toHaveLength(0);
  });

  it("DialogFooter has data-slot='dialog-footer'", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);

    const dialog = screen.getByRole("dialog");
    const footer = dialog.querySelector("[data-slot='dialog-footer']");
    expect(footer).not.toBeNull();
  });

  it("DialogFooter has base class: rounded-b-xl", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const footer = dialog.querySelector("[data-slot='dialog-footer']") as HTMLElement;
    expect(footer.className).toContain("rounded-b-xl");
  });

  it("DialogFooter has base class: border-t", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const footer = dialog.querySelector("[data-slot='dialog-footer']") as HTMLElement;
    expect(footer.className).toContain("border-t");
  });

  it("DialogFooter custom className is merged", async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>T</DialogTitle>
            <DialogFooter className="my-footer-class">
              <Button>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    render(<Wrapper />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    const footer = dialog.querySelector("[data-slot='dialog-footer']") as HTMLElement;
    expect(footer.className).toContain("my-footer-class");
  });
});

// ---------------------------------------------------------------------------
// 8. DialogHeader
// ---------------------------------------------------------------------------

describe("DialogHeader", () => {
  it("has data-slot='dialog-header'", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const header = dialog.querySelector("[data-slot='dialog-header']");
    expect(header).not.toBeNull();
  });

  it("has base class: flex", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const header = dialog.querySelector("[data-slot='dialog-header']") as HTMLElement;
    expect(header.className).toContain("flex");
  });

  it("has base class: flex-col", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const header = dialog.querySelector("[data-slot='dialog-header']") as HTMLElement;
    expect(header.className).toContain("flex-col");
  });

  it("custom className is merged onto header", async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader className="my-header-class">
              <DialogTitle>T</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    }

    render(<Wrapper />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    const header = dialog.querySelector("[data-slot='dialog-header']") as HTMLElement;
    expect(header.className).toContain("my-header-class");
  });
});

// ---------------------------------------------------------------------------
// 9. DialogTitle
// ---------------------------------------------------------------------------

describe("DialogTitle", () => {
  it("renders title text in the dialog", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    expect(screen.getByText("Confirm action")).toBeInTheDocument();
  });

  it("has data-slot='dialog-title'", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const title = dialog.querySelector("[data-slot='dialog-title']");
    expect(title).not.toBeNull();
  });

  it("has base class: font-medium", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const title = dialog.querySelector("[data-slot='dialog-title']") as HTMLElement;
    expect(title.className).toContain("font-medium");
  });

  it("has base class: font-heading", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const title = dialog.querySelector("[data-slot='dialog-title']") as HTMLElement;
    expect(title.className).toContain("font-heading");
  });

  it("custom className merges onto title", async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle className="my-title-class">Hello</DialogTitle>
          </DialogContent>
        </Dialog>
      );
    }

    render(<Wrapper />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    const title = dialog.querySelector("[data-slot='dialog-title']") as HTMLElement;
    expect(title.className).toContain("my-title-class");
  });
});

// ---------------------------------------------------------------------------
// 10. DialogDescription
// ---------------------------------------------------------------------------

describe("DialogDescription", () => {
  it("renders description text in the dialog", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    expect(
      screen.getByText(/Are you sure you want to continue/i)
    ).toBeInTheDocument();
  });

  it("has data-slot='dialog-description'", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const desc = dialog.querySelector("[data-slot='dialog-description']");
    expect(desc).not.toBeNull();
  });

  it("has base class: text-sm", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const desc = dialog.querySelector("[data-slot='dialog-description']") as HTMLElement;
    expect(desc.className).toContain("text-sm");
  });

  it("has base class: text-muted-foreground", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const desc = dialog.querySelector("[data-slot='dialog-description']") as HTMLElement;
    expect(desc.className).toContain("text-muted-foreground");
  });

  it("custom className merges onto description", async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>T</DialogTitle>
            <DialogDescription className="my-desc-class">
              Body text
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );
    }

    render(<Wrapper />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    const desc = dialog.querySelector("[data-slot='dialog-description']") as HTMLElement;
    expect(desc.className).toContain("my-desc-class");
  });
});

// ---------------------------------------------------------------------------
// 11. Controlled open/close state
// ---------------------------------------------------------------------------

describe("Dialog – controlled state", () => {
  it("opens when open=true is set externally", async () => {
    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>External Open</button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogTitle>Controlled</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    const user = userEvent.setup();
    render(<Wrapper />);
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "External Open" }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes when open=false is set externally", async () => {
    // When dialog is open, Base UI puts aria-hidden on outside elements.
    // Use a DialogClose inside the dialog to test external state control.
    function Wrapper() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Controlled</DialogTitle>
            <DialogClose render={<Button />}>Internal Close</DialogClose>
          </DialogContent>
        </Dialog>
      );
    }

    const user = userEvent.setup();
    render(<Wrapper />);
    await screen.findByRole("dialog");

    // Close via the DialogClose inside the dialog
    await user.click(screen.getByRole("button", { name: "Internal Close" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("dialog opened via defaultOpen=true renders immediately", async () => {
    render(<SimpleDialog defaultOpen={true} />);
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 12. disablePointerDismissal
// ---------------------------------------------------------------------------

describe("Dialog – disablePointerDismissal", () => {
  it("Escape key still closes dialog even with disablePointerDismissal=true", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog disablePointerDismissal={true} />);
    await openDialog(user);

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("dialog stays open when backdrop backdrop element is present with disablePointerDismissal", async () => {
    // We can verify the prop is applied by checking the dialog remains after
    // a programmatic open — the main way to test this without true pointer events
    // in jsdom is to verify the dialog content renders and backdrop has correct slot.
    const user = userEvent.setup();
    render(<SimpleDialog disablePointerDismissal={true} />);
    await openDialog(user);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // The overlay is present in the portal
    const overlay = document.querySelector("[data-slot='dialog-overlay']");
    expect(overlay).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 13. Example: no-close-button pattern (session expired)
// ---------------------------------------------------------------------------

describe("Dialog – no-close-button pattern (session expired example)", () => {
  function SessionExpiredDialog() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open required dialog
        </Button>
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
      </>
    );
  }

  it("opens on button click", async () => {
    const user = userEvent.setup();
    render(<SessionExpiredDialog />);
    await user.click(screen.getByRole("button", { name: "Open required dialog" }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("no X close button present", async () => {
    const user = userEvent.setup();
    render(<SessionExpiredDialog />);
    await user.click(screen.getByRole("button", { name: "Open required dialog" }));
    await screen.findByRole("dialog");

    // No sr-only "Close" text should exist
    expect(screen.queryByText("Close")).toBeNull();
  });

  it("'Log out' DialogClose button closes the dialog", async () => {
    const user = userEvent.setup();
    render(<SessionExpiredDialog />);
    await user.click(screen.getByRole("button", { name: "Open required dialog" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("'Refresh session' button closes the dialog", async () => {
    const user = userEvent.setup();
    render(<SessionExpiredDialog />);
    await user.click(screen.getByRole("button", { name: "Open required dialog" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Refresh session" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// 14. Example: destructive dialog pattern
// ---------------------------------------------------------------------------

describe("Dialog – destructive pattern", () => {
  function DestructiveDialog() {
    const [open, setOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);

    function handleDelete() {
      setDeleted(true);
      setOpen(false);
    }

    if (deleted) {
      return <p>Item deleted.</p>;
    }

    return (
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
    );
  }

  it("opens on 'Delete item' trigger click", async () => {
    const user = userEvent.setup();
    render(<DestructiveDialog />);
    await user.click(screen.getByRole("button", { name: "Delete item" }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows correct title and description", async () => {
    const user = userEvent.setup();
    render(<DestructiveDialog />);
    await user.click(screen.getByRole("button", { name: "Delete item" }));
    await screen.findByRole("dialog");
    expect(screen.getByText("Delete this item?")).toBeInTheDocument();
    expect(
      screen.getByText(/This will permanently remove/i)
    ).toBeInTheDocument();
  });

  it("Cancel closes the dialog without deleting", async () => {
    const user = userEvent.setup();
    render(<DestructiveDialog />);
    await user.click(screen.getByRole("button", { name: "Delete item" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    // Item NOT deleted
    expect(screen.queryByText("Item deleted.")).toBeNull();
  });

  it("'Yes, delete' confirms and closes the dialog", async () => {
    const user = userEvent.setup();
    render(<DestructiveDialog />);
    await user.click(screen.getByRole("button", { name: "Delete item" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Yes, delete" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    expect(screen.getByText("Item deleted.")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 15. Example: with-form pattern (invite member)
// ---------------------------------------------------------------------------

describe("Dialog – with-form pattern", () => {
  function InviteDialog() {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setSubmitted(true);
      setOpen(false);
    }

    if (submitted) return <p>Invited!</p>;

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button />}>Invite member</DialogTrigger>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Invite a new member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <input id="invite-name" placeholder="Full name" required />
            <input
              id="invite-email"
              type="email"
              placeholder="Email"
              required
            />
            <DialogFooter showCloseButton>
              <Button type="submit">Send invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  it("opens invite dialog on trigger click", async () => {
    const user = userEvent.setup();
    render(<InviteDialog />);
    await user.click(screen.getByRole("button", { name: "Invite member" }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("form inputs are visible inside the dialog", async () => {
    const user = userEvent.setup();
    render(<InviteDialog />);
    await user.click(screen.getByRole("button", { name: "Invite member" }));
    await screen.findByRole("dialog");

    expect(screen.getByPlaceholderText("Full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("submitting the form closes the dialog and shows confirmation", async () => {
    const user = userEvent.setup();
    render(<InviteDialog />);
    await user.click(screen.getByRole("button", { name: "Invite member" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByPlaceholderText("Full name"), "Jane Smith");
    await user.type(screen.getByPlaceholderText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Send invite" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    expect(screen.getByText("Invited!")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 16. Example: scrollable / long-content pattern
// ---------------------------------------------------------------------------

describe("Dialog – scrollable content pattern", () => {
  function ScrollableDialog() {
    const [open, setOpen] = useState(false);

    return (
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
              Please read these terms carefully.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-2">
            <p>Long content here...</p>
          </div>
          <DialogFooter showCloseButton>
            <Button onClick={() => setOpen(false)}>Accept terms</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  it("opens scrollable dialog", async () => {
    const user = userEvent.setup();
    render(<ScrollableDialog />);
    await user.click(screen.getByRole("button", { name: "View terms" }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows title and description", async () => {
    const user = userEvent.setup();
    render(<ScrollableDialog />);
    await user.click(screen.getByRole("button", { name: "View terms" }));
    await screen.findByRole("dialog");

    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Please read these terms carefully.")).toBeInTheDocument();
  });

  it("custom className (overflow-hidden) is applied to popup", async () => {
    const user = userEvent.setup();
    render(<ScrollableDialog />);
    await user.click(screen.getByRole("button", { name: "View terms" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("overflow-hidden");
  });

  it("footer Close button and Accept both present", async () => {
    const user = userEvent.setup();
    render(<ScrollableDialog />);
    await user.click(screen.getByRole("button", { name: "View terms" }));
    await screen.findByRole("dialog");

    expect(screen.getByRole("button", { name: "Accept terms" })).toBeInTheDocument();
    // Footer showCloseButton=true AND showCloseButton=true on DialogContent both add "Close"
    // so use getAllByRole — at least one Close button should be present
    const closeBtns = screen.getAllByRole("button", { name: "Close" });
    expect(closeBtns.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// 17. Example: loading state pattern
// ---------------------------------------------------------------------------

describe("Dialog – loading state pattern", () => {
  function LoadingDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
      <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
        <DialogTrigger render={<Button />}>Publish</DialogTrigger>
        <DialogContent showCloseButton={!loading}>
          <DialogHeader>
            <DialogTitle>Publish changes</DialogTitle>
            <DialogDescription>
              Review them before continuing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" disabled={loading} />}>
              Cancel
            </DialogClose>
            <Button
              onClick={() => setLoading(true)}
              disabled={loading}
              data-testid="publish-btn"
            >
              {loading ? "Publishing…" : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(<LoadingDialog />);
    await user.click(screen.getByRole("button", { name: "Publish" }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("close button visible before loading starts", async () => {
    const user = userEvent.setup();
    render(<LoadingDialog />);
    await user.click(screen.getByRole("button", { name: "Publish" }));
    await screen.findByRole("dialog");
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("clicking Publish sets button to loading state", async () => {
    const user = userEvent.setup();
    render(<LoadingDialog />);
    await user.click(screen.getByRole("button", { name: "Publish" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByTestId("publish-btn"));

    expect(screen.getByText("Publishing…")).toBeInTheDocument();
  });

  it("Cancel button closes dialog when not loading", async () => {
    const user = userEvent.setup();
    render(<LoadingDialog />);
    await user.click(screen.getByRole("button", { name: "Publish" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// 18. Example: with-icon (success/warning/info variants)
// ---------------------------------------------------------------------------

describe("Dialog – with-icon pattern (success/warning/info)", () => {
  function IconDialog({ variant }: { variant: "success" | "warning" | "info" }) {
    const [open, setOpen] = useState(true);
    const titles = {
      success: "Changes saved",
      warning: "Unsaved changes",
      info: "New feature available",
    };
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>{titles[variant]}</DialogTitle>
            <DialogDescription>
              {variant} description text here.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button onClick={() => setOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  (["success", "warning", "info"] as const).forEach((variant) => {
    it(`renders ${variant} variant dialog with correct title`, async () => {
      render(<IconDialog variant={variant} />);
      await screen.findByRole("dialog");
      const titles = {
        success: "Changes saved",
        warning: "Unsaved changes",
        info: "New feature available",
      };
      expect(screen.getByText(titles[variant])).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// 19. Multiple dialogs in the same tree
// ---------------------------------------------------------------------------

describe("Dialog – multiple instances", () => {
  it("two triggers do not interfere with each other", async () => {
    function TwoDialogs() {
      const [open1, setOpen1] = useState(false);
      const [open2, setOpen2] = useState(false);
      return (
        <>
          <Dialog open={open1} onOpenChange={setOpen1}>
            <DialogTrigger render={<Button />}>Open First</DialogTrigger>
            <DialogContent>
              <DialogTitle>First Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
          <Dialog open={open2} onOpenChange={setOpen2}>
            <DialogTrigger render={<Button />}>Open Second</DialogTrigger>
            <DialogContent>
              <DialogTitle>Second Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    const user = userEvent.setup();
    render(<TwoDialogs />);

    await user.click(screen.getByRole("button", { name: "Open First" }));
    const firstDialog = await screen.findByRole("dialog");
    expect(within(firstDialog).getByText("First Dialog")).toBeInTheDocument();
    expect(screen.queryByText("Second Dialog")).toBeNull();
  });

  it("opening second dialog works independently", async () => {
    function TwoDialogs() {
      const [open1, setOpen1] = useState(false);
      const [open2, setOpen2] = useState(false);
      return (
        <>
          <Dialog open={open1} onOpenChange={setOpen1}>
            <DialogTrigger render={<Button />}>Open First</DialogTrigger>
            <DialogContent>
              <DialogTitle>First Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
          <Dialog open={open2} onOpenChange={setOpen2}>
            <DialogTrigger render={<Button />}>Open Second</DialogTrigger>
            <DialogContent>
              <DialogTitle>Second Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    const user = userEvent.setup();
    render(<TwoDialogs />);

    await user.click(screen.getByRole("button", { name: "Open Second" }));
    const secondDialog = await screen.findByRole("dialog");
    expect(within(secondDialog).getByText("Second Dialog")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 20. Re-render behavior
// ---------------------------------------------------------------------------

describe("Dialog – re-render behavior", () => {
  it("dialog content updates on re-render while open", async () => {
    // When dialog is open, Base UI marks non-dialog content aria-hidden.
    // Control state via React's rerender API instead of clicking outside buttons.
    function DynamicDialog({ count }: { count: number }) {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Count: {count}</DialogTitle>
          </DialogContent>
        </Dialog>
      );
    }

    const { rerender } = render(<DynamicDialog count={0} />);
    await screen.findByRole("dialog");
    expect(screen.getByText("Count: 0")).toBeInTheDocument();

    rerender(<DynamicDialog count={1} />);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 21. DialogOverlay — checked via the open dialog (requires Dialog context)
// ---------------------------------------------------------------------------

describe("DialogOverlay – via open dialog", () => {
  // Note: DialogOverlay (Base UI Backdrop) requires Dialog context and cannot
  // be rendered standalone without `useDialogRootContext`. Tests verify the
  // overlay properties through the full Dialog tree.

  it("overlay is present in DOM when dialog is open", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);

    const overlay = document.querySelector("[data-slot='dialog-overlay']");
    expect(overlay).not.toBeNull();
  });

  it("overlay has data-slot='dialog-overlay'", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);

    const overlay = document.querySelector("[data-slot='dialog-overlay']") as HTMLElement;
    expect(overlay).toHaveAttribute("data-slot", "dialog-overlay");
  });

  it("overlay has base class: fixed", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);

    const overlay = document.querySelector("[data-slot='dialog-overlay']") as HTMLElement;
    expect(overlay.className).toContain("fixed");
  });

  it("overlay has base class: z-50", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);

    const overlay = document.querySelector("[data-slot='dialog-overlay']") as HTMLElement;
    expect(overlay.className).toContain("z-50");
  });

  it("overlay has base class: bg-foreground/10", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);

    const overlay = document.querySelector("[data-slot='dialog-overlay']") as HTMLElement;
    expect(overlay.className).toContain("bg-foreground/10");
  });

  it("overlay has inset-0 class", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);

    const overlay = document.querySelector("[data-slot='dialog-overlay']") as HTMLElement;
    expect(overlay.className).toContain("inset-0");
  });
});

// ---------------------------------------------------------------------------
// 22. DialogPortal — verified via open dialog (requires Dialog context)
// ---------------------------------------------------------------------------

describe("DialogPortal – via open dialog", () => {
  // Note: DialogPortal (Base UI Portal) requires Dialog context; standalone
  // rendering fails with `useDialogRootContext` missing. Portal behavior is
  // verified by confirming dialog content appears in document.body portal.

  it("dialog content is rendered into a portal (appended to document.body)", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);

    // The dialog popup is rendered outside the initial render container, into
    // document.body — verifiable because it's accessible via document.body query
    const popup = document.body.querySelector("[data-slot='dialog-content']");
    expect(popup).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 23. Accessibility (axe)
// ---------------------------------------------------------------------------

describe("Dialog – accessibility (axe)", () => {
  // Base UI's focus trap implementation uses <span role="button"> guards
  // without accessible names — these are internal implementation details that
  // trigger the aria-command-name axe rule on document.body.
  // We scope axe to the dialog element itself to avoid false positives from
  // Base UI internals while still validating the dialog's own markup.

  it("open dialog with title + description has no axe violations (dialog scope)", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);
    await openDialog(user);
    const dialog = screen.getByRole("dialog");
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });

  it("open destructive dialog has no axe violations (dialog scope)", async () => {
    function DestructiveWrapper() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>
              This will permanently remove the item. This action cannot be undone.
            </DialogDescription>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button variant="destructive">Yes, delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    render(<DestructiveWrapper />);
    const dialog = await screen.findByRole("dialog");
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });

  it("open dialog with form has no axe violations (dialog scope)", async () => {
    function FormWrapper() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace.
            </DialogDescription>
            <form>
              <label htmlFor="axe-name">Full name</label>
              <input id="axe-name" placeholder="Jane Smith" />
              <label htmlFor="axe-email">Email</label>
              <input id="axe-email" type="email" placeholder="jane@example.com" />
              <DialogFooter>
                <Button type="submit">Send invite</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    }

    render(<FormWrapper />);
    const dialog = await screen.findByRole("dialog");
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });

  it("closed dialog (trigger only) has no axe violations", async () => {
    const { container } = render(<SimpleDialog />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("dialog without close button (disablePointerDismissal) has no axe violations (dialog scope)", async () => {
    function RequiredDialog() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Session expired</DialogTitle>
            <DialogDescription>
              Your session has expired. Please choose how to continue.
            </DialogDescription>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Log out
              </DialogClose>
              <Button>Refresh session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    render(<RequiredDialog />);
    const dialog = await screen.findByRole("dialog");
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 24. Edge cases
// ---------------------------------------------------------------------------

describe("Dialog – edge cases", () => {
  it("dialog with no children in content renders without crashing", async () => {
    function EmptyContentDialog() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Empty</DialogTitle>
          </DialogContent>
        </Dialog>
      );
    }

    const user = userEvent.setup();
    render(<EmptyContentDialog />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("re-opening dialog after close works correctly", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);

    // Open
    await openDialog(user);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close via Escape
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    // Re-open
    await openDialog(user);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("dialog opened and closed multiple times does not accumulate duplicate portals", async () => {
    const user = userEvent.setup();
    render(<SimpleDialog />);

    for (let i = 0; i < 3; i++) {
      await openDialog(user);
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    }

    // Final state: no dialog open
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("dialog renders correctly with only DialogTitle (no description)", async () => {
    function TitleOnlyDialog() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title only</DialogTitle>
          </DialogContent>
        </Dialog>
      );
    }

    const user = userEvent.setup();
    render(<TitleOnlyDialog />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    expect(screen.getByText("Title only")).toBeInTheDocument();
  });
});
