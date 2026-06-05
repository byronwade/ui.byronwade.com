/**
 * Tests for <RelativeTime /> parts (components/ui/relative-time.tsx).
 * Controlled time → no interval, deterministic per-zone formatting; uncontrolled
 * → ticks via setInterval (fake timers); covers label/display/date + onTimeChange.
 */

import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "vitest-axe";

import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDisplay,
  RelativeTimeZoneDate,
  RelativeTimeZoneLabel,
} from "@/components/ui/relative-time";

const FIXED = new Date("2026-06-04T15:30:45Z");

function Clock({ zone = "UTC" }: { zone?: string }) {
  return (
    <RelativeTime time={FIXED}>
      <RelativeTimeZone zone={zone}>
        <RelativeTimeZoneLabel>{zone}</RelativeTimeZoneLabel>
        <RelativeTimeZoneDisplay />
        <RelativeTimeZoneDate />
      </RelativeTimeZone>
    </RelativeTime>
  );
}

describe("RelativeTime — controlled", () => {
  it("renders the root with data-slot", () => {
    const { container } = render(<Clock />);
    expect(container.querySelector('[data-slot="relative-time"]')).not.toBeNull();
  });

  it("formats the fixed time for the zone (UTC, tabular-nums)", () => {
    const { container } = render(<Clock zone="UTC" />);
    const display = container.querySelector('[data-slot="relative-time-zone-display"]');
    expect(display).toHaveClass("tabular-nums");
    // 15:30:45 UTC → 03:30:45 PM
    expect(display).toHaveTextContent(/03:30:45/);
  });

  it("formats the same instant differently per zone", () => {
    const { container: ny } = render(<Clock zone="America/New_York" />);
    const { container: tokyo } = render(<Clock zone="Asia/Tokyo" />);
    const nyText = ny.querySelector('[data-slot="relative-time-zone-display"]')!.textContent;
    const tokyoText = tokyo.querySelector('[data-slot="relative-time-zone-display"]')!.textContent;
    expect(nyText).not.toBe(tokyoText);
  });

  it("renders the date and a mono label", () => {
    const { container } = render(<Clock zone="UTC" />);
    expect(
      container.querySelector('[data-slot="relative-time-zone-date"]'),
    ).toHaveTextContent(/2026/);
    expect(
      container.querySelector('[data-slot="relative-time-zone-label"]'),
    ).toHaveClass("font-mono");
  });

  it("does not start an interval when controlled", () => {
    const spy = vi.spyOn(globalThis, "setInterval");
    render(<Clock />);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("RelativeTime — size", () => {
  const row = (c: HTMLElement) =>
    c.querySelector('[data-slot="relative-time-zone"]');

  function Sized({ size }: { size?: "sm" | "default" | "lg" }) {
    return (
      <RelativeTime time={FIXED} size={size}>
        <RelativeTimeZone zone="UTC">
          <RelativeTimeZoneLabel>UTC</RelativeTimeZoneLabel>
          <RelativeTimeZoneDisplay />
        </RelativeTimeZone>
      </RelativeTime>
    );
  }

  it("keeps the compact text by default", () => {
    const { container } = render(<Sized />);
    expect(row(container)).toHaveClass("text-xs");
    expect(row(container)).toHaveClass("gap-1.5");
  });

  it("tightens density for the sm size", () => {
    const { container } = render(<Sized size="sm" />);
    expect(row(container)).toHaveClass("gap-1");
  });

  it("enlarges the row text for the lg size", () => {
    const { container } = render(<Sized size="lg" />);
    expect(row(container)).toHaveClass("text-sm");
    expect(row(container)).toHaveClass("gap-2");
  });
});

describe("RelativeTime — uncontrolled (ticks)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("ticks every second and reports via onTimeChange", () => {
    const onTimeChange = vi.fn();
    render(
      <RelativeTime defaultTime={FIXED} onTimeChange={onTimeChange}>
        <RelativeTimeZone zone="UTC">
          <RelativeTimeZoneDisplay />
        </RelativeTimeZone>
      </RelativeTime>,
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onTimeChange).toHaveBeenCalled();
    expect(onTimeChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it("clears the interval on unmount", () => {
    const clear = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = render(
      <RelativeTime defaultTime={FIXED}>
        <RelativeTimeZone zone="UTC">
          <RelativeTimeZoneDisplay />
        </RelativeTimeZone>
      </RelativeTime>,
    );
    unmount();
    expect(clear).toHaveBeenCalled();
    clear.mockRestore();
  });
});

describe("RelativeTime — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Clock />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
