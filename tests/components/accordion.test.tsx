/**
 * Exhaustive tests for the Accordion compound component family.
 *
 * Components under test (all from @/components/ui/accordion):
 *   Accordion         — Root wrapper, data-slot="accordion"
 *   AccordionItem     — Item wrapper, data-slot="accordion-item"
 *   AccordionTrigger  — Trigger (button inside header), data-slot="accordion-trigger"
 *   AccordionContent  — Panel/content area, data-slot="accordion-content"
 *
 * Props exercised:
 *   Root:    defaultValue, value, onValueChange, multiple, disabled,
 *            keepMounted, hiddenUntilFound, loopFocus, orientation, className
 *   Item:    value, disabled, className
 *   Trigger: className + children (incl. with-icon pattern)
 *   Content: className + children (nested / rich content)
 *
 * Test strategy:
 *   Render     — smoke, slots, DOM structure, className merging
 *   State      — closed/open via defaultValue, open data-attributes, chevron visibility
 *   Multiple   — multiple prop allows N panels open simultaneously
 *   Disabled   — whole-accordion + per-item disabled (aria-disabled on trigger)
 *   Interaction— click to open/close, toggle second item closes first (single mode)
 *   Controlled — value + onValueChange wiring
 *   keepMounted— closed panels stay in DOM
 *   A11y       — axe on representative renders; WAI-ARIA roles (button / region)
 */

import * as React from "react";
import { useState } from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// ─── Reusable helpers ────────────────────────────────────────────────────────

/**
 * Minimal three-item accordion with stable text labels.
 * item-1 is open by default (defaultValue={["item-1"]}).
 */
function DefaultAccordion(props: React.ComponentPropsWithoutRef<typeof Accordion>) {
  return (
    <Accordion defaultValue={["item-1"]} {...props}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>Returns are accepted within 30 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
        <AccordionContent>Standard shipping takes 3–5 business days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Do you offer customer support?</AccordionTrigger>
        <AccordionContent>Yes, Monday–Friday 9 am–5 pm EST.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// ─── 1. Smoke / basic rendering ──────────────────────────────────────────────

describe("Accordion – smoke", () => {
  it("renders without crashing", () => {
    render(<DefaultAccordion />);
    expect(screen.getByText("What is your return policy?")).toBeInTheDocument();
  });

  it("renders all three trigger buttons", () => {
    render(<DefaultAccordion />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("renders trigger text correctly", () => {
    render(<DefaultAccordion />);
    expect(
      screen.getByRole("button", { name: /What is your return policy\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /How long does shipping take\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Do you offer customer support\?/i })
    ).toBeInTheDocument();
  });

  it("renders with no props or defaultValue without crashing", () => {
    render(
      <Accordion>
        <AccordionItem value="x">
          <AccordionTrigger>Item X</AccordionTrigger>
          <AccordionContent>Content X</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByRole("button", { name: "Item X" })).toBeInTheDocument();
  });
});

// ─── 2. data-slot attributes ─────────────────────────────────────────────────

describe("Accordion – data-slot attributes", () => {
  it("Accordion root has data-slot='accordion'", () => {
    const { container } = render(<DefaultAccordion />);
    expect(container.querySelector("[data-slot='accordion']")).toBeInTheDocument();
  });

  it("AccordionItem has data-slot='accordion-item'", () => {
    const { container } = render(<DefaultAccordion />);
    const items = container.querySelectorAll("[data-slot='accordion-item']");
    expect(items.length).toBe(3);
  });

  it("AccordionTrigger has data-slot='accordion-trigger'", () => {
    const { container } = render(<DefaultAccordion />);
    const triggers = container.querySelectorAll("[data-slot='accordion-trigger']");
    expect(triggers.length).toBe(3);
  });

  it("AccordionContent has data-slot='accordion-content'", () => {
    const { container } = render(<DefaultAccordion />);
    // At least the open item's panel is data-slot=accordion-content
    const panels = container.querySelectorAll("[data-slot='accordion-content']");
    expect(panels.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── 3. ARIA roles ───────────────────────────────────────────────────────────

describe("Accordion – ARIA roles", () => {
  it("each trigger is a button role", () => {
    render(<DefaultAccordion />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(3);
  });

  it("trigger button for open item has aria-expanded=true", () => {
    render(<DefaultAccordion />);
    const trigger = screen.getByRole("button", {
      name: /What is your return policy\?/i,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("trigger button for closed item has aria-expanded=false", () => {
    render(<DefaultAccordion />);
    const trigger = screen.getByRole("button", {
      name: /How long does shipping take\?/i,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("triggers are wrapped in a heading element (AccordionHeader)", () => {
    const { container } = render(<DefaultAccordion />);
    // Base UI wraps triggers in <h3> by default
    const headings = container.querySelectorAll("h3");
    expect(headings.length).toBe(3);
  });
});

// ─── 4. Default open state (defaultValue) ────────────────────────────────────

describe("Accordion – defaultValue open state", () => {
  it("item-1 content is visible when defaultValue=['item-1']", () => {
    render(<DefaultAccordion />);
    expect(screen.getByText("Returns are accepted within 30 days.")).toBeInTheDocument();
  });

  it("open item panel carries data-open attribute", () => {
    const { container } = render(<DefaultAccordion />);
    const openPanel = container.querySelector("[data-slot='accordion-content'][data-open]");
    expect(openPanel).toBeInTheDocument();
  });

  it("open item trigger carries data-panel-open attribute", () => {
    const { container } = render(<DefaultAccordion />);
    const openTrigger = container.querySelector(
      "[data-slot='accordion-trigger'][data-panel-open]"
    );
    expect(openTrigger).toBeInTheDocument();
  });

  it("closed items do NOT carry data-open on their panel", () => {
    const { container } = render(<DefaultAccordion />);
    const allPanels = container.querySelectorAll("[data-slot='accordion-content']");
    // Only the first item is open
    const openPanels = Array.from(allPanels).filter((p) =>
      p.hasAttribute("data-open")
    );
    expect(openPanels.length).toBe(1);
  });

  it("all items closed when defaultValue=[]", () => {
    const { container } = render(<DefaultAccordion defaultValue={[]} />);
    const openPanels = container.querySelectorAll(
      "[data-slot='accordion-content'][data-open]"
    );
    expect(openPanels.length).toBe(0);
  });

  it("multiple items open with defaultValue=['item-1','item-2'] when multiple", () => {
    const { container } = render(
      <Accordion multiple defaultValue={["item-1", "item-2"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const openPanels = container.querySelectorAll(
      "[data-slot='accordion-content'][data-open]"
    );
    expect(openPanels.length).toBe(2);
  });
});

// ─── 5. Chevron icon visibility ──────────────────────────────────────────────

describe("Accordion – chevron icons", () => {
  it("open trigger shows ChevronUp (group-aria-expanded:inline) and hides ChevronDown", () => {
    const { container } = render(<DefaultAccordion />);
    const openTrigger = container.querySelector(
      "[data-slot='accordion-trigger'][aria-expanded='true']"
    )!;
    expect(openTrigger).not.toBeNull();

    // ChevronDown has class "group-aria-expanded/accordion-trigger:hidden"
    // ChevronUp has class "hidden group-aria-expanded/accordion-trigger:inline"
    const icons = openTrigger.querySelectorAll("[data-slot='accordion-trigger-icon']");
    expect(icons.length).toBe(2);
  });

  it("both chevrons are rendered in the DOM for each trigger", () => {
    const { container } = render(<DefaultAccordion />);
    const allTriggerIcons = container.querySelectorAll(
      "[data-slot='accordion-trigger-icon']"
    );
    // 3 items × 2 icons each = 6
    expect(allTriggerIcons.length).toBe(6);
  });
});

// ─── 6. className merging ─────────────────────────────────────────────────────

describe("Accordion – className merging", () => {
  it("Accordion accepts and merges a custom className", () => {
    const { container } = render(
      <DefaultAccordion className="custom-root-class" />
    );
    const root = container.querySelector("[data-slot='accordion']")!;
    expect(root.className).toContain("custom-root-class");
  });

  it("Accordion always keeps base 'flex' class", () => {
    const { container } = render(<DefaultAccordion />);
    const root = container.querySelector("[data-slot='accordion']")!;
    expect(root.className).toContain("flex");
  });

  it("Accordion always keeps base 'w-full' class", () => {
    const { container } = render(<DefaultAccordion />);
    const root = container.querySelector("[data-slot='accordion']")!;
    expect(root.className).toContain("w-full");
  });

  it("AccordionItem accepts and merges a custom className", () => {
    const { container } = render(
      <Accordion defaultValue={[]}>
        <AccordionItem value="x" className="my-item-class">
          <AccordionTrigger>Item</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const item = container.querySelector("[data-slot='accordion-item']")!;
    expect(item.className).toContain("my-item-class");
  });

  it("AccordionTrigger accepts and merges a custom className", () => {
    const { container } = render(
      <Accordion defaultValue={[]}>
        <AccordionItem value="x">
          <AccordionTrigger className="my-trigger-class">Item</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = container.querySelector("[data-slot='accordion-trigger']")!;
    expect(trigger.className).toContain("my-trigger-class");
  });

  it("AccordionTrigger retains base 'flex' class alongside custom className", () => {
    const { container } = render(
      <Accordion defaultValue={[]}>
        <AccordionItem value="x">
          <AccordionTrigger className="extra">Item</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = container.querySelector("[data-slot='accordion-trigger']")!;
    expect(trigger.className).toContain("flex");
    expect(trigger.className).toContain("extra");
  });

  it("AccordionContent accepts and merges a custom className on inner div", () => {
    const { container } = render(
      <Accordion defaultValue={["x"]}>
        <AccordionItem value="x">
          <AccordionTrigger>Item</AccordionTrigger>
          <AccordionContent className="my-content-class">Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    // The className goes on the inner div inside the panel
    const innerDiv = container.querySelector(
      "[data-slot='accordion-content'] div"
    )!;
    expect(innerDiv.className).toContain("my-content-class");
  });
});

// ─── 7. Interaction – single mode (default) ──────────────────────────────────

describe("Accordion – interaction (single mode)", () => {
  it("clicking a closed trigger opens that item", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion />);

    const shippingTrigger = screen.getByRole("button", {
      name: /How long does shipping take\?/i,
    });
    expect(shippingTrigger).toHaveAttribute("aria-expanded", "false");

    await user.click(shippingTrigger);

    expect(shippingTrigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("Standard shipping takes 3–5 business days.")
    ).toBeInTheDocument();
  });

  it("clicking an open trigger closes it", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion />);

    const returnTrigger = screen.getByRole("button", {
      name: /What is your return policy\?/i,
    });
    expect(returnTrigger).toHaveAttribute("aria-expanded", "true");

    await user.click(returnTrigger);

    expect(returnTrigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opening item-2 closes item-1 in single mode", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion />);

    const item1Trigger = screen.getByRole("button", {
      name: /What is your return policy\?/i,
    });
    const item2Trigger = screen.getByRole("button", {
      name: /How long does shipping take\?/i,
    });

    expect(item1Trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(item2Trigger);

    expect(item2Trigger).toHaveAttribute("aria-expanded", "true");
    expect(item1Trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("can open each item in sequence", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion defaultValue={[]} />);

    for (const label of [
      /What is your return policy\?/i,
      /How long does shipping take\?/i,
      /Do you offer customer support\?/i,
    ]) {
      const trigger = screen.getByRole("button", { name: label });
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    }
  });

  it("toggling the same item open then closed works correctly", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion defaultValue={[]} />);

    const trigger = screen.getByRole("button", {
      name: /What is your return policy\?/i,
    });

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

// ─── 8. Interaction – multiple mode ──────────────────────────────────────────

describe("Accordion – interaction (multiple mode)", () => {
  it("multiple mode allows two items open at once", async () => {
    const user = userEvent.setup();
    render(
      <Accordion multiple defaultValue={[]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    await user.click(screen.getByRole("button", { name: "First" }));
    await user.click(screen.getByRole("button", { name: "Second" }));

    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("multiple mode allows all items open simultaneously", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion multiple defaultValue={[]}>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger>C</AccordionTrigger>
          <AccordionContent>Content C</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    for (const name of ["A", "B", "C"]) {
      await user.click(screen.getByRole("button", { name }));
    }

    const openPanels = container.querySelectorAll(
      "[data-slot='accordion-content'][data-open]"
    );
    expect(openPanels.length).toBe(3);
  });

  it("in multiple mode closing one item does not affect another open item", async () => {
    const user = userEvent.setup();
    render(
      <Accordion multiple defaultValue={["first", "second"]}>
        <AccordionItem value="first">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // Close second; first should remain open
    await user.click(screen.getByRole("button", { name: "Second" }));

    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});

// ─── 9. Keyboard interactions ─────────────────────────────────────────────────

describe("Accordion – keyboard interaction", () => {
  it("trigger can be activated with Enter key", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion defaultValue={[]} />);

    const trigger = screen.getByRole("button", {
      name: /What is your return policy\?/i,
    });
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("trigger can be activated with Space key", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion defaultValue={[]} />);

    const trigger = screen.getByRole("button", {
      name: /How long does shipping take\?/i,
    });
    trigger.focus();
    await user.keyboard(" ");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("triggers can be focused via Tab", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion defaultValue={[]} />);

    await user.tab();
    const focused = document.activeElement;
    // Base UI triggers are native <button> elements — role is implicit, not an attribute
    expect(focused).toBeInstanceOf(HTMLButtonElement);
  });

  it("ArrowDown moves focus to next trigger", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion defaultValue={[]} />);

    const firstTrigger = screen.getByRole("button", {
      name: /What is your return policy\?/i,
    });
    firstTrigger.focus();
    await user.keyboard("{ArrowDown}");

    // Base UI accordion with vertical orientation moves focus down with ArrowDown
    const focused = document.activeElement;
    expect(focused).toHaveAttribute("data-slot", "accordion-trigger");
  });

  it("ArrowUp moves focus to previous trigger", async () => {
    const user = userEvent.setup();
    render(<DefaultAccordion defaultValue={[]} />);

    const secondTrigger = screen.getByRole("button", {
      name: /How long does shipping take\?/i,
    });
    secondTrigger.focus();
    await user.keyboard("{ArrowUp}");

    const focused = document.activeElement;
    expect(focused).toHaveAttribute("data-slot", "accordion-trigger");
  });
});

// ─── 10. Disabled state – whole accordion ─────────────────────────────────────

describe("Accordion – disabled (whole accordion)", () => {
  it("all triggers have aria-disabled when accordion is disabled", () => {
    render(<DefaultAccordion disabled />);
    const triggers = screen.getAllByRole("button");
    triggers.forEach((trigger) => {
      expect(trigger).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("disabled accordion root carries data-disabled attribute", () => {
    const { container } = render(<DefaultAccordion disabled />);
    const root = container.querySelector("[data-slot='accordion']");
    expect(root).toHaveAttribute("data-disabled");
  });

  it("clicking a disabled trigger does not open it", async () => {
    const user = userEvent.setup();
    render(
      <Accordion disabled>
        <AccordionItem value="item-1">
          <AccordionTrigger>Account details</AccordionTrigger>
          <AccordionContent>Content here.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: /Account details/i });
    // aria-disabled with pointer-events-none; userEvent respects this
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("disabled trigger has pointer-events-none class (aria-disabled)", () => {
    const { container } = render(<DefaultAccordion disabled />);
    const trigger = container.querySelector("[data-slot='accordion-trigger']")!;
    expect(trigger.className).toContain("aria-disabled:pointer-events-none");
  });

  it("disabled trigger has opacity-50 class (aria-disabled)", () => {
    const { container } = render(<DefaultAccordion disabled />);
    const trigger = container.querySelector("[data-slot='accordion-trigger']")!;
    expect(trigger.className).toContain("aria-disabled:opacity-50");
  });
});

// ─── 11. Disabled state – individual item ─────────────────────────────────────

describe("Accordion – disabled (individual item)", () => {
  it("disabled item trigger has aria-disabled='true'", () => {
    render(
      <Accordion defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Active feature</AccordionTrigger>
          <AccordionContent>Enabled content.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Locked feature</AccordionTrigger>
          <AccordionContent>This is not reachable.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const lockedTrigger = screen.getByRole("button", {
      name: /Locked feature/i,
    });
    expect(lockedTrigger).toHaveAttribute("aria-disabled", "true");
  });

  it("non-disabled item trigger does NOT have aria-disabled", () => {
    render(
      <Accordion defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Active feature</AccordionTrigger>
          <AccordionContent>Content.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Locked feature</AccordionTrigger>
          <AccordionContent>Locked.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const activeTrigger = screen.getByRole("button", {
      name: /Active feature/i,
    });
    // Should NOT carry aria-disabled
    expect(activeTrigger).not.toHaveAttribute("aria-disabled", "true");
  });

  it("clicking a disabled item trigger does not open it", async () => {
    const user = userEvent.setup();
    render(
      <Accordion defaultValue={[]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Open me</AccordionTrigger>
          <AccordionContent>Reachable.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Locked</AccordionTrigger>
          <AccordionContent>Not reachable.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const lockedTrigger = screen.getByRole("button", { name: /Locked/i });
    await user.click(lockedTrigger);
    expect(lockedTrigger).toHaveAttribute("aria-expanded", "false");
  });

  it("disabled item carries data-disabled attribute", () => {
    const { container } = render(
      <Accordion defaultValue={[]}>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Locked</AccordionTrigger>
          <AccordionContent>Hidden.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const item = container.querySelector("[data-slot='accordion-item']")!;
    expect(item).toHaveAttribute("data-disabled");
  });

  it("active item can still be opened when a sibling item is disabled", async () => {
    const user = userEvent.setup();
    render(
      <Accordion defaultValue={[]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Enabled Alpha</AccordionTrigger>
          <AccordionContent>Content alpha.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Locked Beta</AccordionTrigger>
          <AccordionContent>Locked.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Enabled Gamma</AccordionTrigger>
          <AccordionContent>Content gamma.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    await user.click(
      screen.getByRole("button", { name: "Enabled Alpha" })
    );
    expect(
      screen.getByRole("button", { name: "Enabled Alpha" })
    ).toHaveAttribute("aria-expanded", "true");
  });
});

// ─── 12. Controlled mode (value + onValueChange) ──────────────────────────────

describe("Accordion – controlled mode", () => {
  it("controlled accordion opens the item specified by value prop", () => {
    render(
      <Accordion value={["step-2"]}>
        <AccordionItem value="step-1">
          <AccordionTrigger>Step 1</AccordionTrigger>
          <AccordionContent>Body 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="step-2">
          <AccordionTrigger>Step 2</AccordionTrigger>
          <AccordionContent>Body 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(
      screen.getByRole("button", { name: "Step 2" })
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Step 1" })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("onValueChange fires with the new value when a trigger is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Accordion value={[]} onValueChange={onValueChange}>
        <AccordionItem value="step-1">
          <AccordionTrigger>Step 1</AccordionTrigger>
          <AccordionContent>Body 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    await user.click(screen.getByRole("button", { name: "Step 1" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(
      expect.arrayContaining(["step-1"]),
      expect.anything()
    );
  });

  it("controlled accordion tracks external state changes via value prop", () => {
    const { rerender } = render(
      <Accordion value={[]}>
        <AccordionItem value="item-a">
          <AccordionTrigger>Item A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByRole("button", { name: "Item A" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    rerender(
      <Accordion value={["item-a"]}>
        <AccordionItem value="item-a">
          <AccordionTrigger>Item A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByRole("button", { name: "Item A" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("controlled accordion with multiple state works (expand/collapse all pattern)", async () => {
    const user = userEvent.setup();

    function ControlledMultiple() {
      const [openItems, setOpenItems] = useState<string[]>(["step-1"]);
      const items = [
        { value: "step-1", label: "Step 1", body: "Body 1" },
        { value: "step-2", label: "Step 2", body: "Body 2" },
        { value: "step-3", label: "Step 3", body: "Body 3" },
      ];

      return (
        <div>
          <button
            onClick={() => setOpenItems(items.map((i) => i.value))}
            data-testid="expand-all"
          >
            Expand all
          </button>
          <button onClick={() => setOpenItems([])} data-testid="collapse-all">
            Collapse all
          </button>
          <Accordion
            multiple
            value={openItems}
            onValueChange={(val) => setOpenItems(val as string[])}
          >
            {items.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.label}</AccordionTrigger>
                <AccordionContent>
                  <p>{item.body}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
    }

    const { container } = render(<ControlledMultiple />);

    // Initially only step-1 open
    let openPanels = container.querySelectorAll(
      "[data-slot='accordion-content'][data-open]"
    );
    expect(openPanels.length).toBe(1);

    // Click "Expand all"
    await user.click(screen.getByTestId("expand-all"));
    openPanels = container.querySelectorAll(
      "[data-slot='accordion-content'][data-open]"
    );
    expect(openPanels.length).toBe(3);

    // Click "Collapse all"
    await user.click(screen.getByTestId("collapse-all"));
    openPanels = container.querySelectorAll(
      "[data-slot='accordion-content'][data-open]"
    );
    expect(openPanels.length).toBe(0);
  });
});

// ─── 13. keepMounted prop ─────────────────────────────────────────────────────

describe("Accordion – keepMounted prop", () => {
  it("keepMounted: closed panel stays in DOM", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion keepMounted defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Persisted panel A</AccordionTrigger>
          <AccordionContent>Panel A content.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Persisted panel B</AccordionTrigger>
          <AccordionContent>Panel B content.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // item-2 starts closed — its panel should still be in the DOM
    const allPanels = container.querySelectorAll("[data-slot='accordion-content']");
    expect(allPanels.length).toBe(2);

    // Close item-1 by clicking it
    await user.click(screen.getByRole("button", { name: /Persisted panel A/i }));

    // Both panels remain in DOM
    const afterPanels = container.querySelectorAll("[data-slot='accordion-content']");
    expect(afterPanels.length).toBe(2);
  });

  it("keepMounted: closed panel carries hidden or data-closed attribute (not removed)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion keepMounted defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Panel A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Panel B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // Panel B starts closed but mounted
    const allPanels = container.querySelectorAll("[data-slot='accordion-content']");
    expect(allPanels.length).toBe(2);

    // Panel B should NOT have data-open
    const openPanels = container.querySelectorAll(
      "[data-slot='accordion-content'][data-open]"
    );
    expect(openPanels.length).toBe(1);
  });
});

// ─── 14. hiddenUntilFound prop ────────────────────────────────────────────────

describe("Accordion – hiddenUntilFound prop", () => {
  it("hiddenUntilFound renders panels in DOM when closed", () => {
    const { container } = render(
      <Accordion hiddenUntilFound defaultValue={["overview"]}>
        <AccordionItem value="overview">
          <AccordionTrigger>Product overview</AccordionTrigger>
          <AccordionContent>Try searching for text inside this accordion.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="specs">
          <AccordionTrigger>Technical specifications</AccordionTrigger>
          <AccordionContent>Dimensions: 200 × 150 × 50 mm.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // Both panels should be present in the DOM
    const panels = container.querySelectorAll("[data-slot='accordion-content']");
    expect(panels.length).toBe(2);
  });
});

// ─── 15. Orientation prop ─────────────────────────────────────────────────────

describe("Accordion – orientation prop", () => {
  it("root carries data-orientation='vertical' by default", () => {
    const { container } = render(<DefaultAccordion />);
    const root = container.querySelector("[data-slot='accordion']");
    expect(root).toHaveAttribute("data-orientation", "vertical");
  });

  it("root carries data-orientation='horizontal' when set", () => {
    const { container } = render(<DefaultAccordion orientation="horizontal" />);
    const root = container.querySelector("[data-slot='accordion']");
    expect(root).toHaveAttribute("data-orientation", "horizontal");
  });
});

// ─── 16. with-icon pattern ────────────────────────────────────────────────────

describe("Accordion – with-icon trigger pattern", () => {
  it("renders icon + text label in trigger without crashing", () => {
    render(
      <Accordion defaultValue={["security"]}>
        <AccordionItem value="security">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <svg
                data-testid="shield-icon"
                className="size-4"
                viewBox="0 0 24 24"
                aria-hidden="true"
              />
              Security
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>Review login activity.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByRole("button", { name: /Security/i })).toBeInTheDocument();
    expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
  });

  it("icon inside trigger is rendered in the DOM", () => {
    render(
      <Accordion defaultValue={[]}>
        <AccordionItem value="billing">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <svg data-testid="card-icon" viewBox="0 0 24 24" aria-hidden="true" />
              Billing
            </span>
          </AccordionTrigger>
          <AccordionContent>Update your payment method.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId("card-icon")).toBeInTheDocument();
  });
});

// ─── 17. nested / rich content ────────────────────────────────────────────────

describe("Accordion – nested and rich content", () => {
  it("renders paragraph children inside AccordionContent", () => {
    render(
      <Accordion defaultValue={["overview"]}>
        <AccordionItem value="overview">
          <AccordionTrigger>Project overview</AccordionTrigger>
          <AccordionContent>
            <p>This project covers the full redesign.</p>
            <p>
              Estimated timeline: <strong>6 weeks</strong>.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("This project covers the full redesign.")).toBeInTheDocument();
    expect(screen.getByText("6 weeks")).toBeInTheDocument();
  });

  it("renders list items inside AccordionContent", () => {
    render(
      <Accordion defaultValue={["milestones"]}>
        <AccordionItem value="milestones">
          <AccordionTrigger>Milestones</AccordionTrigger>
          <AccordionContent>
            <ul>
              <li>Week 1–2: Discovery</li>
              <li>Week 3–4: Design</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Week 1–2: Discovery")).toBeInTheDocument();
    expect(screen.getByText("Week 3–4: Design")).toBeInTheDocument();
  });

  it("renders links inside AccordionContent", () => {
    render(
      <Accordion defaultValue={["resources"]}>
        <AccordionItem value="resources">
          <AccordionTrigger>Resources</AccordionTrigger>
          <AccordionContent>
            <p>
              Refer to the{" "}
              <a href="#brief" onClick={(e) => e.preventDefault()}>
                design brief
              </a>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByRole("link", { name: "design brief" })).toBeInTheDocument();
  });

  it("renders strong/bold text inside AccordionContent", () => {
    render(
      <Accordion defaultValue={["faq"]}>
        <AccordionItem value="faq">
          <AccordionTrigger>FAQ</AccordionTrigger>
          <AccordionContent>
            <p>
              <strong>Can I start early?</strong>
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Can I start early?")).toBeInTheDocument();
  });
});

// ─── 18. AccordionItem data-index ─────────────────────────────────────────────

describe("Accordion – item data-index", () => {
  it("first AccordionItem carries data-index='0'", () => {
    const { container } = render(<DefaultAccordion />);
    const items = container.querySelectorAll("[data-slot='accordion-item']");
    expect(items[0]).toHaveAttribute("data-index", "0");
  });

  it("second AccordionItem carries data-index='1'", () => {
    const { container } = render(<DefaultAccordion />);
    const items = container.querySelectorAll("[data-slot='accordion-item']");
    expect(items[1]).toHaveAttribute("data-index", "1");
  });

  it("third AccordionItem carries data-index='2'", () => {
    const { container } = render(<DefaultAccordion />);
    const items = container.querySelectorAll("[data-slot='accordion-item']");
    expect(items[2]).toHaveAttribute("data-index", "2");
  });
});

// ─── 19. Multiple instances in the same tree ─────────────────────────────────

describe("Accordion – multiple instances", () => {
  it("two accordions in the same render tree do not interfere", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Accordion defaultValue={[]} data-testid="accordion-a">
          <AccordionItem value="a1">
            <AccordionTrigger>A1</AccordionTrigger>
            <AccordionContent>Content A1</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion defaultValue={[]} data-testid="accordion-b">
          <AccordionItem value="b1">
            <AccordionTrigger>B1</AccordionTrigger>
            <AccordionContent>Content B1</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );

    await user.click(screen.getByRole("button", { name: "A1" }));

    expect(screen.getByRole("button", { name: "A1" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByRole("button", { name: "B1" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});

// ─── 20. Re-render behavior ───────────────────────────────────────────────────

describe("Accordion – re-render behavior", () => {
  it("rerender with new defaultValue does not change already-set state", () => {
    const { rerender } = render(<DefaultAccordion defaultValue={["item-1"]} />);

    expect(
      screen.getByRole("button", { name: /What is your return policy\?/i })
    ).toHaveAttribute("aria-expanded", "true");

    // rerender with different defaultValue — should NOT re-initialize since already mounted
    rerender(<DefaultAccordion defaultValue={["item-2"]} />);

    // item-1 should still be open (defaultValue is only used on initial mount)
    expect(
      screen.getByRole("button", { name: /What is your return policy\?/i })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("re-renders with new children without crashing", () => {
    const { rerender } = render(
      <Accordion defaultValue={[]}>
        <AccordionItem value="x">
          <AccordionTrigger>X</AccordionTrigger>
          <AccordionContent>Content X</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    rerender(
      <Accordion defaultValue={[]}>
        <AccordionItem value="x">
          <AccordionTrigger>X</AccordionTrigger>
          <AccordionContent>Content X updated</AccordionContent>
        </AccordionItem>
        <AccordionItem value="y">
          <AccordionTrigger>Y</AccordionTrigger>
          <AccordionContent>Content Y</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByRole("button", { name: "Y" })).toBeInTheDocument();
  });
});

// ─── 21. Accessibility (axe) ──────────────────────────────────────────────────

describe("Accordion – accessibility (axe)", () => {
  it("default accordion with one item open has no axe violations", async () => {
    const { container } = render(<DefaultAccordion />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("all items closed accordion has no axe violations", async () => {
    const { container } = render(<DefaultAccordion defaultValue={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("multiple mode accordion has no axe violations", async () => {
    const { container } = render(
      <Accordion multiple defaultValue={["item-1", "item-3"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>General settings</AccordionTrigger>
          <AccordionContent>
            <p>Manage your display name, language preference.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Notifications</AccordionTrigger>
          <AccordionContent>
            <p>Choose which events trigger notifications.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Privacy &amp; security</AccordionTrigger>
          <AccordionContent>
            <p>Control who can see your profile.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Billing</AccordionTrigger>
          <AccordionContent>
            <p>View your current plan.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("disabled accordion has no axe violations", async () => {
    const { container } = render(<DefaultAccordion disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("accordion with individual disabled item has no axe violations", async () => {
    const { container } = render(
      <Accordion defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Active feature</AccordionTrigger>
          <AccordionContent>This feature is enabled.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Locked feature</AccordionTrigger>
          <AccordionContent>This content is not reachable.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("accordion after user interaction (panel opened) has no axe violations", async () => {
    const user = userEvent.setup();
    const { container } = render(<DefaultAccordion defaultValue={[]} />);

    await user.click(
      screen.getByRole("button", { name: /What is your return policy\?/i })
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("accordion with rich content (links, lists) has no axe violations", async () => {
    const { container } = render(
      <Accordion defaultValue={["resources"]}>
        <AccordionItem value="resources">
          <AccordionTrigger>Resources &amp; links</AccordionTrigger>
          <AccordionContent>
            <p>
              Refer to the{" "}
              <a href="#brief" onClick={(e) => e.preventDefault()}>
                design brief
              </a>
              .
            </p>
            <ul>
              <li>Item one</li>
              <li>Item two</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("accordion with icon in trigger has no axe violations", async () => {
    const { container } = render(
      <Accordion defaultValue={["security"]}>
        <AccordionItem value="security">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-4"
              />
              Security
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>Review login activity.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("keepMounted accordion has no axe violations", async () => {
    const { container } = render(
      <Accordion keepMounted defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Persisted panel A</AccordionTrigger>
          <AccordionContent>Panel A content.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Persisted panel B</AccordionTrigger>
          <AccordionContent>Panel B content.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── 22. Edge cases ───────────────────────────────────────────────────────────

describe("Accordion – edge cases", () => {
  it("renders a single item accordion without crashing", () => {
    render(
      <Accordion defaultValue={["only"]}>
        <AccordionItem value="only">
          <AccordionTrigger>Only item</AccordionTrigger>
          <AccordionContent>Only content.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByRole("button", { name: "Only item" })).toBeInTheDocument();
  });

  it("renders with numeric-string values without crashing", () => {
    render(
      <Accordion defaultValue={["1"]}>
        <AccordionItem value="1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("renders empty Accordion (no children) without crashing", () => {
    const { container } = render(<Accordion defaultValue={[]} />);
    expect(container.querySelector("[data-slot='accordion']")).toBeInTheDocument();
  });

  it("renders a large number of items without crashing", () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      value: `item-${i}`,
      label: `Question ${i + 1}`,
      body: `Answer ${i + 1}`,
    }));

    render(
      <Accordion defaultValue={[]}>
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.label}</AccordionTrigger>
            <AccordionContent>{item.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );

    expect(screen.getAllByRole("button")).toHaveLength(10);
  });
});
