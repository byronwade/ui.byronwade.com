import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  VerificationProgress,
  type VerificationStep,
} from "@/components/verification-progress";

const sampleSteps: VerificationStep[] = [
  { tone: "success", label: "Profile", description: "Complete" },
  { tone: "warning", label: "Documents", count: 2 },
  { tone: "neutral", label: "Review" },
];

const tones = ["success", "warning", "danger", "info", "neutral"] as const;

describe("VerificationProgress – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<VerificationProgress steps={sampleSteps} />);
    expect(
      container.querySelector("[data-slot='verification-progress']")
    ).toBeInTheDocument();
  });

  it("renders all step labels", () => {
    render(<VerificationProgress steps={sampleSteps} />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("renders labels and descriptions for every step that has one", () => {
    const steps: VerificationStep[] = [
      { tone: "success", label: "Brand registered", description: "Approved" },
      { tone: "warning", label: "SMS pending", description: "Awaiting review" },
      { tone: "neutral", label: "A2P 10DLC" },
    ];
    render(<VerificationProgress steps={steps} />);
    for (const step of steps) {
      expect(screen.getByText(step.label)).toBeInTheDocument();
      if (step.description) {
        expect(screen.getByText(step.description)).toBeInTheDocument();
      }
    }
  });
});

describe("VerificationProgress – count badge", () => {
  it("renders a count badge (and no dot) when count is set", () => {
    const { container } = render(
      <VerificationProgress steps={[{ tone: "success", label: "Done", count: 7 }]} />
    );
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(container.querySelectorAll(".size-2")).toHaveLength(0);
  });

  it.each([
    [0, "0"],
    [8, "8"],
    [99, "99"],
    [100, "99+"],
    [120, "99+"],
    [1000, "99+"],
  ])("renders count %i as %s (caps over 99)", (count, expected) => {
    render(
      <VerificationProgress steps={[{ tone: "danger", label: "Issues", count }]} />
    );
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("renders a dot (no count badge) when count is undefined", () => {
    const { container } = render(
      <VerificationProgress steps={[{ tone: "neutral", label: "Pending" }]} />
    );
    expect(container.querySelectorAll(".size-2")).toHaveLength(1);
  });
});

describe("VerificationProgress – tones", () => {
  it.each(tones)("renders %s tone without crashing", (tone) => {
    const { container } = render(
      <VerificationProgress steps={[{ tone, label: tone }]} />
    );
    expect(
      container.querySelector("[data-slot='verification-progress']")
    ).toBeInTheDocument();
    expect(screen.getByText(tone)).toBeInTheDocument();
  });

  it("renders every tone together", () => {
    const steps: VerificationStep[] = tones.map((tone) => ({ tone, label: tone }));
    render(<VerificationProgress steps={steps} />);
    for (const tone of tones) {
      expect(screen.getByText(tone)).toBeInTheDocument();
    }
  });
});

describe("VerificationProgress – structure", () => {
  it.each([1, 2, 3, 4, 6])(
    "renders one step circle per step for %i steps",
    (n) => {
      const steps: VerificationStep[] = Array.from({ length: n }, (_, i) => ({
        tone: "neutral",
        label: `Step ${i + 1}`,
      }));
      const { container } = render(<VerificationProgress steps={steps} />);
      // One circle (`size-8`) per step.
      expect(container.querySelectorAll(".size-8")).toHaveLength(n);
      // Each rail between adjacent steps is drawn as two `flex-1` hairline
      // halves, so N steps yield 2×(N−1) connector segments.
      expect(container.querySelectorAll(".bg-border")).toHaveLength(2 * (n - 1));
    }
  );

  it("merges a custom className onto the root while keeping base classes", () => {
    const { container } = render(
      <VerificationProgress className="custom-class" steps={sampleSteps} />
    );
    const root = container.querySelector("[data-slot='verification-progress']");
    expect(root).toHaveClass("custom-class");
    expect(root).toHaveClass("flex");
  });

  it("forwards arbitrary props to the root element", () => {
    render(<VerificationProgress data-testid="vp" steps={sampleSteps} />);
    expect(screen.getByTestId("vp")).toHaveAttribute(
      "data-slot",
      "verification-progress"
    );
  });
});

describe("VerificationProgress – accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<VerificationProgress steps={sampleSteps} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with counts and every tone", async () => {
    const steps: VerificationStep[] = tones.map((tone, i) => ({
      tone,
      label: `${tone} step`,
      count: i + 1,
    }));
    const { container } = render(<VerificationProgress steps={steps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
