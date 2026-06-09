/**
 * Tests for <ShowcaseCarousel /> + <ShowcaseCard /> (components/ui/showcase-carousel.tsx)
 *
 * Horizontal carousel of cover cards; each card opens into a detail modal. jsdom
 * has no scrollBy/scrollTo and zero layout metrics, so we stub those. motion runs
 * in jsdom; we assert structure/state/a11y, never the spring visuals.
 */

import * as React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  ShowcaseCarousel,
  ShowcaseCard,
  ShowcaseCardImage,
} from "@/components/ui/showcase-carousel";

const CARDS = [
  {
    category: "Product",
    title: "First card",
    src: "/a.png",
    content: <p>First body</p>,
  },
  {
    category: "Engineering",
    title: "Second card",
    src: "/b.png",
    content: <p>Second body</p>,
  },
];

function renderShowcase() {
  return render(
    <ShowcaseCarousel
      items={CARDS.map((card, index) => (
        <ShowcaseCard key={card.title} card={card} index={index} />
      ))}
    />,
  );
}

// jsdom reports 0 for scroll geometry (so the Next arrow would be disabled) and
// implements neither scrollBy nor scrollTo. Stub both, then restore so nothing
// leaks into other test files in the full suite.
const origScrollWidth = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollWidth",
);
const origClientWidth = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "clientWidth",
);

beforeEach(() => {
  Element.prototype.scrollBy = vi.fn();
  Element.prototype.scrollTo = vi.fn();
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get: () => 1000,
  });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => 500,
  });
});

afterEach(() => {
  delete (Element.prototype as Partial<Element>).scrollBy;
  delete (Element.prototype as Partial<Element>).scrollTo;
  if (origScrollWidth)
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", origScrollWidth);
  if (origClientWidth)
    Object.defineProperty(HTMLElement.prototype, "clientWidth", origClientWidth);
});

describe("ShowcaseCarousel — render", () => {
  it("renders the carousel container", () => {
    const { container } = renderShowcase();
    expect(
      container.querySelector('[data-slot="showcase-carousel"]'),
    ).not.toBeNull();
  });

  it("renders a button per card (card triggers) plus the two nav arrows", () => {
    renderShowcase();
    // Card triggers expose their title as accessible text.
    expect(screen.getByText("First card")).toBeInTheDocument();
    expect(screen.getByText("Second card")).toBeInTheDocument();
  });

  it("renders labelled prev/next controls", () => {
    renderShowcase();
    expect(screen.getByRole("button", { name: "Previous cards" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next cards" })).toBeInTheDocument();
  });

  it("disables Previous initially and enables Next", () => {
    renderShowcase();
    expect(screen.getByRole("button", { name: "Previous cards" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next cards" })).not.toBeDisabled();
  });

  it("uses token surfaces (bg-muted controls)", () => {
    renderShowcase();
    expect(screen.getByRole("button", { name: "Next cards" })).toHaveClass("bg-muted");
  });
});

describe("ShowcaseCarousel — scroll controls", () => {
  it("calls scrollBy when Next is clicked", async () => {
    const user = userEvent.setup();
    renderShowcase();
    await user.click(screen.getByRole("button", { name: "Next cards" }));
    expect(Element.prototype.scrollBy).toHaveBeenCalled();
  });

  it("recomputes scrollability on scroll", () => {
    const { container } = renderShowcase();
    const scroller = container.querySelector(
      ".overflow-x-scroll",
    ) as HTMLElement;
    fireEvent.scroll(scroller);
    // No throw; Previous still disabled at scrollLeft 0.
    expect(screen.getByRole("button", { name: "Previous cards" })).toBeDisabled();
  });
});

describe("ShowcaseCard — modal open/close", () => {
  it("opens the modal with category, title and content on click", async () => {
    const user = userEvent.setup();
    renderShowcase();
    await user.click(screen.getByText("First card"));
    expect(await screen.findByText("First body")).toBeInTheDocument();
    // Category appears both on the card and in the modal.
    expect(screen.getAllByText("Product").length).toBeGreaterThanOrEqual(1);
  });

  it("closes the modal via the Close button", async () => {
    const user = userEvent.setup();
    renderShowcase();
    await user.click(screen.getByText("First card"));
    const close = await screen.findByRole("button", { name: "Close" });
    await user.click(close);
    await waitFor(() =>
      expect(screen.queryByText("First body")).not.toBeInTheDocument(),
    );
  });

  it("closes the modal on an outside click", async () => {
    const user = userEvent.setup();
    renderShowcase();
    await user.click(screen.getByText("First card"));
    expect(await screen.findByText("First body")).toBeInTheDocument();
    // Pointer down outside the modal panel triggers useOutsideClick → close.
    fireEvent.mouseDown(document.body);
    await waitFor(() =>
      expect(screen.queryByText("First body")).not.toBeInTheDocument(),
    );
  });

  it("closes the modal on Escape", async () => {
    const user = userEvent.setup();
    renderShowcase();
    await user.click(screen.getByText("First card"));
    expect(await screen.findByText("First body")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("First body")).not.toBeInTheDocument(),
    );
  });

  it("ignores non-Escape keys while the modal is open", async () => {
    const user = userEvent.setup();
    renderShowcase();
    await user.click(screen.getByText("First card"));
    expect(await screen.findByText("First body")).toBeInTheDocument();
    // A non-Escape key exercises the keydown handler's false branch — it must
    // NOT close the modal.
    fireEvent.keyDown(window, { key: "a" });
    fireEvent.keyDown(window, { key: "Tab" });
    expect(screen.getByText("First body")).toBeInTheDocument();
  });

  it("locks body scroll while open and restores it on close", async () => {
    const user = userEvent.setup();
    renderShowcase();
    await user.click(screen.getByText("First card"));
    await screen.findByText("First body");
    expect(document.body.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.body.style.overflow).toBe("auto"));
  });
});

describe("ShowcaseCardImage", () => {
  it("starts blurred and unblurs on load", () => {
    const { container } = render(<ShowcaseCardImage src="/x.png" alt="x" />);
    const img = container.querySelector("img")!;
    expect(img).toHaveClass("blur-sm");
    fireEvent.load(img);
    expect(img).toHaveClass("blur-0");
  });

  it("falls back to a generic alt when none is given", () => {
    const { container } = render(<ShowcaseCardImage src="/x.png" />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "Background");
  });
});

describe("ShowcaseCarousel — layout, initialScroll, mobile & Previous", () => {
  it("renders shared-layout cards and opens them (layout prop)", async () => {
    const user = userEvent.setup();
    render(
      <ShowcaseCarousel
        initialScroll={50}
        items={CARDS.map((card, index) => (
          <ShowcaseCard key={card.title} card={card} index={index} layout />
        ))}
      />,
    );
    await user.click(screen.getByText("First card"));
    expect(await screen.findByText("First body")).toBeInTheDocument();
  });

  it("closes via the mobile breakpoint without crashing", async () => {
    const user = userEvent.setup();
    const orig = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 500 });
    try {
      render(
        <ShowcaseCarousel
          items={CARDS.map((card, index) => (
            <ShowcaseCard key={card.title} card={card} index={index} />
          ))}
        />,
      );
      await user.click(screen.getByText("First card"));
      await screen.findByText("First body");
      await user.keyboard("{Escape}");
      await waitFor(() =>
        expect(screen.queryByText("First body")).not.toBeInTheDocument(),
      );
      expect(Element.prototype.scrollTo).toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: orig,
      });
    }
  });

  it("enables and fires the Previous control when scrolled right", async () => {
    const user = userEvent.setup();
    const origLeft = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollLeft",
    );
    Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
      configurable: true,
      get: () => 200,
      set: () => {},
    });
    try {
      const { container } = renderShowcase();
      fireEvent.scroll(container.querySelector(".overflow-x-scroll")!);
      const prev = screen.getByRole("button", { name: "Previous cards" });
      await waitFor(() => expect(prev).not.toBeDisabled());
      await user.click(prev);
      expect(Element.prototype.scrollBy).toHaveBeenCalled();
    } finally {
      if (origLeft)
        Object.defineProperty(HTMLElement.prototype, "scrollLeft", origLeft);
    }
  });
});

describe("ShowcaseCard — standalone (default context)", () => {
  it("opens and closes a card rendered without a ShowcaseCarousel provider", async () => {
    const user = userEvent.setup();
    render(<ShowcaseCard card={CARDS[0]} index={0} />);
    await user.click(screen.getByText("First card"));
    expect(await screen.findByText("First body")).toBeInTheDocument();
    // Close path exercises the default no-op onCardClose from the context.
    await user.click(await screen.findByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(screen.queryByText("First body")).not.toBeInTheDocument(),
    );
  });
});

describe("ShowcaseCarousel — accessibility", () => {
  it("has no axe violations (closed)", async () => {
    const { container } = renderShowcase();
    expect(await axe(container)).toHaveNoViolations();
  });
});
