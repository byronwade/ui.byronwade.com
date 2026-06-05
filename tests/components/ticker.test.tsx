/**
 * Tests for <Ticker /> parts (components/ui/ticker.tsx). Covers symbol/price
 * formatting via the currency context, the tokenized up/down change, the icon
 * (avatar + asChild), unique title ids, and a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import {
  Ticker,
  TickerIcon,
  TickerSymbol,
  TickerPrice,
  TickerPriceChange,
} from "@/components/ui/ticker";

describe("Ticker", () => {
  it("renders a button row with the symbol uppercased", () => {
    render(
      <Ticker>
        <TickerSymbol symbol="aapl" />
      </Ticker>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-slot", "ticker");
    expect(screen.getByText("AAPL")).toBeInTheDocument();
  });

  it("sizes the icon from the default size", () => {
    const { container } = render(
      <Ticker>
        <TickerIcon symbol="AA" />
      </Ticker>,
    );
    expect(container.querySelector('[data-slot="ticker-icon"]')).toHaveClass("size-7");
  });

  it("sizes the icon down for the sm size", () => {
    const { container } = render(
      <Ticker size="sm">
        <TickerIcon symbol="AA" />
        <TickerSymbol symbol="aa" />
        <TickerPrice price={1} />
      </Ticker>,
    );
    expect(container.querySelector('[data-slot="ticker-icon"]')).toHaveClass("size-6");
  });

  it("sizes the icon up for the lg size", () => {
    const { container } = render(
      <Ticker size="lg">
        <TickerIcon symbol="AA" />
        <TickerSymbol symbol="aa" />
        <TickerPrice price={1} />
      </Ticker>,
    );
    expect(container.querySelector('[data-slot="ticker-icon"]')).toHaveClass("size-8");
  });

  it("formats price with the default USD currency", () => {
    render(
      <Ticker>
        <TickerPrice price={229.35} />
      </Ticker>,
    );
    expect(screen.getByText("$229.35")).toBeInTheDocument();
  });

  it("formats price with a custom currency", () => {
    render(
      <Ticker currency="EUR" locale="en-US">
        <TickerPrice price={10} />
      </Ticker>,
    );
    expect(screen.getByText("€10.00")).toBeInTheDocument();
  });

  it("falls back to USD when given an invalid currency", () => {
    render(
      <Ticker currency="NOTACURRENCY">
        <TickerPrice price={5} />
      </Ticker>,
    );
    expect(screen.getByText("$5.00")).toBeInTheDocument();
  });

  it("renders the icon avatar with a 2-letter fallback", () => {
    const { container } = render(
      <Ticker>
        <TickerIcon symbol="AAPL" />
      </Ticker>,
    );
    expect(container.querySelector('[data-slot="ticker-icon"]')).not.toBeNull();
    expect(screen.getByText("AA")).toBeInTheDocument();
  });

  it("renders an asChild icon wrapper", () => {
    const { container } = render(
      <Ticker>
        <TickerIcon asChild>
          <span>logo</span>
        </TickerIcon>
      </Ticker>,
    );
    const icon = container.querySelector('[data-slot="ticker-icon"]');
    expect(icon).toHaveClass("rounded-full");
    expect(icon).toHaveTextContent("logo");
  });
});

describe("Ticker — price change tones", () => {
  it("positive change uses the success token + percent format", () => {
    const { container } = render(
      <Ticker>
        <TickerPriceChange change={1.82} isPercent />
      </Ticker>,
    );
    const el = container.querySelector('[data-slot="ticker-price-change"]');
    expect(el).toHaveClass("text-success");
    expect(el).toHaveTextContent("1.82%");
    expect(el!.querySelector("svg")).not.toHaveClass("rotate-180");
  });

  it("negative change uses destructive + rotated icon", () => {
    const { container } = render(
      <Ticker>
        <TickerPriceChange change={-2.14} isPercent />
      </Ticker>,
    );
    const el = container.querySelector('[data-slot="ticker-price-change"]');
    expect(el).toHaveClass("text-destructive");
    expect(el!.querySelector("svg")).toHaveClass("rotate-180");
  });

  it("non-percent change is currency-formatted", () => {
    render(
      <Ticker>
        <TickerPriceChange change={3.5} />
      </Ticker>,
    );
    expect(screen.getByText("$3.50")).toBeInTheDocument();
  });

  it("gives each change icon a unique title id", () => {
    const { container } = render(
      <Ticker>
        <TickerPriceChange change={1} isPercent />
        <TickerPriceChange change={-1} isPercent />
      </Ticker>,
    );
    const ids = Array.from(container.querySelectorAll("title")).map((t) => t.id);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("uses no raw green/red", () => {
    const { container } = render(
      <Ticker>
        <TickerPriceChange change={1} />
        <TickerPriceChange change={-1} />
      </Ticker>,
    );
    expect(container.innerHTML).not.toMatch(/green|red/i);
  });
});

describe("Ticker — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Ticker>
        <TickerIcon symbol="AAPL" />
        <TickerSymbol symbol="AAPL" />
        <TickerPrice price={229.35} />
        <TickerPriceChange change={1.82} isPercent />
      </Ticker>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
