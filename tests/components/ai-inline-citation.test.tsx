/**
 * Exhaustive tests for the AI Inline Citation compound component
 * (adapted from Vercel AI Elements).
 *
 * Component source: components/ai-elements/inline-citation.tsx
 *
 * Exports:
 *   InlineCitation                – inline wrapper span, data-slot="inline-citation"
 *   InlineCitationText            – highlighted run, data-slot="inline-citation-text"
 *   InlineCitationCard            – HoverCard root wrapper
 *   InlineCitationCardTrigger     – Badge trigger w/ sources[], data-slot="inline-citation-card-trigger"
 *   InlineCitationCardBody        – HoverCard content, data-slot="inline-citation-card-body"
 *   InlineCitationCarousel        – index-slider root, data-slot="inline-citation-carousel"
 *   InlineCitationCarouselContent – track wrapper, data-slot="inline-citation-carousel-content"
 *   InlineCitationCarouselItem    – slide, data-slot="inline-citation-carousel-item"
 *   InlineCitationCarouselHeader  – header row, data-slot="inline-citation-carousel-header"
 *   InlineCitationCarouselIndex   – "current/count", data-slot="inline-citation-carousel-index"
 *   InlineCitationCarouselPrev    – prev button, data-slot="inline-citation-carousel-prev"
 *   InlineCitationCarouselNext    – next button, data-slot="inline-citation-carousel-next"
 *   InlineCitationSource          – title/url/description, data-slot="inline-citation-source"
 *   InlineCitationQuote           – blockquote, data-slot="inline-citation-quote"
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSource,
  InlineCitationQuote,
} from "@/components/ai-elements/inline-citation";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const URLS = ["https://example.com/a", "https://docs.example.org/b"];

/** Render a carousel with N items and return the container. */
function renderCarousel(itemCount = 2) {
  return render(
    <InlineCitationCarousel>
      <InlineCitationCarouselHeader>
        <InlineCitationCarouselPrev />
        <InlineCitationCarouselNext />
        <InlineCitationCarouselIndex />
      </InlineCitationCarouselHeader>
      <InlineCitationCarouselContent>
        {Array.from({ length: itemCount }, (_, i) => (
          <InlineCitationCarouselItem key={i}>
            Slide {i + 1}
          </InlineCitationCarouselItem>
        ))}
      </InlineCitationCarouselContent>
    </InlineCitationCarousel>
  );
}

// ---------------------------------------------------------------------------
// InlineCitation
// ---------------------------------------------------------------------------

describe("InlineCitation", () => {
  it("renders children without crashing", () => {
    render(<InlineCitation>hello</InlineCitation>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("root carries data-slot and group class", () => {
    const { container } = render(<InlineCitation>x</InlineCitation>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("data-slot", "inline-citation");
    expect(el.tagName.toLowerCase()).toBe("span");
    expect(el.className).toContain("group");
  });

  it("merges a custom className and forwards props", () => {
    const { container } = render(
      <InlineCitation className="custom" id="cite-1">
        x
      </InlineCitation>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("custom");
    expect(el).toHaveAttribute("id", "cite-1");
  });
});

// ---------------------------------------------------------------------------
// InlineCitationText
// ---------------------------------------------------------------------------

describe("InlineCitationText", () => {
  it("renders with data-slot and hover class", () => {
    const { container } = render(
      <InlineCitationText className="extra">cited</InlineCitationText>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("data-slot", "inline-citation-text");
    expect(screen.getByText("cited")).toBeInTheDocument();
    expect(el.className).toContain("group-hover:bg-accent");
    expect(el.className).toContain("extra");
  });
});

// ---------------------------------------------------------------------------
// InlineCitationCardTrigger (Badge)
// ---------------------------------------------------------------------------

describe("InlineCitationCardTrigger", () => {
  it("renders the hostname of the first source", () => {
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={["https://example.com/a"]} />
      </InlineCitationCard>
    );
    expect(screen.getByText(/example\.com/)).toBeInTheDocument();
  });

  it("appends +N when there are multiple sources", () => {
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={URLS} />
      </InlineCitationCard>
    );
    expect(screen.getByText(/\+1/)).toBeInTheDocument();
  });

  it("does NOT append +N for a single source", () => {
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={["https://example.com/a"]} />
      </InlineCitationCard>
    );
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });

  it("renders 'unknown' when sources is empty", () => {
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={[]} />
      </InlineCitationCard>
    );
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });

  it("carries data-slot and merges className", () => {
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={URLS} className="trigger-extra" />
      </InlineCitationCard>
    );
    const trigger = document.querySelector(
      "[data-slot='inline-citation-card-trigger']"
    ) as HTMLElement;
    expect(trigger).toBeInTheDocument();
    expect(trigger.className).toContain("trigger-extra");
    expect(trigger.className).toContain("rounded-full");
  });
});

// ---------------------------------------------------------------------------
// InlineCitationCard + Body (open on hover)
// ---------------------------------------------------------------------------

describe("InlineCitationCard / Body", () => {
  it("reveals the body content when the trigger is hovered", async () => {
    const user = userEvent.setup();
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={URLS} />
        <InlineCitationCardBody>
          <span>body-content</span>
        </InlineCitationCardBody>
      </InlineCitationCard>
    );

    expect(screen.queryByText("body-content")).not.toBeInTheDocument();

    const trigger = document.querySelector(
      "[data-slot='inline-citation-card-trigger']"
    ) as HTMLElement;
    await user.hover(trigger);

    const body = await screen.findByText("body-content");
    expect(body).toBeInTheDocument();
    const bodyRoot = document.querySelector(
      "[data-slot='inline-citation-card-body']"
    ) as HTMLElement;
    expect(bodyRoot).toBeInTheDocument();
    expect(bodyRoot.className).toContain("w-80");
  });

  it("body merges a custom className", async () => {
    const user = userEvent.setup();
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={URLS} />
        <InlineCitationCardBody className="body-extra">
          <span>peek</span>
        </InlineCitationCardBody>
      </InlineCitationCard>
    );
    await user.hover(
      document.querySelector(
        "[data-slot='inline-citation-card-trigger']"
      ) as HTMLElement
    );
    await screen.findByText("peek");
    const bodyRoot = document.querySelector(
      "[data-slot='inline-citation-card-body']"
    ) as HTMLElement;
    expect(bodyRoot.className).toContain("body-extra");
  });
});

// ---------------------------------------------------------------------------
// Carousel — structure
// ---------------------------------------------------------------------------

describe("InlineCitationCarousel — structure", () => {
  it("renders root, header, content, track and items with data-slots", () => {
    const { container } = renderCarousel(2);
    expect(
      container.querySelector("[data-slot='inline-citation-carousel']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='inline-citation-carousel-header']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='inline-citation-carousel-content']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='inline-citation-carousel-track']")
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(
        "[data-slot='inline-citation-carousel-item']"
      ).length
    ).toBe(2);
  });

  it("root and parts merge custom classNames", () => {
    const { container } = render(
      <InlineCitationCarousel className="root-x">
        <InlineCitationCarouselHeader className="head-x" />
        <InlineCitationCarouselContent className="content-x">
          <InlineCitationCarouselItem className="item-x">
            a
          </InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    expect(
      (
        container.querySelector(
          "[data-slot='inline-citation-carousel']"
        ) as HTMLElement
      ).className
    ).toContain("root-x");
    expect(
      (
        container.querySelector(
          "[data-slot='inline-citation-carousel-header']"
        ) as HTMLElement
      ).className
    ).toContain("head-x");
    expect(
      (
        container.querySelector(
          "[data-slot='inline-citation-carousel-content']"
        ) as HTMLElement
      ).className
    ).toContain("content-x");
    expect(
      (
        container.querySelector(
          "[data-slot='inline-citation-carousel-item']"
        ) as HTMLElement
      ).className
    ).toContain("item-x");
  });
});

// ---------------------------------------------------------------------------
// Carousel — index + navigation
// ---------------------------------------------------------------------------

describe("InlineCitationCarousel — navigation", () => {
  it("shows 1/N initially", () => {
    const { container } = renderCarousel(3);
    const index = container.querySelector(
      "[data-slot='inline-citation-carousel-index']"
    ) as HTMLElement;
    expect(index).toHaveTextContent("1/3");
    expect(index.className).toContain("font-mono");
  });

  it("renders 0/0 when there are no items", () => {
    const { container } = render(
      <InlineCitationCarousel>
        <InlineCitationCarouselIndex />
        <InlineCitationCarouselContent>{null}</InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    expect(
      container.querySelector("[data-slot='inline-citation-carousel-index']")
    ).toHaveTextContent("0/0");
  });

  it("next advances and clamps at the last slide", async () => {
    const user = userEvent.setup();
    const { container } = renderCarousel(2);
    const index = () =>
      container.querySelector(
        "[data-slot='inline-citation-carousel-index']"
      ) as HTMLElement;
    const next = screen.getByRole("button", { name: "Next" });

    expect(index()).toHaveTextContent("1/2");
    await user.click(next);
    expect(index()).toHaveTextContent("2/2");
    // clamp — cannot go past the last slide
    await user.click(next);
    expect(index()).toHaveTextContent("2/2");
  });

  it("prev goes back and clamps at the first slide", async () => {
    const user = userEvent.setup();
    const { container } = renderCarousel(2);
    const index = () =>
      container.querySelector(
        "[data-slot='inline-citation-carousel-index']"
      ) as HTMLElement;
    const prev = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });

    // clamp at the start immediately
    await user.click(prev);
    expect(index()).toHaveTextContent("1/2");

    await user.click(next);
    expect(index()).toHaveTextContent("2/2");
    await user.click(prev);
    expect(index()).toHaveTextContent("1/2");
  });

  it("translates the track by -index * 100%", async () => {
    const user = userEvent.setup();
    const { container } = renderCarousel(2);
    const track = container.querySelector(
      "[data-slot='inline-citation-carousel-track']"
    ) as HTMLElement;
    expect(track.style.transform).toBe("translateX(-0%)");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(track.style.transform).toBe("translateX(-100%)");
  });

  it("renders custom index children instead of the computed label", () => {
    const { container } = render(
      <InlineCitationCarousel>
        <InlineCitationCarouselIndex>custom-label</InlineCitationCarouselIndex>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>a</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    const index = container.querySelector(
      "[data-slot='inline-citation-carousel-index']"
    ) as HTMLElement;
    expect(index).toHaveTextContent("custom-label");
    expect(index).not.toHaveTextContent("1/1");
  });

  it("prev/next buttons carry data-slot, type=button and aria-labels", () => {
    renderCarousel(2);
    const prev = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });
    expect(prev).toHaveAttribute("data-slot", "inline-citation-carousel-prev");
    expect(next).toHaveAttribute("data-slot", "inline-citation-carousel-next");
    expect(prev).toHaveAttribute("type", "button");
    expect(next).toHaveAttribute("type", "button");
  });

  it("prev/next merge custom classNames", () => {
    render(
      <InlineCitationCarousel>
        <InlineCitationCarouselPrev className="prev-x" />
        <InlineCitationCarouselNext className="next-x" />
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>a</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    expect(
      screen.getByRole("button", { name: "Previous" }).className
    ).toContain("prev-x");
    expect(screen.getByRole("button", { name: "Next" }).className).toContain(
      "next-x"
    );
  });

  it("counts a single (non-array) child correctly", () => {
    const { container } = render(
      <InlineCitationCarousel>
        <InlineCitationCarouselIndex />
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>only</InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    );
    expect(
      container.querySelector("[data-slot='inline-citation-carousel-index']")
    ).toHaveTextContent("1/1");
  });
});

// ---------------------------------------------------------------------------
// Context guard
// ---------------------------------------------------------------------------

describe("InlineCitationCarousel — context guard", () => {
  it("throws when a carousel part is used outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<InlineCitationCarouselPrev />)).toThrow(
      /InlineCitationCarousel/
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// InlineCitationSource
// ---------------------------------------------------------------------------

describe("InlineCitationSource", () => {
  it("renders title, url and description", () => {
    const { container } = render(
      <InlineCitationSource
        title="My Title"
        url="https://example.com/page"
        description="A short description."
      />
    );
    expect(screen.getByRole("heading", { name: "My Title" })).toBeInTheDocument();
    expect(screen.getByText("https://example.com/page")).toBeInTheDocument();
    expect(screen.getByText("A short description.")).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='inline-citation-source']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='inline-citation-source-title']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='inline-citation-source-url']")
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        "[data-slot='inline-citation-source-description']"
      )
    ).toBeInTheDocument();
  });

  it("omits each optional field when not provided", () => {
    const { container } = render(<InlineCitationSource />);
    expect(
      container.querySelector("[data-slot='inline-citation-source-title']")
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='inline-citation-source-url']")
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        "[data-slot='inline-citation-source-description']"
      )
    ).not.toBeInTheDocument();
  });

  it("renders children and merges className", () => {
    const { container } = render(
      <InlineCitationSource className="src-x">
        <span>extra-child</span>
      </InlineCitationSource>
    );
    expect(screen.getByText("extra-child")).toBeInTheDocument();
    expect(
      (
        container.querySelector(
          "[data-slot='inline-citation-source']"
        ) as HTMLElement
      ).className
    ).toContain("src-x");
  });

  it("url uses a mono token for data texture", () => {
    const { container } = render(
      <InlineCitationSource url="https://example.com" />
    );
    expect(
      (
        container.querySelector(
          "[data-slot='inline-citation-source-url']"
        ) as HTMLElement
      ).className
    ).toContain("font-mono");
  });
});

// ---------------------------------------------------------------------------
// InlineCitationQuote
// ---------------------------------------------------------------------------

describe("InlineCitationQuote", () => {
  it("renders a blockquote with serif + data-slot", () => {
    const { container } = render(
      <InlineCitationQuote className="q-x">A quoted line.</InlineCitationQuote>
    );
    const quote = container.querySelector(
      "[data-slot='inline-citation-quote']"
    ) as HTMLElement;
    expect(quote.tagName.toLowerCase()).toBe("blockquote");
    expect(screen.getByText("A quoted line.")).toBeInTheDocument();
    expect(quote.className).toContain("font-serif");
    expect(quote.className).toContain("q-x");
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("InlineCitation — accessibility", () => {
  it("has no axe violations for the carousel surface", async () => {
    const { container } = render(
      <main>
        <InlineCitationCarousel>
          <InlineCitationCarouselHeader>
            <InlineCitationCarouselPrev />
            <InlineCitationCarouselNext />
            <InlineCitationCarouselIndex />
          </InlineCitationCarouselHeader>
          <InlineCitationCarouselContent>
            <InlineCitationCarouselItem>
              <InlineCitationSource
                title="Title"
                url="https://example.com"
                description="Desc"
              />
              <InlineCitationQuote>Quote</InlineCitationQuote>
            </InlineCitationCarouselItem>
          </InlineCitationCarouselContent>
        </InlineCitationCarousel>
      </main>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations for the inline trigger surface", async () => {
    const { container } = render(
      <main>
        <p>
          Some grounded text{" "}
          <InlineCitation>
            <InlineCitationText>here</InlineCitationText>
            <InlineCitationCard>
              <InlineCitationCardTrigger sources={URLS} />
            </InlineCitationCard>
          </InlineCitation>
          .
        </p>
      </main>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
