/**
 * Exhaustive tests for the CenteredFocal layout component.
 *
 * Component API (from components/centered-focal.tsx):
 *   <CenteredFocal
 *     backdrop?: ReactNode   // optional; rendered as a pointer-events-none,
 *                            //   absolute, centered, opacity-60 overlay
 *     children: ReactNode    // required; rendered in the centered card
 *     className?: string     // optional; merged via cn() onto the outer wrapper
 *   />
 *
 * DOM structure:
 *   <div class="relative grid min-h-[60vh] place-items-center [className]">
 *     {backdrop && (
 *       <div class="pointer-events-none absolute inset-0 grid place-items-center opacity-60">
 *         {backdrop}
 *       </div>
 *     )}
 *     <div class="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center edge">
 *       {children}
 *     </div>
 *   </div>
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CenteredFocal } from "@/components/centered-focal";

// ---------------------------------------------------------------------------
// Helper content nodes
// ---------------------------------------------------------------------------
const SimpleCard = () => (
  <div>
    <h2>Waiting for data</h2>
    <p>Add the script tag to your site to start seeing activity here.</p>
    <button type="button">Copy script tag</button>
  </div>
);

const SimpleBackdrop = () => (
  <div data-testid="backdrop-content" className="size-72 rounded-full bg-brand/10" />
);

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default / minimal usage
// ---------------------------------------------------------------------------
describe("CenteredFocal — renders without crashing", () => {
  it("renders with only the required children prop", () => {
    render(<CenteredFocal><p>Hello</p></CenteredFocal>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders without backdrop without crashing", () => {
    expect(() =>
      render(<CenteredFocal><p>Content</p></CenteredFocal>)
    ).not.toThrow();
  });

  it("renders with backdrop and children without crashing", () => {
    expect(() =>
      render(
        <CenteredFocal backdrop={<SimpleBackdrop />}>
          <p>Content</p>
        </CenteredFocal>
      )
    ).not.toThrow();
  });

  it("renders children text content correctly", () => {
    render(
      <CenteredFocal>
        <h2>Waiting for data</h2>
        <p>Add the script tag to your site to start seeing activity here.</p>
      </CenteredFocal>
    );
    expect(screen.getByRole("heading", { name: "Waiting for data" })).toBeInTheDocument();
    expect(
      screen.getByText("Add the script tag to your site to start seeing activity here.")
    ).toBeInTheDocument();
  });

  it("returns a single root element", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    expect(container.children).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// 2. Outer wrapper — CSS classes
// ---------------------------------------------------------------------------
describe("CenteredFocal — outer wrapper classes", () => {
  it("outer wrapper is a div", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("applies 'relative' class to the outer wrapper", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    expect(container.firstChild).toHaveClass("relative");
  });

  it("applies 'grid' class to the outer wrapper", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    expect(container.firstChild).toHaveClass("grid");
  });

  it("applies 'place-items-center' class to the outer wrapper", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    expect(container.firstChild).toHaveClass("place-items-center");
  });

  it("applies min-h Tailwind class to the outer wrapper", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    // min-h-[60vh] encodes to Tailwind JIT class
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/min-h/);
  });
});

// ---------------------------------------------------------------------------
// 3. Inner card — presence and CSS classes
// ---------------------------------------------------------------------------
describe("CenteredFocal — inner content card", () => {
  it("renders an inner card div that contains children", () => {
    const { container } = render(
      <CenteredFocal><p data-testid="inner">Inner</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).toBeInTheDocument();
    expect(within(innerCard).getByTestId("inner")).toBeInTheDocument();
  });

  it("inner card has 'relative' class", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).toHaveClass("relative");
  });

  it("inner card has 'z-10' class (stacks above backdrop)", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).toHaveClass("z-10");
  });

  it("inner card has 'w-full' class", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).toHaveClass("w-full");
  });

  it("inner card has 'max-w-sm' class", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).toHaveClass("max-w-sm");
  });

  it("inner card has 'rounded-2xl' class", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).toHaveClass("rounded-2xl");
  });

  it("inner card elevates with edge (immersive edge, no hard border)", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).toHaveClass("edge");
    expect(innerCard).not.toHaveClass("border-border");
  });

  it("inner card has 'p-6' class (padding)", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).toHaveClass("p-6");
  });

  it("inner card has 'text-center' class", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).toHaveClass("text-center");
  });

  it("inner card is a div element", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10");
    expect(innerCard?.nodeName).toBe("DIV");
  });
});

// ---------------------------------------------------------------------------
// 4. backdrop prop — present / absent behaviour
// ---------------------------------------------------------------------------
describe("CenteredFocal — backdrop prop", () => {
  it("does NOT render a backdrop overlay div when backdrop is omitted", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const backdrop = container.querySelector(".pointer-events-none");
    expect(backdrop).not.toBeInTheDocument();
  });

  it("does NOT render a backdrop overlay div when backdrop is undefined", () => {
    const { container } = render(
      <CenteredFocal backdrop={undefined}><p>Content</p></CenteredFocal>
    );
    const backdrop = container.querySelector(".pointer-events-none");
    expect(backdrop).not.toBeInTheDocument();
  });

  it("renders the backdrop overlay div when backdrop is provided", () => {
    const { container } = render(
      <CenteredFocal backdrop={<SimpleBackdrop />}><p>Content</p></CenteredFocal>
    );
    const backdrop = container.querySelector(".pointer-events-none");
    expect(backdrop).toBeInTheDocument();
  });

  it("backdrop overlay has 'pointer-events-none' class", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(overlay).toHaveClass("pointer-events-none");
  });

  it("backdrop overlay has 'absolute' class", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(overlay).toHaveClass("absolute");
  });

  it("backdrop overlay has 'inset-0' class", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(overlay).toHaveClass("inset-0");
  });

  it("backdrop overlay has 'grid' class", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(overlay).toHaveClass("grid");
  });

  it("backdrop overlay has 'place-items-center' class", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(overlay).toHaveClass("place-items-center");
  });

  it("backdrop overlay has 'opacity-60' class", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(overlay).toHaveClass("opacity-60");
  });

  it("backdrop overlay is a div element", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none");
    expect(overlay?.nodeName).toBe("DIV");
  });

  it("backdrop content is rendered inside the overlay div", () => {
    const { container } = render(
      <CenteredFocal backdrop={<SimpleBackdrop />}><p>Content</p></CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(within(overlay).getByTestId("backdrop-content")).toBeInTheDocument();
  });

  it("backdrop content is NOT inside the inner card div", () => {
    const { container } = render(
      <CenteredFocal backdrop={<SimpleBackdrop />}><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(within(innerCard).queryByTestId("backdrop-content")).not.toBeInTheDocument();
  });

  it("children are NOT inside the backdrop overlay div", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}>
        <p data-testid="children-node">Children</p>
      </CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(within(overlay).queryByTestId("children-node")).not.toBeInTheDocument();
  });

  it("renders a circle backdrop (default example pattern)", () => {
    render(
      <CenteredFocal backdrop={<div data-testid="circle" className="size-72 rounded-full bg-brand/10" />}>
        <p>Content</p>
      </CenteredFocal>
    );
    expect(screen.getByTestId("circle")).toBeInTheDocument();
  });

  it("renders pulsing rings backdrop (loading-state example pattern)", () => {
    render(
      <CenteredFocal
        backdrop={
          <div data-testid="rings" aria-hidden>
            <div className="animate-ping rounded-full" />
          </div>
        }
      >
        <p>Syncing data…</p>
      </CenteredFocal>
    );
    expect(screen.getByTestId("rings")).toBeInTheDocument();
    expect(screen.getByText("Syncing data…")).toBeInTheDocument();
  });

  it("renders an SVG grid backdrop (with-illustration-backdrop example pattern)", () => {
    render(
      <CenteredFocal
        backdrop={
          <svg data-testid="grid-svg" width="400" height="400" viewBox="0 0 400 400" aria-hidden>
            <rect x="22" y="22" width="8" height="8" rx="2" />
          </svg>
        }
      >
        <p>Connect your data source</p>
      </CenteredFocal>
    );
    expect(screen.getByTestId("grid-svg")).toBeInTheDocument();
  });

  it("renders a bar chart backdrop (custom-classname example pattern)", () => {
    render(
      <CenteredFocal
        className="min-h-[40vh] bg-muted/30"
        backdrop={
          <div data-testid="bar-backdrop" className="flex gap-3 opacity-40">
            {[80, 120, 96, 112, 64].map((h, i) => (
              <div key={i} className="w-8 rounded-full bg-brand/40" style={{ height: h }} />
            ))}
          </div>
        }
      >
        <p>No activity yet</p>
      </CenteredFocal>
    );
    expect(screen.getByTestId("bar-backdrop")).toBeInTheDocument();
  });

  it("renders blur-circle backdrop (with-form example pattern)", () => {
    render(
      <CenteredFocal
        backdrop={<div data-testid="blur-circle" className="size-80 rounded-full bg-brand/8 blur-3xl" />}
      >
        <p>Join the waitlist</p>
      </CenteredFocal>
    );
    expect(screen.getByTestId("blur-circle")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. className prop
// ---------------------------------------------------------------------------
describe("CenteredFocal — className prop", () => {
  it("works without className prop (className is optional)", () => {
    expect(() =>
      render(<CenteredFocal><p>Content</p></CenteredFocal>)
    ).not.toThrow();
  });

  it("applies a custom className to the outer wrapper", () => {
    const { container } = render(
      <CenteredFocal className="my-custom-class"><p>Content</p></CenteredFocal>
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("preserves default classes when a custom className is added", () => {
    const { container } = render(
      <CenteredFocal className="extra-class"><p>Content</p></CenteredFocal>
    );
    expect(container.firstChild).toHaveClass("grid");
    expect(container.firstChild).toHaveClass("relative");
    expect(container.firstChild).toHaveClass("extra-class");
  });

  it("applies min-h override via className (custom-classname example uses min-h-[40vh])", () => {
    const { container } = render(
      <CenteredFocal className="min-h-[40vh]"><p>Content</p></CenteredFocal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("40vh");
  });

  it("applies background color class via className (custom-classname example uses bg-muted/30)", () => {
    const { container } = render(
      <CenteredFocal className="bg-muted/30"><p>Content</p></CenteredFocal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("bg-muted");
  });

  it("handles empty string className without error", () => {
    const { container } = render(
      <CenteredFocal className=""><p>Content</p></CenteredFocal>
    );
    expect(container.firstChild).toHaveClass("grid");
  });

  it("handles multiple space-separated custom classes", () => {
    const { container } = render(
      <CenteredFocal className="p-4 max-w-xl mx-auto"><p>Content</p></CenteredFocal>
    );
    expect(container.firstChild).toHaveClass("p-4");
    expect(container.firstChild).toHaveClass("max-w-xl");
    expect(container.firstChild).toHaveClass("mx-auto");
  });

  it("does NOT apply className to the inner card", () => {
    const { container } = render(
      <CenteredFocal className="custom-outer"><p>Content</p></CenteredFocal>
    );
    const innerCard = container.querySelector(".z-10") as HTMLElement;
    expect(innerCard).not.toHaveClass("custom-outer");
  });

  it("does NOT apply className to the backdrop overlay", () => {
    const { container } = render(
      <CenteredFocal className="custom-outer" backdrop={<div>Backdrop</div>}>
        <p>Content</p>
      </CenteredFocal>
    );
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(overlay).not.toHaveClass("custom-outer");
  });
});

// ---------------------------------------------------------------------------
// 6. children prop — various ReactNode types
// ---------------------------------------------------------------------------
describe("CenteredFocal — children prop", () => {
  it("renders a plain string as children", () => {
    render(<CenteredFocal>Plain text</CenteredFocal>);
    expect(screen.getByText("Plain text")).toBeInTheDocument();
  });

  it("renders a number as children", () => {
    render(<CenteredFocal>{42}</CenteredFocal>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders a JSX heading as children", () => {
    render(
      <CenteredFocal>
        <h2>No messages yet</h2>
      </CenteredFocal>
    );
    expect(screen.getByRole("heading", { name: "No messages yet" })).toBeInTheDocument();
  });

  it("renders a fragment as children", () => {
    render(
      <CenteredFocal>
        <>
          <span>Fragment child 1</span>
          <span>Fragment child 2</span>
        </>
      </CenteredFocal>
    );
    expect(screen.getByText("Fragment child 1")).toBeInTheDocument();
    expect(screen.getByText("Fragment child 2")).toBeInTheDocument();
  });

  it("renders complex nested JSX as children", () => {
    render(
      <CenteredFocal>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <svg width="24" height="24" aria-hidden>
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div>
            <h2>Waiting for data</h2>
            <p>Add the script tag to your site.</p>
          </div>
          <button type="button">Copy script tag</button>
        </div>
      </CenteredFocal>
    );
    expect(screen.getByRole("heading", { name: "Waiting for data" })).toBeInTheDocument();
    expect(screen.getByText("Add the script tag to your site.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy script tag" })).toBeInTheDocument();
  });

  it("renders with deeply nested children without error", () => {
    render(
      <CenteredFocal>
        <div>
          <div>
            <div>
              <span data-testid="deep-node">Deep node</span>
            </div>
          </div>
        </div>
      </CenteredFocal>
    );
    expect(screen.getByTestId("deep-node")).toBeInTheDocument();
  });

  it("renders with a very long text string in children without error", () => {
    const longText = "a".repeat(1000);
    render(<CenteredFocal><p>{longText}</p></CenteredFocal>);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it("renders children that include an image element without error", () => {
    render(
      <CenteredFocal>
        <img src="/test.png" alt="Test image" />
      </CenteredFocal>
    );
    expect(screen.getByRole("img", { name: "Test image" })).toBeInTheDocument();
  });

  it("renders children that include a form without error", () => {
    render(
      <CenteredFocal>
        <form aria-label="Waitlist form">
          <label htmlFor="email-cf">Email address</label>
          <input id="email-cf" type="email" placeholder="you@example.com" />
          <button type="submit">Request access</button>
        </form>
      </CenteredFocal>
    );
    expect(screen.getByRole("textbox", { name: "Email address" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Request access" })).toBeInTheDocument();
  });

  it("renders children with a list without error", () => {
    render(
      <CenteredFocal>
        <ul>
          <li>Step 1</li>
          <li>Step 2</li>
        </ul>
      </CenteredFocal>
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// 7. DOM structure invariants
// ---------------------------------------------------------------------------
describe("CenteredFocal — DOM structure invariants", () => {
  it("without backdrop: outer wrapper has exactly ONE child (the inner card)", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children).toHaveLength(1);
  });

  it("with backdrop: outer wrapper has exactly TWO children (backdrop overlay + inner card)", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children).toHaveLength(2);
  });

  it("with backdrop: first child is the backdrop overlay", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children[0]).toHaveClass("pointer-events-none");
  });

  it("with backdrop: second child is the inner card (z-10)", () => {
    const { container } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children[1]).toHaveClass("z-10");
  });

  it("without backdrop: the only child is the inner card (z-10)", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children[0]).toHaveClass("z-10");
  });

  it("outer wrapper does not have a role attribute by default", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("role")).toBeNull();
  });

  it("outer wrapper does not have an id attribute by default", () => {
    const { container } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.id).toBe("");
  });
});

// ---------------------------------------------------------------------------
// 8. Interactions — interactive content inside the card
// ---------------------------------------------------------------------------
describe("CenteredFocal — interactions inside the card", () => {
  it("button inside children is clickable", async () => {
    const handleClick = vi.fn();
    render(
      <CenteredFocal>
        <button type="button" onClick={handleClick}>Click me</button>
      </CenteredFocal>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("multiple button clicks fire the handler multiple times", async () => {
    const handleClick = vi.fn();
    render(
      <CenteredFocal>
        <button type="button" onClick={handleClick}>Action</button>
      </CenteredFocal>
    );
    const user = userEvent.setup();
    const btn = screen.getByRole("button", { name: "Action" });
    await user.click(btn);
    await user.click(btn);
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it("text input inside children is typeable", async () => {
    render(
      <CenteredFocal>
        <label htmlFor="cf-input">Search</label>
        <input id="cf-input" type="text" />
      </CenteredFocal>
    );
    const user = userEvent.setup();
    const input = screen.getByRole("textbox", { name: "Search" });
    await user.type(input, "hello world");
    expect(input).toHaveValue("hello world");
  });

  it("form submission works with children form (with-form example)", async () => {
    function WaitlistForm() {
      const [submitted, setSubmitted] = React.useState(false);
      const [value, setValue] = React.useState("");

      function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (value.trim()) setSubmitted(true);
      }

      return (
        <CenteredFocal backdrop={<div className="size-80 rounded-full" />}>
          {submitted ? (
            <div>
              <p>You&apos;re on the list!</p>
              <p data-testid="submitted-email">We&apos;ll reach out to <strong>{value}</strong>.</p>
              <button type="button" onClick={() => { setValue(""); setSubmitted(false); }}>
                Join with another address
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2>Join the waitlist</h2>
              <label htmlFor="cf-email">Email address</label>
              <input
                id="cf-email"
                type="email"
                placeholder="you@example.com"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <button type="submit">Request access</button>
            </form>
          )}
        </CenteredFocal>
      );
    }

    // import React inside test
    const React = await import("react");
    render(<WaitlistForm />);

    const user = userEvent.setup();
    const emailInput = screen.getByRole("textbox", { name: "Email address" });
    await user.type(emailInput, "test@example.com");
    await user.click(screen.getByRole("button", { name: "Request access" }));

    expect(await screen.findByText("You're on the list!")).toBeInTheDocument();
    expect(screen.getByTestId("submitted-email")).toHaveTextContent("test@example.com");
  });

  it("'Join with another address' button resets form (with-form example)", async () => {
    function WaitlistForm() {
      const [submitted, setSubmitted] = React.useState(false);
      const [value, setValue] = React.useState("");

      function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (value.trim()) setSubmitted(true);
      }

      return (
        <CenteredFocal>
          {submitted ? (
            <div>
              <p>You&apos;re on the list!</p>
              <button type="button" onClick={() => { setValue(""); setSubmitted(false); }}>
                Join with another address
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="cf-email2">Email address</label>
              <input
                id="cf-email2"
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <button type="submit">Request access</button>
            </form>
          )}
        </CenteredFocal>
      );
    }

    const React = await import("react");
    render(<WaitlistForm />);
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox", { name: "Email address" }), "a@b.com");
    await user.click(screen.getByRole("button", { name: "Request access" }));
    expect(await screen.findByText("You're on the list!")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Join with another address" }));
    expect(screen.getByRole("textbox", { name: "Email address" })).toBeInTheDocument();
    expect(screen.queryByText("You're on the list!")).not.toBeInTheDocument();
  });

  it("checkbox inside children can be checked/unchecked", async () => {
    render(
      <CenteredFocal>
        <label>
          <input type="checkbox" name="agree" />
          I agree
        </label>
      </CenteredFocal>
    );
    const user = userEvent.setup();
    const checkbox = screen.getByRole("checkbox", { name: "I agree" });
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});

// ---------------------------------------------------------------------------
// 9. Re-render / update behavior
// ---------------------------------------------------------------------------
describe("CenteredFocal — re-render and update behavior", () => {
  it("updates children when prop changes", () => {
    const { rerender } = render(
      <CenteredFocal><p>Initial content</p></CenteredFocal>
    );
    expect(screen.getByText("Initial content")).toBeInTheDocument();

    rerender(<CenteredFocal><p>Updated content</p></CenteredFocal>);
    expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
    expect(screen.getByText("Updated content")).toBeInTheDocument();
  });

  it("adds backdrop when backdrop prop is added on rerender", () => {
    const { container, rerender } = render(
      <CenteredFocal><p>Content</p></CenteredFocal>
    );
    expect(container.querySelector(".pointer-events-none")).not.toBeInTheDocument();

    rerender(
      <CenteredFocal backdrop={<div data-testid="new-backdrop">Backdrop</div>}>
        <p>Content</p>
      </CenteredFocal>
    );
    expect(container.querySelector(".pointer-events-none")).toBeInTheDocument();
    expect(screen.getByTestId("new-backdrop")).toBeInTheDocument();
  });

  it("removes backdrop when backdrop prop is removed on rerender", () => {
    const { container, rerender } = render(
      <CenteredFocal backdrop={<div>Backdrop</div>}><p>Content</p></CenteredFocal>
    );
    expect(container.querySelector(".pointer-events-none")).toBeInTheDocument();

    rerender(<CenteredFocal><p>Content</p></CenteredFocal>);
    expect(container.querySelector(".pointer-events-none")).not.toBeInTheDocument();
  });

  it("updates className when prop changes", () => {
    const { container, rerender } = render(
      <CenteredFocal className="class-a"><p>Content</p></CenteredFocal>
    );
    expect(container.firstChild).toHaveClass("class-a");

    rerender(<CenteredFocal className="class-b"><p>Content</p></CenteredFocal>);
    expect(container.firstChild).toHaveClass("class-b");
    expect(container.firstChild).not.toHaveClass("class-a");
  });

  it("preserves children across re-renders where only className changes", () => {
    const { rerender } = render(
      <CenteredFocal className="class-a"><p>Persistent content</p></CenteredFocal>
    );
    rerender(<CenteredFocal className="class-b"><p>Persistent content</p></CenteredFocal>);
    expect(screen.getByText("Persistent content")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 10. Multiple instances
// ---------------------------------------------------------------------------
describe("CenteredFocal — multiple instances", () => {
  it("renders multiple independent instances without content bleed", () => {
    render(
      <div>
        <CenteredFocal><p>Card A</p></CenteredFocal>
        <CenteredFocal><p>Card B</p></CenteredFocal>
      </div>
    );
    expect(screen.getByText("Card A")).toBeInTheDocument();
    expect(screen.getByText("Card B")).toBeInTheDocument();
  });

  it("each instance's backdrop is independent", () => {
    const { container } = render(
      <div>
        <CenteredFocal backdrop={<div data-testid="backdrop-a">Backdrop A</div>}>
          <p>A</p>
        </CenteredFocal>
        <CenteredFocal>
          <p>B</p>
        </CenteredFocal>
      </div>
    );
    const overlays = container.querySelectorAll(".pointer-events-none");
    expect(overlays).toHaveLength(1);
    expect(screen.getByTestId("backdrop-a")).toBeInTheDocument();
  });

  it("children content is NOT shared between instances", () => {
    const { container } = render(
      <div>
        <CenteredFocal className="instance-a"><p>Unique to A</p></CenteredFocal>
        <CenteredFocal className="instance-b"><p>Unique to B</p></CenteredFocal>
      </div>
    );
    const instanceA = container.querySelector(".instance-a") as HTMLElement;
    const instanceB = container.querySelector(".instance-b") as HTMLElement;
    expect(within(instanceA).getByText("Unique to A")).toBeInTheDocument();
    expect(within(instanceA).queryByText("Unique to B")).not.toBeInTheDocument();
    expect(within(instanceB).getByText("Unique to B")).toBeInTheDocument();
    expect(within(instanceB).queryByText("Unique to A")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Example usage scenarios (mirrors content/examples/centered-focal/)
// ---------------------------------------------------------------------------
describe("CenteredFocal — example usage scenarios", () => {
  it("default example: renders waiting-for-data card with backdrop circle and CTA button", () => {
    render(
      <CenteredFocal backdrop={<div className="size-72 rounded-full bg-brand/10" />}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div>
            <h2>Waiting for data</h2>
            <p>Add the script tag to your site to start seeing activity here.</p>
          </div>
          <button type="button">Copy script tag</button>
        </div>
      </CenteredFocal>
    );
    expect(screen.getByRole("heading", { name: "Waiting for data" })).toBeInTheDocument();
    expect(screen.getByText("Add the script tag to your site to start seeing activity here.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy script tag" })).toBeInTheDocument();
  });

  it("no-backdrop example: renders without backdrop and shows 'No messages yet'", () => {
    const { container } = render(
      <CenteredFocal>
        <div className="flex flex-col items-center gap-4">
          <h2>No messages yet</h2>
          <p>Your inbox is empty. New messages will appear here.</p>
          <button type="button">Compose message</button>
        </div>
      </CenteredFocal>
    );
    expect(screen.getByRole("heading", { name: "No messages yet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compose message" })).toBeInTheDocument();
    expect(container.querySelector(".pointer-events-none")).not.toBeInTheDocument();
  });

  it("loading-state example: renders syncing indicator with pulsing rings backdrop", () => {
    render(
      <CenteredFocal
        backdrop={
          <div data-testid="pulsing-rings" aria-hidden>
            <div className="absolute size-48 animate-ping rounded-full bg-brand/10" />
          </div>
        }
      >
        <div className="flex flex-col items-center gap-3">
          <svg
            data-testid="spinner"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-spin text-muted-foreground"
            aria-hidden
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <div>
            <p>Syncing data…</p>
            <p>This may take a few seconds.</p>
          </div>
        </div>
      </CenteredFocal>
    );
    expect(screen.getByText("Syncing data…")).toBeInTheDocument();
    expect(screen.getByText("This may take a few seconds.")).toBeInTheDocument();
    expect(screen.getByTestId("pulsing-rings")).toBeInTheDocument();
  });

  it("custom-classname example: applies min-h and bg-muted override, renders 'No activity yet'", () => {
    const { container } = render(
      <CenteredFocal
        className="min-h-[40vh] bg-muted/30"
        backdrop={
          <div className="flex gap-3 opacity-40">
            {[80, 120, 96, 112, 64].map((h, i) => (
              <div key={i} className="w-8 rounded-full bg-brand/40" style={{ height: h }} />
            ))}
          </div>
        }
      >
        <div className="flex flex-col items-center gap-4">
          <h2>No activity yet</h2>
          <p>Charts will appear once your integration starts sending events.</p>
          <button type="button">View setup guide</button>
        </div>
      </CenteredFocal>
    );
    expect(screen.getByRole("heading", { name: "No activity yet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View setup guide" })).toBeInTheDocument();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("40vh");
    expect(wrapper.className).toContain("bg-muted");
  });

  it("with-illustration-backdrop example: renders 'Connect your data source'", () => {
    render(
      <CenteredFocal
        backdrop={
          <svg width="400" height="400" viewBox="0 0 400 400" aria-hidden data-testid="grid-backdrop">
            <rect x="22" y="22" width="8" height="8" rx="2" />
          </svg>
        }
      >
        <div className="flex flex-col items-center gap-4">
          <h2>Connect your data source</h2>
          <p>Choose a source to start streaming events into your workspace.</p>
          <div className="flex gap-2">
            <button type="button">Get started</button>
            <button type="button">View docs</button>
          </div>
        </div>
      </CenteredFocal>
    );
    expect(screen.getByRole("heading", { name: "Connect your data source" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View docs" })).toBeInTheDocument();
    expect(screen.getByTestId("grid-backdrop")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 12. Edge cases
// ---------------------------------------------------------------------------
describe("CenteredFocal — edge cases", () => {
  it("handles backdrop={null} gracefully (no overlay rendered)", () => {
    const { container } = render(
      <CenteredFocal backdrop={null}><p>Content</p></CenteredFocal>
    );
    expect(container.querySelector(".pointer-events-none")).not.toBeInTheDocument();
  });

  it("handles backdrop={false} gracefully (no overlay rendered)", () => {
    const { container } = render(
      // @ts-expect-error testing runtime falsy value
      <CenteredFocal backdrop={false}><p>Content</p></CenteredFocal>
    );
    expect(container.querySelector(".pointer-events-none")).not.toBeInTheDocument();
  });

  it("renders with an empty fragment as children without error", () => {
    expect(() =>
      render(<CenteredFocal><></></CenteredFocal>)
    ).not.toThrow();
  });

  it("renders with an aria-live region inside children", () => {
    render(
      <CenteredFocal>
        <div aria-live="polite" aria-label="Status">Loading…</div>
      </CenteredFocal>
    );
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("backdrop content with aria-hidden is not reachable via accessible role queries", () => {
    // jsdom's queryByText finds nodes regardless of aria-hidden (DOM-level search);
    // we assert the semantic boundary: the aria-hidden content is inside the
    // pointer-events-none overlay, NOT inside the inner card.
    const { container } = render(
      <CenteredFocal backdrop={<div aria-hidden>Hidden backdrop text</div>}>
        <p>Visible content</p>
      </CenteredFocal>
    );
    const card = container.querySelector(".z-10") as HTMLElement;
    // backdrop text must not bleed into the inner card
    expect(within(card).queryByText("Hidden backdrop text")).not.toBeInTheDocument();
    // visible content is present
    expect(screen.getByText("Visible content")).toBeInTheDocument();
    // aria-hidden is actually set on the backdrop node
    const overlay = container.querySelector(".pointer-events-none") as HTMLElement;
    expect(overlay.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("children are always rendered inside the centered card regardless of backdrop presence", () => {
    const scenarios = [
      { backdrop: undefined },
      { backdrop: <div>Backdrop</div> },
    ] as Array<{ backdrop: React.ReactNode }>;

    for (const { backdrop } of scenarios) {
      const { container, unmount } = render(
        <CenteredFocal backdrop={backdrop}>
          <p data-testid="inner-content">Inner</p>
        </CenteredFocal>
      );
      const card = container.querySelector(".z-10") as HTMLElement;
      expect(within(card).getByTestId("inner-content")).toBeInTheDocument();
      unmount();
    }
  });
});

// ---------------------------------------------------------------------------
// 13. Accessibility (axe)
// ---------------------------------------------------------------------------
describe("CenteredFocal — accessibility (axe)", () => {
  it("has no axe violations with minimal children", async () => {
    const { container } = render(
      <CenteredFocal>
        <p>Simple content</p>
      </CenteredFocal>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations without backdrop (no-backdrop example)", async () => {
    const { container } = render(
      <main>
        <CenteredFocal>
          <h2>No messages yet</h2>
          <p>Your inbox is empty. New messages will appear here.</p>
          <button type="button">Compose message</button>
        </CenteredFocal>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with backdrop and heading/button children", async () => {
    const { container } = render(
      <main>
        <CenteredFocal
          backdrop={
            <div className="size-72 rounded-full bg-brand/10" aria-hidden />
          }
        >
          <h2>Waiting for data</h2>
          <p>Add the script tag to your site to start seeing activity here.</p>
          <button type="button">Copy script tag</button>
        </CenteredFocal>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with a form inside children (with-form example)", async () => {
    const { container } = render(
      <main>
        <CenteredFocal>
          <form aria-label="Waitlist signup">
            <h2>Join the waitlist</h2>
            <p>Be the first to know when early access opens.</p>
            <label htmlFor="axe-email">Email address</label>
            <input id="axe-email" type="email" placeholder="you@example.com" />
            <button type="submit">Request access</button>
          </form>
        </CenteredFocal>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with loading state (spinner + pulsing backdrop)", async () => {
    const { container } = render(
      <main>
        <CenteredFocal
          backdrop={
            <div aria-hidden>
              <div className="absolute size-48 animate-ping rounded-full" />
            </div>
          }
        >
          <div aria-live="polite">
            <p>Syncing data…</p>
            <p>This may take a few seconds.</p>
          </div>
        </CenteredFocal>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with custom className applied", async () => {
    const { container } = render(
      <main>
        <CenteredFocal className="min-h-[40vh] bg-muted/30">
          <h2>No activity yet</h2>
          <p>Charts will appear once your integration starts sending events.</p>
          <button type="button">View setup guide</button>
        </CenteredFocal>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when backdrop has aria-hidden and card has semantic heading", async () => {
    const { container } = render(
      <main>
        <CenteredFocal
          backdrop={
            <svg width="400" height="400" viewBox="0 0 400 400" aria-hidden>
              <rect x="22" y="22" width="8" height="8" rx="2" />
            </svg>
          }
        >
          <h2>Connect your data source</h2>
          <p>Choose a source to start streaming events into your workspace.</p>
          <button type="button">Get started</button>
        </CenteredFocal>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when children include an accessible button list", async () => {
    const { container } = render(
      <main>
        <CenteredFocal>
          <div>
            <h2>Connect your data source</h2>
            <div role="group" aria-label="Source options">
              <button type="button">Get started</button>
              <button type="button">View docs</button>
            </div>
          </div>
        </CenteredFocal>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
