/**
 * Tests for <CreditCard /> parts (components/ui/credit-card.tsx). A flippable
 * card; flip is hover-driven where supported, tap-driven otherwise (matchMedia).
 * Covers parts/data-slots, token surfaces (no raw white/gray), the tap flip,
 * the payment icon, and a11y.
 */

import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe } from "vitest-axe";

import {
  CreditCard,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardBack,
  CreditCardChip,
  CreditCardName,
  CreditCardNumber,
  CreditCardExpiry,
  CreditCardCvv,
  CreditCardServiceProvider,
  CreditCardMagStripe,
  CreditCardLogo,
} from "@/components/ui/credit-card";

let hoverChangeHandler: ((e: { matches: boolean }) => void) | null = null;

function mockHover(supports: boolean) {
  hoverChangeHandler = null;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("hover: hover") ? supports : false,
    media: query,
    addEventListener: vi.fn((_: string, cb: (e: { matches: boolean }) => void) => {
      hoverChangeHandler = cb;
    }),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  }));
}

function FullCard() {
  return (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront>
          <CreditCardChip />
          <CreditCardName>Byron Wade</CreditCardName>
          <CreditCardNumber>4242 4242 4242 4242</CreditCardNumber>
          <CreditCardServiceProvider type="Visa" />
        </CreditCardFront>
        <CreditCardBack>
          <CreditCardMagStripe />
          <CreditCardCvv>123</CreditCardCvv>
          <CreditCardExpiry>12 / 28</CreditCardExpiry>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  );
}

describe("CreditCard — structure", () => {
  beforeEach(() => mockHover(true));

  it("renders all the card parts with data-slots", () => {
    const { container } = render(<FullCard />);
    for (const slot of [
      "credit-card",
      "credit-card-front",
      "credit-card-back",
      "credit-card-chip",
      "credit-card-name",
      "credit-card-number",
      "credit-card-expiry",
      "credit-card-cvv",
      "credit-card-mag-stripe",
    ]) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
  });

  it("card body uses tokens (bg-foreground/90, text-background) — no raw white/gray", () => {
    const { container } = render(<FullCard />);
    expect(container.querySelector('[data-slot="credit-card"]')).toHaveClass("text-background");
    expect(container.querySelector('[data-slot="credit-card-front"]')).toHaveClass("bg-foreground/90");
    expect(container.querySelector('[data-slot="credit-card-mag-stripe"]')).toHaveClass("bg-foreground");
    // No raw white text / gray stripe leaked.
    expect(container.innerHTML).not.toMatch(/text-white|bg-gray-900/);
  });

  it("name is editorial-weight uppercase", () => {
    const { container } = render(<FullCard />);
    const name = container.querySelector('[data-slot="credit-card-name"]');
    expect(name).toHaveClass("font-medium");
    expect(name).toHaveClass("uppercase");
  });

  it("renders the default Visa payment icon", () => {
    const { container } = render(<FullCard />);
    expect(container.querySelector('[data-slot="credit-card-service-provider"]')).not.toBeNull();
  });

  it("renders a custom service-provider child", () => {
    const { container } = render(
      <CreditCard>
        <CreditCardServiceProvider>
          <span data-testid="custom-logo">logo</span>
        </CreditCardServiceProvider>
      </CreditCard>,
    );
    expect(screen.getByTestId("custom-logo")).toBeInTheDocument();
  });

  it("renders a custom chip child + the logo slot", () => {
    const { container } = render(
      <CreditCard>
        <CreditCardChip>
          <span>chip</span>
        </CreditCardChip>
        <CreditCardLogo />
      </CreditCard>,
    );
    expect(container.querySelector('[data-slot="credit-card-chip"]')).toHaveTextContent("chip");
    expect(container.querySelector('[data-slot="credit-card-logo"]')).not.toBeNull();
  });
});

describe("CreditCard — flip", () => {
  it("hover-capable devices flip via CSS (no tap state)", () => {
    mockHover(true);
    render(<FullCard />);
    const flipper = screen.getByRole("button", { name: "Flip credit card" });
    expect(flipper.className).toContain("group-hover/credit-card:-rotate-y-180");
    fireEvent.click(flipper);
    // Click does nothing on hover devices — no tap rotate class.
    expect(flipper.className).not.toContain("-rotate-y-180 shadow-lg");
  });

  it("non-hover devices toggle the flip on tap", () => {
    mockHover(false);
    render(<FullCard />);
    const flipper = screen.getByRole("button", { name: "Flip credit card" });
    expect(flipper.className).not.toContain("-rotate-y-180");
    fireEvent.click(flipper);
    expect(flipper.className).toContain("-rotate-y-180");
    fireEvent.click(flipper);
    expect(flipper.className).not.toContain("-rotate-y-180");
  });

  it("reacts to a hover-capability change (matchMedia listener)", () => {
    mockHover(false);
    render(<FullCard />);
    const flipper = screen.getByRole("button", { name: "Flip credit card" });
    expect(typeof hoverChangeHandler).toBe("function");
    // Capability flips to hover-supported → CSS hover takes over.
    act(() => hoverChangeHandler?.({ matches: true }));
    expect(flipper.className).toContain("group-hover/credit-card:-rotate-y-180");
  });
});

describe("CreditCard — a11y", () => {
  beforeEach(() => mockHover(true));
  it("has no axe violations", async () => {
    const { container } = render(<FullCard />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
