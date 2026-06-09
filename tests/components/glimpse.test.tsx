/**
 * Tests for <Glimpse /> parts (components/ui/glimpse.tsx) — a hover-card link
 * preview. Covers the trigger/content open behavior, title/description/image
 * parts, token text + editorial weight, className merge, and a11y.
 */

import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  Glimpse,
  GlimpseContent,
  GlimpseTrigger,
  GlimpseTitle,
  GlimpseDescription,
  GlimpseImage,
} from "@/components/ui/glimpse";

function Preview() {
  return (
    <Glimpse openDelay={0} closeDelay={0}>
      <GlimpseTrigger asChild>
        <a href="#">link</a>
      </GlimpseTrigger>
      <GlimpseContent>
        <GlimpseImage src="/x.png" />
        <GlimpseTitle>Title text</GlimpseTitle>
        <GlimpseDescription>Description text</GlimpseDescription>
      </GlimpseContent>
    </Glimpse>
  );
}

describe("Glimpse", () => {
  it("renders the trigger", () => {
    render(<Preview />);
    expect(screen.getByRole("link", { name: "link" })).toBeInTheDocument();
  });

  it("reveals the preview content on hover", async () => {
    const user = userEvent.setup();
    render(<Preview />);
    await user.hover(screen.getByRole("link", { name: "link" }));
    expect(await screen.findByText("Title text")).toBeInTheDocument();
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("title uses editorial medium weight + token, description is muted", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Preview />);
    await user.hover(screen.getByRole("link", { name: "link" }));
    await screen.findByText("Title text");
    expect(baseElement.querySelector('[data-slot="glimpse-title"]')).toHaveClass("font-medium");
    expect(baseElement.querySelector('[data-slot="glimpse-description"]')).toHaveClass(
      "text-muted-foreground",
    );
  });

  it("image renders with an empty alt by default and token border", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Preview />);
    await user.hover(screen.getByRole("link", { name: "link" }));
    await screen.findByText("Title text");
    const img = baseElement.querySelector('[data-slot="glimpse-image"]');
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveClass("edge");
  });

  it("standalone parts merge classNames", () => {
    const { container } = render(
      <>
        <GlimpseTitle className="t">t</GlimpseTitle>
        <GlimpseDescription className="d">d</GlimpseDescription>
        <GlimpseImage className="i" src="/a.png" alt="A" />
      </>,
    );
    expect(container.querySelector(".t")).not.toBeNull();
    expect(container.querySelector(".d")).not.toBeNull();
    expect(container.querySelector(".i")).toHaveAttribute("alt", "A");
  });

  it("has no axe violations (trigger)", async () => {
    const { container } = render(<Preview />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
