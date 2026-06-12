/**
 * Exhaustive tests for the Checkpoint compound component
 *
 * Component source: components/ai-elements/checkpoint.tsx
 *
 * Exports:
 *   Checkpoint         – row container div, data-slot="checkpoint", renders a trailing Separator
 *   CheckpointIcon     – default BookmarkIcon (data-slot="checkpoint-icon") or its `children` override
 *   CheckpointTrigger  – Button (data-slot="checkpoint-trigger"); optional `tooltip` wraps it in a Tooltip
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "@/components/ai-elements/checkpoint";

// ---------------------------------------------------------------------------
// 1. Checkpoint — renders without crashing
// ---------------------------------------------------------------------------

describe("Checkpoint — renders without crashing", () => {
  it("renders a bare Checkpoint without crashing", () => {
    const { container } = render(<Checkpoint />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("root element is a <div>", () => {
    const { container } = render(<Checkpoint />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders children inside Checkpoint", () => {
    render(<Checkpoint>hello checkpoint</Checkpoint>);
    expect(screen.getByText("hello checkpoint")).toBeInTheDocument();
  });

  it("renders a fully-composed checkpoint without crashing", () => {
    expect(() =>
      render(
        <Checkpoint>
          <CheckpointIcon />
          <CheckpointTrigger>Restore</CheckpointTrigger>
        </Checkpoint>
      )
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 2. Checkpoint — data-slot, base classes, and trailing separator
// ---------------------------------------------------------------------------

describe("Checkpoint — data-slot and base classes", () => {
  it("has data-slot='checkpoint'", () => {
    const { container } = render(<Checkpoint />);
    expect(container.firstChild).toHaveAttribute("data-slot", "checkpoint");
  });

  it("has flex + items-center layout classes", () => {
    const { container } = render(<Checkpoint />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("flex");
    expect(cls).toContain("items-center");
  });

  it("has gap-0.5 class", () => {
    const { container } = render(<Checkpoint />);
    expect((container.firstChild as HTMLElement).className).toContain("gap-0.5");
  });

  it("has overflow-hidden class", () => {
    const { container } = render(<Checkpoint />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "overflow-hidden"
    );
  });

  it("uses the muted token (text-muted-foreground), no raw color", () => {
    const { container } = render(<Checkpoint />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "text-muted-foreground"
    );
  });

  it("renders a trailing Separator (data-slot='separator')", () => {
    const { container } = render(<Checkpoint />);
    const sep = container.querySelector("[data-slot='separator']");
    expect(sep).toBeInTheDocument();
  });

  it("the Separator is the last child", () => {
    const { container } = render(<Checkpoint>label</Checkpoint>);
    const root = container.firstChild as HTMLElement;
    expect(root.lastElementChild).toHaveAttribute("data-slot", "separator");
  });
});

// ---------------------------------------------------------------------------
// 3. Checkpoint — className + attribute forwarding
// ---------------------------------------------------------------------------

describe("Checkpoint — forwarding", () => {
  it("forwards a custom className and keeps base classes", () => {
    const { container } = render(<Checkpoint className="my-row" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("my-row");
    expect(cls).toContain("flex");
  });

  it("forwards id and data-testid attributes", () => {
    const { container } = render(
      <Checkpoint id="cp-1" data-testid="cp" />
    );
    expect(container.firstChild).toHaveAttribute("id", "cp-1");
    expect(container.firstChild).toHaveAttribute("data-testid", "cp");
  });

  it("forwards aria-label", () => {
    const { container } = render(<Checkpoint aria-label="Checkpoint row" />);
    expect(container.firstChild).toHaveAttribute(
      "aria-label",
      "Checkpoint row"
    );
  });
});

// ---------------------------------------------------------------------------
// 4. CheckpointIcon — default BookmarkIcon
// ---------------------------------------------------------------------------

describe("CheckpointIcon — default icon", () => {
  it("renders a default BookmarkIcon (an <svg>) when no children given", () => {
    const { container } = render(<CheckpointIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("default icon carries data-slot='checkpoint-icon'", () => {
    const { container } = render(<CheckpointIcon />);
    expect(
      container.querySelector("[data-slot='checkpoint-icon']")
    ).toBeInTheDocument();
  });

  it("default icon has size-4 and shrink-0 classes", () => {
    const { container } = render(<CheckpointIcon />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.getAttribute("class")).toContain("size-4");
    expect(svg.getAttribute("class")).toContain("shrink-0");
  });

  it("default icon merges a custom className", () => {
    const { container } = render(<CheckpointIcon className="text-brand" />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.getAttribute("class")).toContain("text-brand");
    expect(svg.getAttribute("class")).toContain("size-4");
  });

  it("default icon forwards svg props (e.g. strokeWidth)", () => {
    const { container } = render(<CheckpointIcon strokeWidth={3} />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.getAttribute("stroke-width")).toBe("3");
  });
});

// ---------------------------------------------------------------------------
// 5. CheckpointIcon — children override
// ---------------------------------------------------------------------------

describe("CheckpointIcon — children override", () => {
  it("renders children instead of the default icon when provided", () => {
    render(
      <CheckpointIcon>
        <span data-testid="custom-icon">★</span>
      </CheckpointIcon>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does NOT render the default bookmark icon when children are provided", () => {
    const { container } = render(
      <CheckpointIcon>
        <span data-testid="custom-icon">★</span>
      </CheckpointIcon>
    );
    expect(
      container.querySelector("[data-slot='checkpoint-icon']")
    ).not.toBeInTheDocument();
  });

  it("renders a plain text node child", () => {
    render(<CheckpointIcon>flag</CheckpointIcon>);
    expect(screen.getByText("flag")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. CheckpointTrigger — without tooltip
// ---------------------------------------------------------------------------

describe("CheckpointTrigger — without tooltip", () => {
  it("renders a button", () => {
    render(<CheckpointTrigger>Restore</CheckpointTrigger>);
    expect(
      screen.getByRole("button", { name: "Restore" })
    ).toBeInTheDocument();
  });

  it("has data-slot='checkpoint-trigger'", () => {
    render(<CheckpointTrigger>Restore</CheckpointTrigger>);
    expect(screen.getByRole("button", { name: "Restore" })).toHaveAttribute(
      "data-slot",
      "checkpoint-trigger"
    );
  });

  it("has type='button'", () => {
    render(<CheckpointTrigger>Restore</CheckpointTrigger>);
    expect(screen.getByRole("button", { name: "Restore" })).toHaveAttribute(
      "type",
      "button"
    );
  });

  it("defaults to the ghost variant (hover:bg-muted base class)", () => {
    render(<CheckpointTrigger>Restore</CheckpointTrigger>);
    const btn = screen.getByRole("button", { name: "Restore" });
    expect(btn.className).toContain("hover:bg-muted");
  });

  it("defaults to size='sm' (h-8 base class)", () => {
    render(<CheckpointTrigger>Restore</CheckpointTrigger>);
    const btn = screen.getByRole("button", { name: "Restore" });
    expect(btn.className).toContain("h-8");
  });

  it("forwards a custom className onto the button", () => {
    render(<CheckpointTrigger className="my-trigger">Restore</CheckpointTrigger>);
    const btn = screen.getByRole("button", { name: "Restore" });
    expect(btn.className).toContain("my-trigger");
  });

  it("applies a custom variant (default → bg-primary)", () => {
    render(
      <CheckpointTrigger variant="default">Restore</CheckpointTrigger>
    );
    const btn = screen.getByRole("button", { name: "Restore" });
    expect(btn.className).toContain("bg-primary");
  });

  it("applies a custom size (lg → h-9)", () => {
    render(<CheckpointTrigger size="lg">Restore</CheckpointTrigger>);
    const btn = screen.getByRole("button", { name: "Restore" });
    expect(btn.className).toContain("h-9");
  });

  it("fires onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<CheckpointTrigger onClick={onClick}>Restore</CheckpointTrigger>);
    await user.click(screen.getByRole("button", { name: "Restore" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<CheckpointTrigger disabled>Restore</CheckpointTrigger>);
    expect(screen.getByRole("button", { name: "Restore" })).toBeDisabled();
  });

  it("forwards arbitrary props (e.g. aria-label)", () => {
    render(
      <CheckpointTrigger aria-label="Restore checkpoint">
        <span aria-hidden>↺</span>
      </CheckpointTrigger>
    );
    expect(
      screen.getByRole("button", { name: "Restore checkpoint" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. CheckpointTrigger — with tooltip
// ---------------------------------------------------------------------------

describe("CheckpointTrigger — with tooltip", () => {
  it("renders a button when tooltip is provided", () => {
    render(
      <CheckpointTrigger tooltip="Restore to here">Restore</CheckpointTrigger>
    );
    expect(
      screen.getByRole("button", { name: "Restore" })
    ).toBeInTheDocument();
  });

  it("the button keeps data-slot='checkpoint-trigger' inside a tooltip", () => {
    render(
      <CheckpointTrigger tooltip="Restore to here">Restore</CheckpointTrigger>
    );
    expect(screen.getByRole("button", { name: "Restore" })).toHaveAttribute(
      "data-slot",
      "checkpoint-trigger"
    );
  });

  it("forwards variant/size/className through the tooltip branch", () => {
    render(
      <CheckpointTrigger
        tooltip="Restore to here"
        variant="default"
        size="lg"
        className="my-tt"
      >
        Restore
      </CheckpointTrigger>
    );
    const btn = screen.getByRole("button", { name: "Restore" });
    expect(btn.className).toContain("bg-primary");
    expect(btn.className).toContain("h-9");
    expect(btn.className).toContain("my-tt");
  });

  it("shows the tooltip content on hover", async () => {
    const user = userEvent.setup();
    render(
      <CheckpointTrigger tooltip="Restore to here">Restore</CheckpointTrigger>
    );
    await user.hover(screen.getByRole("button", { name: "Restore" }));
    expect(await screen.findByText("Restore to here")).toBeInTheDocument();
  });

  it("fires onClick on the tooltip-wrapped button", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <CheckpointTrigger tooltip="Restore to here" onClick={onClick}>
        Restore
      </CheckpointTrigger>
    );
    await user.click(screen.getByRole("button", { name: "Restore" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders no tooltip wiring when tooltip is omitted (no aria-describedby trigger)", () => {
    render(<CheckpointTrigger>Restore</CheckpointTrigger>);
    const btn = screen.getByRole("button", { name: "Restore" });
    // a Base UI tooltip trigger advertises a popup via aria-haspopup; plain button does not
    expect(btn).not.toHaveAttribute("aria-haspopup");
  });
});

// ---------------------------------------------------------------------------
// 8. Composition — full checkpoint row
// ---------------------------------------------------------------------------

describe("Checkpoint — composition", () => {
  it("renders icon + trigger + separator together", () => {
    const { container } = render(
      <Checkpoint>
        <CheckpointIcon />
        <CheckpointTrigger tooltip="Restore">Checkpoint #3</CheckpointTrigger>
      </Checkpoint>
    );
    const root = container.querySelector(
      "[data-slot='checkpoint']"
    ) as HTMLElement;
    expect(
      within(root).getByText("Checkpoint #3")
    ).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='checkpoint-icon']")
    ).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='separator']")
    ).toBeInTheDocument();
  });

  it("multiple checkpoints render independently", () => {
    render(
      <>
        <Checkpoint>
          <CheckpointTrigger>First</CheckpointTrigger>
        </Checkpoint>
        <Checkpoint>
          <CheckpointTrigger>Second</CheckpointTrigger>
        </Checkpoint>
      </>
    );
    expect(screen.getByRole("button", { name: "First" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Second" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 9. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Checkpoint — accessibility (axe)", () => {
  it("a full checkpoint row has no axe violations", async () => {
    const { container } = render(
      <main>
        <Checkpoint>
          <CheckpointIcon />
          <CheckpointTrigger tooltip="Restore to this checkpoint">
            Checkpoint #3
          </CheckpointTrigger>
        </Checkpoint>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("a trigger without tooltip has no axe violations", async () => {
    const { container } = render(
      <main>
        <Checkpoint>
          <CheckpointIcon />
          <CheckpointTrigger aria-label="Restore checkpoint">
            <span aria-hidden>↺</span>
          </CheckpointTrigger>
        </Checkpoint>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("a custom-icon checkpoint has no axe violations", async () => {
    const { container } = render(
      <main>
        <Checkpoint>
          <CheckpointIcon>
            <span aria-hidden>★</span>
          </CheckpointIcon>
          <CheckpointTrigger>Saved state</CheckpointTrigger>
        </Checkpoint>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
