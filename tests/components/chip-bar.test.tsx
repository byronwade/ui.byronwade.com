import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi, beforeAll } from "vitest";
import { axe } from "vitest-axe";
import { useState } from "react";
import { ChipBar } from "@/components/ui/chip-bar";

// jsdom does not implement Element.scrollBy — provide a stub so the scroll
// handler's call path executes (and can be asserted) instead of throwing.
beforeAll(() => {
  // @ts-expect-error jsdom lacks this method
  Element.prototype.scrollBy = vi.fn();
});

const OBJECT_ITEMS = [
  { value: "all", label: "All" },
  { value: "music", label: "Music" },
  { value: "gaming", label: "Gaming" },
  { value: "live", label: "Live" },
];

const STRING_ITEMS = ["All", "Music", "Gaming"];

function tablist() {
  return screen.getByRole("tablist");
}

function tabs() {
  return screen.getAllByRole("tab");
}

/** Controlled harness to observe real state propagation. */
function Controlled({ initial = "all" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <span data-testid="current">{value}</span>
      <ChipBar items={OBJECT_ITEMS} value={value} onValueChange={setValue} />
    </>
  );
}

// ─── 1. Default render ──────────────────────────────────────────────────────
describe("default render", () => {
  it("renders the root data-slot", () => {
    const { container } = render(<ChipBar items={OBJECT_ITEMS} />);
    expect(
      container.querySelector('[data-slot="chip-bar"]')
    ).toBeInTheDocument();
  });

  it("renders a tablist scroller with a chip per item", () => {
    render(<ChipBar items={OBJECT_ITEMS} />);
    expect(tablist()).toBeInTheDocument();
    expect(within(tablist()).getAllByRole("tab")).toHaveLength(
      OBJECT_ITEMS.length
    );
  });

  it("renders each item's label", () => {
    render(<ChipBar items={OBJECT_ITEMS} />);
    expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Music" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Gaming" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Live" })).toBeInTheDocument();
  });

  it("chips carry the chip data-slot and type=button", () => {
    render(<ChipBar items={OBJECT_ITEMS} />);
    tabs().forEach((chip) => {
      expect(chip).toHaveAttribute("data-slot", "chip-bar-chip");
      expect(chip).toHaveAttribute("type", "button");
    });
  });

  it("renders left and right scroll chevrons", () => {
    render(<ChipBar items={OBJECT_ITEMS} />);
    expect(
      screen.getByRole("button", { name: "Scroll left" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Scroll right" })
    ).toBeInTheDocument();
  });
});

// ─── 2. Selected state reflects defaultValue ────────────────────────────────
describe("selected state", () => {
  it("defaultValue marks the matching chip aria-selected=true", () => {
    render(<ChipBar items={OBJECT_ITEMS} defaultValue="music" />);
    expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("non-selected chips are aria-selected=false", () => {
    render(<ChipBar items={OBJECT_ITEMS} defaultValue="music" />);
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(screen.getByRole("tab", { name: "Live" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("selected chip carries data-active=true and primary classes", () => {
    render(<ChipBar items={OBJECT_ITEMS} defaultValue="all" />);
    const active = screen.getByRole("tab", { name: "All" });
    expect(active).toHaveAttribute("data-active", "true");
    expect(active).toHaveClass("bg-primary");
    expect(active).toHaveClass("text-primary-foreground");
  });

  it("unselected chips carry the secondary classes", () => {
    render(<ChipBar items={OBJECT_ITEMS} defaultValue="all" />);
    const inactive = screen.getByRole("tab", { name: "Music" });
    expect(inactive).toHaveAttribute("data-active", "false");
    expect(inactive).toHaveClass("bg-secondary");
    expect(inactive).toHaveClass("text-secondary-foreground");
  });

  it("with no defaultValue, no chip is selected", () => {
    render(<ChipBar items={OBJECT_ITEMS} />);
    const selected = tabs().filter(
      (c) => c.getAttribute("aria-selected") === "true"
    );
    expect(selected).toHaveLength(0);
  });
});

// ─── 3. Uncontrolled selection ──────────────────────────────────────────────
describe("uncontrolled selection", () => {
  it("clicking a chip selects it and fires onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipBar
        items={OBJECT_ITEMS}
        defaultValue="all"
        onValueChange={onValueChange}
      />
    );
    await user.click(screen.getByRole("tab", { name: "Gaming" }));
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith("gaming");
    expect(screen.getByRole("tab", { name: "Gaming" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("updates internal state even without an onValueChange handler", async () => {
    const user = userEvent.setup();
    render(<ChipBar items={OBJECT_ITEMS} defaultValue="all" />);
    await user.click(screen.getByRole("tab", { name: "Live" }));
    expect(screen.getByRole("tab", { name: "Live" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("only one chip is selected after clicking", async () => {
    const user = userEvent.setup();
    render(<ChipBar items={OBJECT_ITEMS} defaultValue="all" />);
    await user.click(screen.getByRole("tab", { name: "Music" }));
    const selected = tabs().filter(
      (c) => c.getAttribute("aria-selected") === "true"
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveAccessibleName("Music");
  });
});

// ─── 4. Controlled mode ─────────────────────────────────────────────────────
describe("controlled mode", () => {
  it("respects the value prop and does not self-update on click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipBar
        items={OBJECT_ITEMS}
        value="all"
        onValueChange={onValueChange}
      />
    );
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await user.click(screen.getByRole("tab", { name: "Music" }));
    // value is fixed externally → still "all"
    expect(onValueChange).toHaveBeenCalledWith("music");
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("re-renders to the externally controlled value", () => {
    const { rerender } = render(
      <ChipBar items={OBJECT_ITEMS} value="all" onValueChange={vi.fn()} />
    );
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    rerender(
      <ChipBar items={OBJECT_ITEMS} value="gaming" onValueChange={vi.fn()} />
    );
    expect(screen.getByRole("tab", { name: "Gaming" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("controlled harness propagates the new value through state", async () => {
    const user = userEvent.setup();
    render(<Controlled initial="all" />);
    expect(screen.getByTestId("current")).toHaveTextContent("all");
    await user.click(screen.getByRole("tab", { name: "Live" }));
    expect(screen.getByTestId("current")).toHaveTextContent("live");
    expect(screen.getByRole("tab", { name: "Live" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});

// ─── 5. string[] normalization ──────────────────────────────────────────────
describe("string item normalization", () => {
  it("renders a chip per string and selects by string value", () => {
    render(<ChipBar items={STRING_ITEMS} defaultValue="Music" />);
    expect(tabs()).toHaveLength(STRING_ITEMS.length);
    expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("clicking a normalized string chip fires its value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ChipBar items={STRING_ITEMS} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Gaming" }));
    expect(onValueChange).toHaveBeenCalledWith("Gaming");
  });
});

// ─── 6. Keyboard selection ──────────────────────────────────────────────────
describe("keyboard selection", () => {
  it("ArrowRight moves selection to the next chip", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipBar
        items={OBJECT_ITEMS}
        defaultValue="all"
        onValueChange={onValueChange}
      />
    );
    const first = screen.getByRole("tab", { name: "All" });
    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith("music");
    expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("ArrowLeft moves selection to the previous chip", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipBar
        items={OBJECT_ITEMS}
        defaultValue="music"
        onValueChange={onValueChange}
      />
    );
    screen.getByRole("tab", { name: "Music" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(onValueChange).toHaveBeenCalledWith("all");
  });

  it("ArrowRight wraps from the last chip to the first", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipBar
        items={OBJECT_ITEMS}
        defaultValue="live"
        onValueChange={onValueChange}
      />
    );
    screen.getByRole("tab", { name: "Live" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith("all");
  });

  it("ArrowLeft wraps from the first chip to the last", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipBar
        items={OBJECT_ITEMS}
        defaultValue="all"
        onValueChange={onValueChange}
      />
    );
    screen.getByRole("tab", { name: "All" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(onValueChange).toHaveBeenCalledWith("live");
  });

  it("a non-arrow key does not change selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipBar
        items={OBJECT_ITEMS}
        defaultValue="all"
        onValueChange={onValueChange}
      />
    );
    const first = screen.getByRole("tab", { name: "All" });
    first.focus();
    await user.keyboard("a");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("Enter activates a focused chip (native button)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipBar
        items={OBJECT_ITEMS}
        defaultValue="all"
        onValueChange={onValueChange}
      />
    );
    screen.getByRole("tab", { name: "Gaming" }).focus();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("gaming");
  });
});

// ─── 6b. Keyboard accessibility (roving tabindex + focus + scroll-into-view) ──
describe("keyboard accessibility", () => {
  it("uses roving tabindex — only the selected chip is tabbable", () => {
    render(<ChipBar items={OBJECT_ITEMS} defaultValue="all" />);
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "tabindex",
      "0"
    );
    expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute(
      "tabindex",
      "-1"
    );
  });

  it("makes the first chip tabbable when nothing is selected", () => {
    render(<ChipBar items={OBJECT_ITEMS} />);
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "tabindex",
      "0"
    );
    expect(screen.getByRole("tab", { name: "Music" })).toHaveAttribute(
      "tabindex",
      "-1"
    );
  });

  it("ArrowRight moves focus to the next chip, not just selection", async () => {
    const user = userEvent.setup();
    render(<ChipBar items={OBJECT_ITEMS} defaultValue="all" />);
    screen.getByRole("tab", { name: "All" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Music" })).toHaveFocus();
  });

  it("scrolls the newly focused chip into view", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    const orig = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = spy;
    try {
      render(<ChipBar items={OBJECT_ITEMS} defaultValue="all" />);
      screen.getByRole("tab", { name: "All" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(spy).toHaveBeenCalled();
    } finally {
      Element.prototype.scrollIntoView = orig;
    }
  });
});

// ─── 7. Scroll chevrons ─────────────────────────────────────────────────────
describe("scroll chevrons", () => {
  it("clicking the right chevron scrolls without throwing", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(Element.prototype, "scrollBy");
    render(<ChipBar items={OBJECT_ITEMS} />);
    await user.click(screen.getByRole("button", { name: "Scroll right" }));
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 240 })
    );
    spy.mockRestore();
  });

  it("clicking the left chevron scrolls in the negative direction", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(Element.prototype, "scrollBy");
    render(<ChipBar items={OBJECT_ITEMS} />);
    await user.click(screen.getByRole("button", { name: "Scroll left" }));
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ left: -240 })
    );
    spy.mockRestore();
  });
});

// ─── 8. className passthrough ───────────────────────────────────────────────
describe("className passthrough", () => {
  it("merges a custom className onto the root without clobbering base", () => {
    const { container } = render(
      <ChipBar items={OBJECT_ITEMS} className="custom-bar" />
    );
    const root = container.querySelector('[data-slot="chip-bar"]')!;
    expect(root).toHaveClass("custom-bar");
    expect(root).toHaveClass("relative");
  });
});

// ─── 9. Accessibility ───────────────────────────────────────────────────────
describe("accessibility", () => {
  it("has no axe violations (object items)", async () => {
    const { container } = render(
      <ChipBar items={OBJECT_ITEMS} defaultValue="all" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (string items, no selection)", async () => {
    const { container } = render(<ChipBar items={STRING_ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations after a selection change", async () => {
    const user = userEvent.setup();
    const { container } = render(<Controlled initial="all" />);
    await user.click(screen.getByRole("tab", { name: "Gaming" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
