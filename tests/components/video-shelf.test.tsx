import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi, beforeAll, afterAll } from "vitest";
import { axe } from "vitest-axe";
import { VideoShelf } from "@/components/video-shelf";

// jsdom does not implement Element.scrollBy — provide a stub so the scroll
// handler's call path executes (and can be asserted) instead of throwing.
beforeAll(() => {
  // @ts-expect-error jsdom lacks this method
  Element.prototype.scrollBy = vi.fn()
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get() {
      return 2000
    },
  })
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() {
      return 800
    },
  })
  Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
    configurable: true,
    writable: true,
    value: 100,
  })
})

function items(count = 3) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} data-testid="item">
      Item {i + 1}
    </div>
  ));
}

function root(container: HTMLElement) {
  return container.querySelector('[data-slot="video-shelf"]')!;
}

function track(container: HTMLElement) {
  return container.querySelector('[data-slot="video-shelf-track"]')!;
}

// ─── 1. Default render ──────────────────────────────────────────────────────
describe("default render", () => {
  it("renders the root data-slot", () => {
    const { container } = render(<VideoShelf>{items()}</VideoShelf>);
    expect(root(container)).toBeInTheDocument();
  });

  it("renders the scroll track data-slot", () => {
    const { container } = render(<VideoShelf>{items()}</VideoShelf>);
    expect(track(container)).toBeInTheDocument();
  });

  it("renders left and right scroll chevrons", () => {
    render(<VideoShelf>{items()}</VideoShelf>);
    expect(
      screen.getByRole("button", { name: "Scroll left" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Scroll right" })
    ).toBeInTheDocument();
  });

  it("the track carries the house scroll utilities", () => {
    const { container } = render(<VideoShelf>{items()}</VideoShelf>);
    expect(track(container)).toHaveClass("mask-fade-x");
    expect(track(container)).toHaveClass("scrollbar-thin");
    expect(track(container)).toHaveClass("overflow-x-auto");
  });
});

// ─── 2. Title ───────────────────────────────────────────────────────────────
describe("title", () => {
  it("renders the title in a title data-slot when provided", () => {
    const { container } = render(
      <VideoShelf title="Recommended">{items()}</VideoShelf>
    );
    const title = container.querySelector('[data-slot="video-shelf-title"]')!;
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Recommended");
  });

  it("the title is editorial — font-medium, never font-bold", () => {
    const { container } = render(
      <VideoShelf title="Recommended">{items()}</VideoShelf>
    );
    const title = container.querySelector('[data-slot="video-shelf-title"]')!;
    expect(title).toHaveClass("font-medium");
    expect(title).not.toHaveClass("font-bold");
  });

  it("omits the title slot when no title is provided", () => {
    const { container } = render(<VideoShelf>{items()}</VideoShelf>);
    expect(
      container.querySelector('[data-slot="video-shelf-title"]')
    ).toBeNull();
  });

  it("omits the header entirely when neither title nor action is provided", () => {
    const { container } = render(<VideoShelf>{items()}</VideoShelf>);
    expect(
      container.querySelector('[data-slot="video-shelf-header"]')
    ).toBeNull();
  });
});

// ─── 3. Action ──────────────────────────────────────────────────────────────
describe("action", () => {
  it("renders the action in an action data-slot when provided", () => {
    const { container } = render(
      <VideoShelf action={<a href="#">View all</a>}>{items()}</VideoShelf>
    );
    const action = container.querySelector('[data-slot="video-shelf-action"]')!;
    expect(action).toBeInTheDocument();
    expect(within(action as HTMLElement).getByText("View all")).toBeInTheDocument();
  });

  it("renders a header (with the action) even when there is no title", () => {
    const { container } = render(
      <VideoShelf action={<a href="#">View all</a>}>{items()}</VideoShelf>
    );
    expect(
      container.querySelector('[data-slot="video-shelf-header"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="video-shelf-title"]')
    ).toBeNull();
  });

  it("omits the action slot when no action is provided", () => {
    const { container } = render(
      <VideoShelf title="Recommended">{items()}</VideoShelf>
    );
    expect(
      container.querySelector('[data-slot="video-shelf-action"]')
    ).toBeNull();
  });
});

// ─── 4. Children ────────────────────────────────────────────────────────────
describe("children", () => {
  it("renders every child inside the track", () => {
    const { container } = render(<VideoShelf>{items(4)}</VideoShelf>);
    const rendered = within(track(container) as HTMLElement).getAllByTestId(
      "item"
    );
    expect(rendered).toHaveLength(4);
  });

  it("wraps each child in a shrink-0 item slot", () => {
    const { container } = render(<VideoShelf>{items(4)}</VideoShelf>);
    const wrappers = container.querySelectorAll(
      '[data-slot="video-shelf-item"]'
    );
    expect(wrappers).toHaveLength(4);
    wrappers.forEach((wrapper) => expect(wrapper).toHaveClass("shrink-0"));
  });
});

describe("versatile layouts", () => {
  it("renders grid and stack variants without scroll controls", () => {
    const { container, rerender } = render(
      <VideoShelf variant="grid" title="Recommended">
        {items()}
      </VideoShelf>
    );
    expect(root(container)).toHaveAttribute("data-variant", "grid");
    expect(track(container)).toHaveClass("grid");
    expect(track(container)).not.toHaveClass("mask-fade-x");
    expect(
      screen.queryByRole("button", { name: "Scroll right" })
    ).not.toBeInTheDocument();

    rerender(<VideoShelf variant="stack">{items()}</VideoShelf>);
    expect(root(container)).toHaveAttribute("data-variant", "stack");
    expect(track(container)).toHaveClass("flex-col");
    expect(
      screen.queryByRole("button", { name: "Scroll left" })
    ).not.toBeInTheDocument();
  });

  it("renders rail variant with compact density and always-visible controls", () => {
    const { container } = render(
      <VideoShelf variant="rail" density="compact" controls="always">
        {items()}
      </VideoShelf>
    );
    expect(root(container)).toHaveAttribute("data-variant", "rail");
    expect(root(container)).toHaveAttribute("data-density", "compact");
    expect(track(container)).toHaveClass("gap-2");
    expect(screen.getByRole("button", { name: "Scroll right" })).toHaveClass(
      "opacity-100"
    );
  });

  it("renders a description under the title", () => {
    const { container } = render(
      <VideoShelf title="Recommended" description="Fresh uploads">
        {items()}
      </VideoShelf>
    );
    expect(
      container.querySelector('[data-slot="video-shelf-description"]')
    ).toHaveTextContent("Fresh uploads");
  });

  it("renders an empty state when children are absent", () => {
    const { container } = render(
      <VideoShelf empty={<p>No videos yet</p>}>{null}</VideoShelf>
    );
    expect(
      container.querySelector('[data-slot="video-shelf-empty"]')
    ).toHaveTextContent("No videos yet");
    expect(
      container.querySelector('[data-slot="video-shelf-track"]')
    ).toBeNull();
  });

  it("renders loading skeleton items", () => {
    const { container } = render(
      <VideoShelf loading loadingItems={3}>
        {items()}
      </VideoShelf>
    );
    expect(
      container.querySelectorAll('[data-slot="video-shelf-skeleton"]')
    ).toHaveLength(3);
  });

  it("merges itemClassName onto each item wrapper", () => {
    const { container } = render(
      <VideoShelf itemClassName="basis-64">{items(2)}</VideoShelf>
    );
    const wrappers = container.querySelectorAll(
      '[data-slot="video-shelf-item"]'
    );
    wrappers.forEach((wrapper) => expect(wrapper).toHaveClass("basis-64"));
  });

  it("notifies consumers when scroll affordance changes", () => {
    const onScrollStateChange = vi.fn();
    render(
      <VideoShelf onScrollStateChange={onScrollStateChange}>
        {items()}
      </VideoShelf>
    );
    expect(onScrollStateChange).toHaveBeenCalledWith({
      canScrollLeft: true,
      canScrollRight: true,
    });
  });

  it("uses numeric scrollAmount and arrow-key scrolling on horizontal tracks", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(Element.prototype, "scrollBy");
    const { container } = render(
      <VideoShelf scrollAmount={120}>{items()}</VideoShelf>
    );
    await user.click(screen.getByRole("button", { name: "Scroll right" }));
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 120, behavior: "smooth" })
    );

    fireEvent.keyDown(track(container), { key: "ArrowLeft" });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ left: -120, behavior: "smooth" })
    );
    spy.mockRestore();
  });
});

// ─── 5. Scroll chevrons ─────────────────────────────────────────────────────
describe("scroll chevrons", () => {
  it("clicking the right chevron scrolls forward without throwing", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(Element.prototype, "scrollBy");
    render(<VideoShelf>{items()}</VideoShelf>);
    await user.click(screen.getByRole("button", { name: "Scroll right" }));
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" })
    );
    spy.mockRestore();
  });

  it("clicking the left chevron scrolls backward", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(Element.prototype, "scrollBy");
    render(<VideoShelf>{items()}</VideoShelf>);
    await user.click(screen.getByRole("button", { name: "Scroll left" }));
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" })
    );
    spy.mockRestore();
  });

  it("the track uses scroll snap", () => {
    const { container } = render(<VideoShelf>{items()}</VideoShelf>);
    expect(track(container)).toHaveClass("snap-x");
    expect(track(container)).toHaveClass("snap-mandatory");
  });
});

// ─── 6. className passthrough ───────────────────────────────────────────────
describe("className passthrough", () => {
  it("merges a custom className onto the root without clobbering base", () => {
    const { container } = render(
      <VideoShelf className="custom-shelf">{items()}</VideoShelf>
    );
    expect(root(container)).toHaveClass("custom-shelf");
    expect(root(container)).toHaveClass("relative");
  });
});

// ─── 7. Accessibility ───────────────────────────────────────────────────────
describe("accessibility", () => {
  it("has no axe violations (title + action)", async () => {
    const { container } = render(
      <VideoShelf title="Recommended" action={<a href="#">View all</a>}>
        {items()}
      </VideoShelf>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (no header)", async () => {
    const { container } = render(<VideoShelf>{items()}</VideoShelf>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
