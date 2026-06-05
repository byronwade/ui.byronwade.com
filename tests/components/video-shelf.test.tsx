import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi, beforeAll } from "vitest";
import { axe } from "vitest-axe";
import { VideoShelf } from "@/components/video-shelf";

// jsdom does not implement Element.scrollBy — provide a stub so the scroll
// handler's call path executes (and can be asserted) instead of throwing.
beforeAll(() => {
  // @ts-expect-error jsdom lacks this method
  Element.prototype.scrollBy = vi.fn();
});

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

// ─── 5. Scroll chevrons ─────────────────────────────────────────────────────
describe("scroll chevrons", () => {
  it("clicking the right chevron scrolls forward without throwing", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(Element.prototype, "scrollBy");
    render(<VideoShelf>{items()}</VideoShelf>);
    await user.click(screen.getByRole("button", { name: "Scroll right" }));
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 480 })
    );
    spy.mockRestore();
  });

  it("clicking the left chevron scrolls backward", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(Element.prototype, "scrollBy");
    render(<VideoShelf>{items()}</VideoShelf>);
    await user.click(screen.getByRole("button", { name: "Scroll left" }));
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ left: -480 })
    );
    spy.mockRestore();
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
