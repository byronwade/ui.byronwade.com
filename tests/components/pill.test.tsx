/**
 * Tests for <Pill /> parts (components/ui/pill.tsx). Covers the rounded pill,
 * avatar/button/status parts, the tokenized indicator tones + pulse, delta
 * direction, icon, avatar group, className merge, and a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Star } from "lucide-react";

import {
  Pill,
  PillAvatar,
  PillButton,
  PillStatus,
  PillIndicator,
  PillDelta,
  PillIcon,
  PillAvatarGroup,
} from "@/components/ui/pill";

describe("Pill — base", () => {
  it("renders a rounded pill with data-slot and children", () => {
    const { container } = render(<Pill>Label</Pill>);
    const pill = container.querySelector('[data-slot="pill"]');
    expect(pill).not.toBeNull();
    expect(pill).toHaveClass("rounded-full");
    expect(pill).toHaveTextContent("Label");
  });

  it("merges custom className", () => {
    const { container } = render(<Pill className="extra">x</Pill>);
    expect(container.querySelector('[data-slot="pill"]')).toHaveClass("extra");
  });
});

describe("Pill — indicator tones (tokenized)", () => {
  it.each([
    ["success", "bg-success"],
    ["error", "bg-destructive"],
    ["warning", "bg-warning"],
    ["info", "bg-brand"],
  ] as const)("tone %s uses %s", (variant, token) => {
    const { container } = render(<PillIndicator variant={variant} />);
    expect(container.querySelector('[data-slot="pill-indicator"]')!.innerHTML).toContain(token);
  });

  it("defaults to success", () => {
    const { container } = render(<PillIndicator />);
    expect(container.querySelector('[data-slot="pill-indicator"]')!.innerHTML).toContain("bg-success");
  });

  it("renders a ping layer only when pulse is set", () => {
    const { container: pulsed } = render(<PillIndicator variant="info" pulse />);
    expect(pulsed.querySelector(".animate-ping")).not.toBeNull();
    const { container: still } = render(<PillIndicator variant="info" />);
    expect(still.querySelector(".animate-ping")).toBeNull();
  });
});

describe("Pill — delta direction", () => {
  it("shows a neutral minus at zero", () => {
    const { container } = render(<PillDelta delta={0} />);
    const el = container.querySelector('[data-slot="pill-delta"]');
    expect(el).toHaveClass("text-muted-foreground");
  });
  it("shows success up for positive", () => {
    const { container } = render(<PillDelta delta={3} />);
    expect(container.querySelector('[data-slot="pill-delta"]')).toHaveClass("text-success");
  });
  it("shows destructive down for negative", () => {
    const { container } = render(<PillDelta delta={-3} />);
    expect(container.querySelector('[data-slot="pill-delta"]')).toHaveClass("text-destructive");
  });
});

describe("Pill — other parts", () => {
  it("renders an avatar with fallback", () => {
    const { container } = render(<PillAvatar fallback="BW" src="/a.png" alt="" />);
    expect(container.querySelector('[data-slot="pill-avatar"]')).not.toBeNull();
  });

  it("renders an icon-only ghost button", () => {
    render(<PillButton aria-label="Remove" />);
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("renders a status group", () => {
    const { container } = render(<PillStatus>Live</PillStatus>);
    const s = container.querySelector('[data-slot="pill-status"]');
    expect(s).toHaveTextContent("Live");
    expect(s).toHaveClass("border-r");
  });

  it("renders a muted icon via PillIcon", () => {
    const { container } = render(<PillIcon icon={Star} />);
    expect(container.querySelector('[data-slot="pill-icon"]')).toHaveClass("text-muted-foreground");
  });

  it("renders an avatar group", () => {
    const { container } = render(
      <PillAvatarGroup>
        <PillAvatar fallback="A" src="/a.png" alt="" />
        <PillAvatar fallback="B" src="/b.png" alt="" />
      </PillAvatarGroup>,
    );
    expect(container.querySelector('[data-slot="pill-avatar-group"]')).not.toBeNull();
  });
});

describe("Pill — composition + a11y", () => {
  it("composes a full status pill", () => {
    render(
      <Pill>
        <PillIndicator variant="success" pulse />
        Operational
      </Pill>,
    );
    expect(screen.getByText("Operational")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Pill>
        <PillIndicator variant="success" />
        Operational
      </Pill>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("uses no raw color (tokens only)", () => {
    const { container } = render(
      <div>
        <PillIndicator variant="success" pulse />
        <PillIndicator variant="error" />
        <PillIndicator variant="warning" />
        <PillIndicator variant="info" />
        <PillDelta delta={1} />
        <PillDelta delta={-1} />
      </div>,
    );
    expect(container.innerHTML).not.toMatch(/emerald|rose|amber|sky|#[0-9a-f]{6}/i);
  });
});
