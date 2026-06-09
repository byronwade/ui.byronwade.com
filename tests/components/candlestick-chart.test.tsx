/**
 * Tests for <CandlestickChart /> (components/ui/candlestick-chart.tsx). All
 * geometry comes from the pure `candleGeometry` lib over numeric props, never
 * from DOM measurement — jsdom gives SVG no layout. Covers default render,
 * bullish/bearish tone classes, the volume + grid toggles, the optional
 * crosshair toggle, empty data, custom dimensions, and a11y.
 */

import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { CandlestickChart } from "@/components/ui/candlestick-chart";
import type { Candle } from "@/lib/market";

const candle = (over: Partial<Candle>): Candle => ({
  time: 0,
  open: 100,
  high: 110,
  low: 90,
  close: 105,
  volume: 1_000_000,
  ...over,
});

// One clearly bullish (close > open) and one clearly bearish (close < open).
const twoCandles: Candle[] = [
  candle({ time: 1, open: 100, close: 110, high: 112, low: 98 }),
  candle({ time: 2, open: 110, close: 100, high: 112, low: 98 }),
];

describe("CandlestickChart", () => {
  it("renders an svg with the candlestick-chart data-slot and role=img", () => {
    const { container } = render(<CandlestickChart data={twoCandles} />);
    const svg = container.querySelector('[data-slot="candlestick-chart"]');
    expect(svg).not.toBeNull();
    expect(svg!.tagName.toLowerCase()).toBe("svg");
    expect(svg).toHaveAttribute("role", "img");
  });

  it("renders one candle group per data point", () => {
    const { container } = render(<CandlestickChart data={twoCandles} />);
    expect(container.querySelectorAll('[data-slot="candle"]')).toHaveLength(2);
  });

  it("tones a bullish candle with success and a bearish candle with destructive", () => {
    const { container } = render(<CandlestickChart data={twoCandles} />);
    const groups = container.querySelectorAll('[data-slot="candle"]');
    expect(groups[0].getAttribute("class")).toMatch(/(text|fill)-success/);
    expect(groups[1].getAttribute("class")).toMatch(/(text|fill)-destructive/);
  });

  it("renders a volume band by default and hides it when showVolume is false", () => {
    const { container } = render(<CandlestickChart data={twoCandles} />);
    expect(
      container.querySelector('[data-slot="candle-volume"]'),
    ).not.toBeNull();
    const { container: noVol } = render(
      <CandlestickChart data={twoCandles} showVolume={false} />,
    );
    expect(noVol.querySelector('[data-slot="candle-volume"]')).toBeNull();
  });

  it("renders a grid by default and hides it when showGrid is false", () => {
    const { container } = render(<CandlestickChart data={twoCandles} />);
    expect(container.querySelector('[data-slot="candle-grid"]')).not.toBeNull();
    const { container: noGrid } = render(
      <CandlestickChart data={twoCandles} showGrid={false} />,
    );
    expect(noGrid.querySelector('[data-slot="candle-grid"]')).toBeNull();
  });

  it("toggles the crosshair layer behind showCrosshair", () => {
    const { container } = render(<CandlestickChart data={twoCandles} />);
    expect(
      container.querySelector('[data-slot="candle-crosshair"]'),
    ).toBeNull();
    const { container: withCh } = render(
      <CandlestickChart data={twoCandles} showCrosshair />,
    );
    expect(
      withCh.querySelector('[data-slot="candle-crosshair"]'),
    ).not.toBeNull();
  });

  it("renders an interactive readout wrapper when interactive is true", () => {
    const { container } = render(
      <CandlestickChart data={twoCandles} interactive aria-label="AAPL" />,
    );
    expect(
      container.querySelector('[data-slot="candlestick-chart-root"]'),
    ).not.toBeNull();
  });

  it("renders the svg without crashing for empty data", () => {
    const { container } = render(<CandlestickChart data={[]} />);
    const svg = container.querySelector('[data-slot="candlestick-chart"]');
    expect(svg).not.toBeNull();
    expect(container.querySelectorAll('[data-slot="candle"]')).toHaveLength(0);
  });

  it("applies custom width and height to the svg", () => {
    const { container } = render(
      <CandlestickChart data={twoCandles} width={640} height={360} />,
    );
    const svg = container.querySelector('[data-slot="candlestick-chart"]');
    expect(svg).toHaveAttribute("width", "640");
    expect(svg).toHaveAttribute("height", "360");
    expect(svg).toHaveAttribute("viewBox", "0 0 640 360");
  });

  it("uses the provided aria-label and a unique title id", () => {
    const { container } = render(
      <>
        <CandlestickChart data={twoCandles} aria-label="AAPL candles" />
        <CandlestickChart data={twoCandles} aria-label="MSFT candles" />
      </>,
    );
    expect(screen.getByLabelText("AAPL candles")).toBeInTheDocument();
    const ids = Array.from(container.querySelectorAll("title")).map((t) => t.id);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("renders with the seeded default data when none is provided", () => {
    const { container } = render(<CandlestickChart />);
    expect(
      container.querySelector('[data-slot="candlestick-chart"]'),
    ).not.toBeNull();
    expect(
      container.querySelectorAll('[data-slot="candle"]').length,
    ).toBeGreaterThan(0);
  });

  it("uses no raw green/red", () => {
    const { container } = render(<CandlestickChart data={twoCandles} />);
    expect(container.innerHTML).not.toMatch(/green|red/i);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <CandlestickChart data={twoCandles} aria-label="Candlestick chart" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CandlestickChart — interactivity", () => {
  function stubSvgRect(svg: Element) {
    vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 480,
      bottom: 280,
      width: 480,
      height: 280,
      toJSON: () => ({}),
    } as DOMRect);
  }

  it("reports the candle under the pointer when interactive", () => {
    const onCandleHover = vi.fn();
    const { container } = render(
      <CandlestickChart
        data={twoCandles}
        interactive
        onCandleHover={onCandleHover}
      />,
    );
    const svg = container.querySelector("svg")!;
    stubSvgRect(svg);
    fireEvent.pointerMove(svg, { clientX: 10 });
    const [candleArg, indexArg] = onCandleHover.mock.calls.at(-1)!;
    expect(indexArg).toBe(0);
    expect(candleArg).toEqual(twoCandles[0]);
  });

  it("resolves a later candle from a rightward pointer position", () => {
    const onCandleHover = vi.fn();
    const { container } = render(
      <CandlestickChart
        data={twoCandles}
        interactive
        onCandleHover={onCandleHover}
      />,
    );
    const svg = container.querySelector("svg")!;
    stubSvgRect(svg);
    fireEvent.pointerMove(svg, { clientX: 470 });
    const [candleArg, indexArg] = onCandleHover.mock.calls.at(-1)!;
    expect(indexArg).toBe(1);
    expect(candleArg).toEqual(twoCandles[1]);
  });

  it("clears the hovered candle on pointer leave", () => {
    const onCandleHover = vi.fn();
    const { container } = render(
      <CandlestickChart
        data={twoCandles}
        interactive
        onCandleHover={onCandleHover}
      />,
    );
    const svg = container.querySelector("svg")!;
    stubSvgRect(svg);
    fireEvent.pointerMove(svg, { clientX: 10 });
    fireEvent.pointerLeave(svg);
    expect(onCandleHover).toHaveBeenLastCalledWith(null, null);
  });

  it("ignores pointer events when not interactive", () => {
    const onCandleHover = vi.fn();
    const { container } = render(
      <CandlestickChart data={twoCandles} onCandleHover={onCandleHover} />,
    );
    const svg = container.querySelector("svg")!;
    stubSvgRect(svg);
    fireEvent.pointerMove(svg, { clientX: 10 });
    fireEvent.pointerLeave(svg);
    expect(onCandleHover).not.toHaveBeenCalled();
  });

  it("reports no candle when interacting over empty data", () => {
    const onCandleHover = vi.fn();
    const { container } = render(
      <CandlestickChart data={[]} interactive onCandleHover={onCandleHover} />,
    );
    const svg = container.querySelector("svg")!;
    stubSvgRect(svg);
    fireEvent.pointerMove(svg, { clientX: 10 });
    expect(onCandleHover).toHaveBeenLastCalledWith(null, null);
  });

  it("measures its container via ResizeObserver when fill is set", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    class ResizeObserverMock {
      constructor(public cb: () => void) {}
      observe = observe;
      disconnect = disconnect;
    }
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 600,
        bottom: 320,
        width: 600,
        height: 320,
        toJSON: () => ({}),
      } as DOMRect);

    const { container } = render(<CandlestickChart data={twoCandles} fill />);
    expect(
      container.querySelector('[data-slot="candlestick-chart"]'),
    ).not.toBeNull();
    expect(observe).toHaveBeenCalled();

    rectSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
