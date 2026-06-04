import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Calendar } from "@/components/ui/calendar";

const JUNE_2026 = new Date(2026, 5, 15);

function dayButton(label: string) {
  return screen
    .getAllByRole("button")
    .find((b) => b.textContent?.trim() === label) as HTMLElement;
}

describe("Calendar — default render", () => {
  it("renders a month grid", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("shows the month caption", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    expect(screen.getByText(/June 2026/i)).toBeInTheDocument();
  });

  it("renders the days of the month", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    expect(dayButton("15")).toBeInTheDocument();
    expect(dayButton("1")).toBeInTheDocument();
  });

  it("renders previous / next nav buttons", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("has data-slot='calendar'", () => {
    const { container } = render(<Calendar mode="single" />);
    expect(container.querySelector("[data-slot='calendar']")).toBeInTheDocument();
  });
});

describe("Calendar — interaction", () => {
  it("calls onSelect when a day is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={JUNE_2026} onSelect={onSelect} />);
    await user.click(dayButton("15"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("navigates to the next month", async () => {
    const user = userEvent.setup();
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText(/July 2026/i)).toBeInTheDocument();
  });

  it("navigates to the previous month", async () => {
    const user = userEvent.setup();
    render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByText(/May 2026/i)).toBeInTheDocument();
  });
});

describe("Calendar — props", () => {
  it("renders multiple months", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} numberOfMonths={2} />);
    expect(screen.getAllByRole("grid").length).toBe(2);
  });

  it("marks the selected day as selected", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} selected={JUNE_2026} />);
    const btn = dayButton("15");
    const marked =
      btn.getAttribute("data-selected") === "true" ||
      btn.getAttribute("aria-selected") === "true" ||
      btn.closest("[data-selected='true']") != null;
    expect(marked).toBe(true);
  });

  it("merges a custom className", () => {
    const { container } = render(<Calendar mode="single" className="test-cal" />);
    expect(container.querySelector(".test-cal")).toBeInTheDocument();
  });

  it("disables days via the disabled matcher", () => {
    render(<Calendar mode="single" defaultMonth={JUNE_2026} disabled={{ before: JUNE_2026 }} />);
    expect(dayButton("1")).toBeDisabled();
  });
});

describe("Calendar — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Calendar mode="single" defaultMonth={JUNE_2026} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
