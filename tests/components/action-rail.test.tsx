/**
 * Exhaustive tests for <ActionRail />
 *
 * Component source: components/ui/action-rail.tsx
 * API summary:
 *   - Root <div role="group"> with data-slot="action-rail"
 *   - Renders one <button data-slot="action-rail-action"> per action
 *   - Each button: icon chip (data-slot="action-rail-chip") + optional count
 *     (data-slot="action-rail-count", compact-formatted, font-mono tabular-nums)
 *   - aria-label={label}, aria-pressed={active}; active tints chip with bg-primary
 *   - orientation: "vertical" (flex-col) | "horizontal" (flex-row)
 *   - size: "sm" | "md"
 *   - className merged via cn()
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ChatCircle, DotsThreeVertical, ShareNetwork, ThumbsDown, ThumbsUp } from "@/lib/icons"
import { ActionRail, type ActionRailItem } from "@/components/ui/action-rail";

const compact = (n: number) =>
  new Intl.NumberFormat(undefined, { notation: "compact" }).format(n);

function baseActions(overrides: Partial<ActionRailItem>[] = []): ActionRailItem[] {
  const defaults: ActionRailItem[] = [
    { key: "like", icon: <ThumbsUp />, label: "Like", count: 128400, active: true },
    { key: "dislike", icon: <ThumbsDown />, label: "Dislike", count: 412 },
    { key: "comments", icon: <ChatCircle />, label: "Comments", count: 2300 },
    { key: "share", icon: <ShareNetwork />, label: "Share" },
    { key: "more", icon: <DotsThreeVertical />, label: "More actions" },
  ];
  return defaults.map((a, i) => ({ ...a, ...overrides[i] }));
}

// ---------------------------------------------------------------------------
// 1. Default render
// ---------------------------------------------------------------------------

describe("ActionRail — default render", () => {
  it("renders without crashing", () => {
    render(<ActionRail actions={baseActions()} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("root has data-slot='action-rail'", () => {
    render(<ActionRail actions={baseActions()} />);
    expect(screen.getByRole("group")).toHaveAttribute("data-slot", "action-rail");
  });

  it("renders one button per action", () => {
    render(<ActionRail actions={baseActions()} />);
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("each button carries data-slot='action-rail-action'", () => {
    render(<ActionRail actions={baseActions()} />);
    for (const btn of screen.getAllByRole("button")) {
      expect(btn).toHaveAttribute("data-slot", "action-rail-action");
    }
  });

  it("each button is type='button'", () => {
    render(<ActionRail actions={baseActions()} />);
    for (const btn of screen.getAllByRole("button")) {
      expect(btn).toHaveAttribute("type", "button");
    }
  });

  it("exposes each action's accessible label", () => {
    render(<ActionRail actions={baseActions()} />);
    expect(screen.getByRole("button", { name: "Like" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More actions" })).toBeInTheDocument();
  });

  it("renders the icon chip for each action", () => {
    const { container } = render(<ActionRail actions={baseActions()} />);
    expect(container.querySelectorAll('[data-slot="action-rail-chip"]')).toHaveLength(5);
  });

  it("renders an empty rail when actions is empty", () => {
    render(<ActionRail actions={[]} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// 2. Counts (compact formatting + omission)
// ---------------------------------------------------------------------------

describe("ActionRail — counts", () => {
  it("renders counts compact-formatted (locale-agnostic)", () => {
    render(<ActionRail actions={baseActions()} />);
    const like = screen.getByRole("button", { name: "Like" });
    expect(within(like).getByText(compact(128400))).toBeInTheDocument();
  });

  it("formats a small count without abbreviation", () => {
    render(<ActionRail actions={baseActions()} />);
    const dislike = screen.getByRole("button", { name: "Dislike" });
    expect(within(dislike).getByText(compact(412))).toBeInTheDocument();
  });

  it("count element has data-slot='action-rail-count'", () => {
    const { container } = render(<ActionRail actions={baseActions()} />);
    const counts = container.querySelectorAll('[data-slot="action-rail-count"]');
    // 3 of the 5 default actions have a count
    expect(counts).toHaveLength(3);
  });

  it("count uses font-mono tabular-nums", () => {
    const { container } = render(<ActionRail actions={baseActions()} />);
    const count = container.querySelector('[data-slot="action-rail-count"]');
    expect(count).toHaveClass("font-mono");
    expect(count).toHaveClass("tabular-nums");
  });

  it("omits the count element when count is undefined", () => {
    render(<ActionRail actions={baseActions()} />);
    const share = screen.getByRole("button", { name: "Share" });
    expect(share.querySelector('[data-slot="action-rail-count"]')).toBeNull();
  });

  it("renders a zero count rather than omitting it", () => {
    render(
      <ActionRail actions={[{ key: "z", icon: <ThumbsUp />, label: "Zero", count: 0 }]} />,
    );
    const btn = screen.getByRole("button", { name: "Zero" });
    expect(within(btn).getByText(compact(0))).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Active state
// ---------------------------------------------------------------------------

describe("ActionRail — active state", () => {
  it("active action has aria-pressed='true'", () => {
    render(<ActionRail actions={baseActions()} />);
    expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("active action sets data-active", () => {
    render(<ActionRail actions={baseActions()} />);
    expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute("data-active", "true");
  });

  it("active action tints its chip with bg-primary", () => {
    render(<ActionRail actions={baseActions()} />);
    const chip = screen
      .getByRole("button", { name: "Like" })
      .querySelector('[data-slot="action-rail-chip"]');
    expect(chip).toHaveClass("bg-primary");
    expect(chip).toHaveClass("text-primary-foreground");
  });

  it("explicitly inactive action has aria-pressed='false'", () => {
    render(
      <ActionRail
        actions={[{ key: "d", icon: <ThumbsDown />, label: "Down", active: false }]}
      />,
    );
    expect(screen.getByRole("button", { name: "Down" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("inactive action chip uses bg-secondary, not bg-primary", () => {
    render(<ActionRail actions={baseActions()} />);
    const chip = screen
      .getByRole("button", { name: "Dislike" })
      .querySelector('[data-slot="action-rail-chip"]');
    expect(chip).toHaveClass("bg-secondary");
    expect(chip).not.toHaveClass("bg-primary");
  });

  it("omits aria-pressed and data-active when active is unset", () => {
    render(<ActionRail actions={baseActions()} />);
    const share = screen.getByRole("button", { name: "Share" });
    expect(share).not.toHaveAttribute("aria-pressed");
    expect(share).not.toHaveAttribute("data-active");
  });
});

// ---------------------------------------------------------------------------
// 4. Click interaction
// ---------------------------------------------------------------------------

describe("ActionRail — click interaction", () => {
  it("fires the clicked action's onClick", async () => {
    const user = userEvent.setup();
    const onLike = vi.fn();
    const onShare = vi.fn();
    render(
      <ActionRail
        actions={baseActions([
          { onClick: onLike },
          {},
          {},
          { onClick: onShare },
        ])}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Like" }));
    expect(onLike).toHaveBeenCalledTimes(1);
    expect(onShare).not.toHaveBeenCalled();
  });

  it("does not throw when an action has no onClick", async () => {
    const user = userEvent.setup();
    render(<ActionRail actions={baseActions()} />);
    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(screen.getByRole("button", { name: "More actions" })).toBeInTheDocument();
  });

  it("is keyboard-activatable via Enter", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ActionRail actions={[{ key: "k", icon: <ThumbsUp />, label: "K", onClick }]} />,
    );
    screen.getByRole("button", { name: "K" }).focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// 5. Orientation
// ---------------------------------------------------------------------------

describe("ActionRail — orientation", () => {
  it("defaults to vertical (flex-col)", () => {
    render(<ActionRail actions={baseActions()} />);
    const root = screen.getByRole("group");
    expect(root).toHaveClass("flex-col");
    expect(root).toHaveAttribute("data-orientation", "vertical");
  });

  it("applies flex-row in horizontal orientation", () => {
    render(<ActionRail actions={baseActions()} orientation="horizontal" />);
    const root = screen.getByRole("group");
    expect(root).toHaveClass("flex-row");
    expect(root).toHaveAttribute("data-orientation", "horizontal");
  });
});

// ---------------------------------------------------------------------------
// 6. Size
// ---------------------------------------------------------------------------

describe("ActionRail — size", () => {
  it("defaults to md chip size", () => {
    render(<ActionRail actions={baseActions()} />);
    const chip = screen.getAllByRole("button")[0].querySelector('[data-slot="action-rail-chip"]');
    expect(chip).toHaveClass("size-11");
  });

  it("applies the sm chip size", () => {
    render(<ActionRail actions={baseActions()} size="sm" />);
    const chip = screen.getAllByRole("button")[0].querySelector('[data-slot="action-rail-chip"]');
    expect(chip).toHaveClass("size-9");
  });
});

// ---------------------------------------------------------------------------
// 7. Variant
// ---------------------------------------------------------------------------

describe("ActionRail — variant", () => {
  it("defaults to the default variant", () => {
    render(<ActionRail actions={baseActions()} />);
    expect(screen.getByRole("group")).toHaveAttribute("data-variant", "default");
  });

  it("applies the overlay variant for Shorts-style rails", () => {
    render(<ActionRail actions={baseActions()} variant="overlay" />);
    const root = screen.getByRole("group");
    expect(root).toHaveAttribute("data-variant", "overlay");
    expect(root.className).toContain("[&_[data-slot=action-rail-count]]:text-background/80");
  });
});

// ---------------------------------------------------------------------------
// 8. className merge + pass-through
// ---------------------------------------------------------------------------

describe("ActionRail — className and pass-through", () => {
  it("merges a custom className onto the root", () => {
    render(<ActionRail actions={baseActions()} className="custom-rail" />);
    const root = screen.getByRole("group");
    expect(root).toHaveClass("custom-rail");
    expect(root).toHaveClass("flex");
  });

  it("passes native props through to the root", () => {
    render(<ActionRail actions={baseActions()} data-testid="rail" id="my-rail" />);
    const root = screen.getByTestId("rail");
    expect(root).toHaveAttribute("id", "my-rail");
  });
});

// ---------------------------------------------------------------------------
// 9. Accessibility (axe)
// ---------------------------------------------------------------------------

describe("ActionRail — accessibility (axe)", () => {
  it("has no axe violations (default vertical)", async () => {
    const { container } = render(<ActionRail actions={baseActions()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (horizontal, sm)", async () => {
    const { container } = render(
      <ActionRail actions={baseActions()} orientation="horizontal" size="sm" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
