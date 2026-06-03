/**
 * Tests for the Collapsible compound component family.
 *
 * Components under test (all from @/components/ui/collapsible):
 *   Collapsible         — Root wrapper (Base UI Collapsible.Root), data-slot="collapsible"
 *   CollapsibleTrigger  — Trigger button, data-slot="collapsible-trigger"
 *   CollapsibleContent  — Panel/content area, data-slot="collapsible-content"
 *
 * Root props exercised: open, defaultOpen, onOpenChange, disabled, className.
 *
 * Coverage:
 *   Smoke / data-slot attributes / ARIA wiring
 *   Default-closed → reveal-on-click (findByText)
 *   Controlled (open + onOpenChange) and uncontrolled (defaultOpen)
 *   Disabled trigger does not toggle
 *   className passthrough on every part
 *   Accessibility via axe (no disabled rules)
 */

import * as React from "react";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

// ─── Reusable helper ──────────────────────────────────────────────────────────

function Demo({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger render={<Button variant="outline" />}>
        Toggle section
      </CollapsibleTrigger>
      <CollapsibleContent>Hidden details</CollapsibleContent>
    </Collapsible>
  );
}

// ─── 1. Smoke ───────────────────────────────────────────────────────────────

describe("Collapsible – smoke", () => {
  it("renders trigger without crashing", () => {
    render(<Demo />);
    expect(
      screen.getByRole("button", { name: "Toggle section" })
    ).toBeInTheDocument();
  });

  it("renders the trigger label text", () => {
    render(<Demo />);
    expect(screen.getByText("Toggle section")).toBeInTheDocument();
  });

  it("renders a plain (no render-prop) trigger as a button", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Plain trigger</CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>
    );
    expect(
      screen.getByRole("button", { name: "Plain trigger" })
    ).toBeInTheDocument();
  });
});

// ─── 2. data-slot attributes ──────────────────────────────────────────────────

describe("Collapsible – data-slot attributes", () => {
  it("root has data-slot='collapsible'", () => {
    const { container } = render(<Demo />);
    expect(
      container.querySelector("[data-slot='collapsible']")
    ).toBeInTheDocument();
  });

  it("trigger has data-slot='collapsible-trigger'", () => {
    const { container } = render(<Demo />);
    expect(
      container.querySelector("[data-slot='collapsible-trigger']")
    ).toBeInTheDocument();
  });

  it("content has data-slot='collapsible-content' when open", () => {
    const { container } = render(<Demo defaultOpen />);
    expect(
      container.querySelector("[data-slot='collapsible-content']")
    ).toBeInTheDocument();
  });
});

// ─── 3. ARIA wiring ───────────────────────────────────────────────────────────

describe("Collapsible – ARIA wiring", () => {
  it("closed trigger has aria-expanded='false'", () => {
    render(<Demo />);
    expect(
      screen.getByRole("button", { name: "Toggle section" })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("open trigger has aria-expanded='true'", () => {
    render(<Demo defaultOpen />);
    expect(
      screen.getByRole("button", { name: "Toggle section" })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("open trigger links to its panel via aria-controls", () => {
    const { container } = render(<Demo defaultOpen />);
    const trigger = container.querySelector(
      "[data-slot='collapsible-trigger']"
    )!;
    const panel = container.querySelector(
      "[data-slot='collapsible-content']"
    )!;
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
  });
});

// ─── 4. Default-closed → reveal on click ──────────────────────────────────────

describe("Collapsible – default closed behaviour", () => {
  it("content is hidden by default (not in the DOM)", () => {
    const { container } = render(<Demo />);
    expect(screen.queryByText("Hidden details")).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='collapsible-content']")
    ).not.toBeInTheDocument();
  });

  it("clicking the trigger reveals the content panel text", async () => {
    const user = userEvent.setup();
    render(<Demo />);

    expect(screen.queryByText("Hidden details")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Toggle section" }));

    const revealed = await screen.findByText("Hidden details");
    expect(revealed).toBeVisible();
  });

  it("clicking the trigger reveals the [data-slot='collapsible-content'] element", async () => {
    const user = userEvent.setup();
    const { container } = render(<Demo />);

    await user.click(screen.getByRole("button", { name: "Toggle section" }));

    await screen.findByText("Hidden details");
    expect(
      container.querySelector("[data-slot='collapsible-content']")
    ).toBeInTheDocument();
  });

  it("clicking an open trigger hides the content again", async () => {
    const user = userEvent.setup();
    render(<Demo defaultOpen />);

    const trigger = screen.getByRole("button", { name: "Toggle section" });
    expect(screen.getByText("Hidden details")).toBeVisible();

    await user.click(trigger);

    expect(screen.queryByText("Hidden details")).not.toBeInTheDocument();
  });
});

// ─── 5. Uncontrolled (defaultOpen) ────────────────────────────────────────────

describe("Collapsible – uncontrolled (defaultOpen)", () => {
  it("defaultOpen shows content initially", () => {
    render(<Demo defaultOpen />);
    expect(screen.getByText("Hidden details")).toBeVisible();
  });

  it("defaultOpen={false} keeps content hidden initially", () => {
    render(<Demo defaultOpen={false} />);
    expect(screen.queryByText("Hidden details")).not.toBeInTheDocument();
  });
});

// ─── 6. Controlled (open + onOpenChange) ──────────────────────────────────────

describe("Collapsible – controlled", () => {
  it("controlled open prop renders the content", () => {
    render(
      <Collapsible open>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          Open
        </CollapsibleTrigger>
        <CollapsibleContent>Controlled body</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText("Controlled body")).toBeInTheDocument();
  });

  it("controlled open={false} hides the content", () => {
    render(
      <Collapsible open={false}>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          Open
        </CollapsibleTrigger>
        <CollapsibleContent>Controlled body</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.queryByText("Controlled body")).not.toBeInTheDocument();
  });

  it("onOpenChange fires with (true, details) when toggled open", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          Open
        </CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(Object));
  });

  it("drives content via external state (controlled round-trip)", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger render={<Button variant="outline" />}>
            Billing details
          </CollapsibleTrigger>
          <CollapsibleContent>Invoices are sent monthly.</CollapsibleContent>
        </Collapsible>
      );
    }

    render(<Controlled />);
    expect(screen.queryByText("Invoices are sent monthly.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Billing details" }));
    expect(await screen.findByText("Invoices are sent monthly.")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Billing details" }));
    expect(screen.queryByText("Invoices are sent monthly.")).not.toBeInTheDocument();
  });
});

// ─── 7. Disabled ──────────────────────────────────────────────────────────────

describe("Collapsible – disabled", () => {
  it("disabled root marks the trigger aria-disabled='true'", () => {
    render(
      <Collapsible disabled>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          Locked
        </CollapsibleTrigger>
        <CollapsibleContent>Secret body</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByRole("button", { name: "Locked" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("disabled trigger does not toggle open on click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible disabled onOpenChange={onOpenChange}>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          Locked
        </CollapsibleTrigger>
        <CollapsibleContent>Secret body</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: "Locked" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Secret body")).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("disabled + defaultOpen stays open and cannot be collapsed by click", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible disabled defaultOpen>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          Locked open
        </CollapsibleTrigger>
        <CollapsibleContent>Always visible</CollapsibleContent>
      </Collapsible>
    );

    expect(screen.getByText("Always visible")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Locked open" }));

    expect(screen.getByText("Always visible")).toBeVisible();
  });
});

// ─── 8. className passthrough ──────────────────────────────────────────────────

describe("Collapsible – className passthrough", () => {
  it("merges a custom className on the root", () => {
    const { container } = render(
      <Collapsible defaultOpen className="custom-root">
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>
    );
    const root = container.querySelector("[data-slot='collapsible']")!;
    expect(root.className).toContain("custom-root");
  });

  it("merges a custom className on the trigger", () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="custom-trigger">
          Trigger
        </CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>
    );
    const trigger = container.querySelector(
      "[data-slot='collapsible-trigger']"
    )!;
    expect(trigger.className).toContain("custom-trigger");
  });

  it("merges a custom className on the content", () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent className="custom-content">Body</CollapsibleContent>
      </Collapsible>
    );
    const content = container.querySelector(
      "[data-slot='collapsible-content']"
    )!;
    expect(content.className).toContain("custom-content");
  });
});

// ─── 9. Rich content ──────────────────────────────────────────────────────────

describe("Collapsible – rich content", () => {
  it("renders key-value rows and list items inside the panel", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          Subscription summary
        </CollapsibleTrigger>
        <CollapsibleContent>
          <dl>
            <div>
              <dt>Plan</dt>
              <dd>Pro (annual)</dd>
            </div>
          </dl>
          <ul>
            <li>Priority support</li>
            <li>Custom domains</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    );

    expect(screen.getByText("Plan")).toBeInTheDocument();
    expect(screen.getByText("Pro (annual)")).toBeInTheDocument();
    expect(screen.getByText("Priority support")).toBeInTheDocument();
    expect(screen.getByText("Custom domains")).toBeInTheDocument();
  });
});

// ─── 10. Accessibility (axe) ──────────────────────────────────────────────────

describe("Collapsible – accessibility (axe)", () => {
  it("open collapsible has no axe violations", async () => {
    const { container } = render(<Demo defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("closed collapsible has no axe violations", async () => {
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("disabled collapsible has no axe violations", async () => {
    const { container } = render(
      <Collapsible disabled defaultOpen>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          Locked
        </CollapsibleTrigger>
        <CollapsibleContent>Managed by your administrator.</CollapsibleContent>
      </Collapsible>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("collapsible with rich content has no axe violations", async () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          Subscription summary
        </CollapsibleTrigger>
        <CollapsibleContent>
          <dl>
            <div>
              <dt>Plan</dt>
              <dd>Pro (annual)</dd>
            </div>
          </dl>
        </CollapsibleContent>
      </Collapsible>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
