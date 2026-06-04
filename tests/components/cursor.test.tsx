/**
 * Tests for <Cursor /> parts (components/ui/cursor.tsx) — a live-collaboration
 * cursor. Covers each part, data-slots, currentColor tinting, className merge, a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import {
  Cursor,
  CursorPointer,
  CursorBody,
  CursorName,
  CursorMessage,
} from "@/components/ui/cursor";

function full() {
  return render(
    <Cursor className="text-brand">
      <CursorPointer />
      <CursorBody>
        <CursorName>Byron</CursorName>
        <CursorMessage>Editing…</CursorMessage>
      </CursorBody>
    </Cursor>,
  );
}

describe("Cursor", () => {
  it("renders the root with data-slot and pointer-events-none", () => {
    const { container } = full();
    const root = container.querySelector('[data-slot="cursor"]');
    expect(root).not.toBeNull();
    expect(root).toHaveClass("pointer-events-none");
  });

  it("renders the pointer svg (aria-hidden, currentColor fill)", () => {
    const { container } = full();
    const ptr = container.querySelector('[data-slot="cursor-pointer"]');
    expect(ptr).not.toBeNull();
    expect(ptr).toHaveAttribute("aria-hidden", "true");
    expect(ptr!.querySelector("path")).toHaveAttribute("fill", "currentColor");
  });

  it("tints from currentColor via text-* on the root", () => {
    const { container } = full();
    expect(container.querySelector('[data-slot="cursor"]')).toHaveClass("text-brand");
  });

  it("renders body, name and message", () => {
    full();
    expect(screen.getByText("Byron")).toBeInTheDocument();
    expect(screen.getByText("Editing…")).toBeInTheDocument();
  });

  it("body uses token surface by default", () => {
    const { container } = render(
      <CursorBody>
        <span>x</span>
      </CursorBody>,
    );
    expect(container.querySelector('[data-slot="cursor-body"]')).toHaveClass("bg-secondary");
  });

  it("body dims the first child only when it has multiple children", () => {
    const { container } = render(
      <CursorBody>
        <CursorName>A</CursorName>
        <CursorMessage>B</CursorMessage>
      </CursorBody>,
    );
    expect(container.querySelector('[data-slot="cursor-body"]')).toHaveClass("[&>:first-child]:opacity-70");
  });

  it("body does not dim with a single child", () => {
    const { container } = render(
      <CursorBody>
        <CursorName>A</CursorName>
      </CursorBody>,
    );
    expect(container.querySelector('[data-slot="cursor-body"]')).not.toHaveClass("[&>:first-child]:opacity-70");
  });

  it("name and message carry their data-slots + token text", () => {
    const { container } = render(
      <>
        <CursorName>N</CursorName>
        <CursorMessage>M</CursorMessage>
      </>,
    );
    expect(container.querySelector('[data-slot="cursor-name"]')).toHaveClass("font-medium");
    expect(container.querySelector('[data-slot="cursor-message"]')).toHaveClass("text-muted-foreground");
  });

  it("merges custom classNames on every part", () => {
    const { container } = render(
      <Cursor className="c-root">
        <CursorPointer className="c-ptr" />
        <CursorBody className="c-body">
          <CursorName className="c-name">n</CursorName>
          <CursorMessage className="c-msg">m</CursorMessage>
        </CursorBody>
      </Cursor>,
    );
    expect(container.querySelector(".c-root")).not.toBeNull();
    expect(container.querySelector(".c-ptr")).not.toBeNull();
    expect(container.querySelector(".c-body")).not.toBeNull();
    expect(container.querySelector(".c-name")).not.toBeNull();
    expect(container.querySelector(".c-msg")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = full();
    expect(await axe(container)).toHaveNoViolations();
  });
});
