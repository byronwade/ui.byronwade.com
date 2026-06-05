import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { axe } from "vitest-axe";
import { CommandResult } from "@/components/command-result";

function slot(container: HTMLElement, name: string) {
  return container.querySelector(`[data-slot="command-result-${name}"]`);
}

describe("CommandResult", () => {
  it("renders the title and the root data-slot", () => {
    const { container } = render(<CommandResult title="proposal.md" />);
    expect(screen.getByText("proposal.md")).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="command-result"]'),
    ).toBeInTheDocument();
    expect(slot(container, "title")).toHaveTextContent("proposal.md");
  });

  it("omits optional slots when their props are not provided", () => {
    const { container } = render(<CommandResult title="bare" />);
    expect(slot(container, "media")).toBeNull();
    expect(slot(container, "description")).toBeNull();
    expect(slot(container, "meta")).toBeNull();
    expect(slot(container, "action")).toBeNull();
  });

  it("renders the media slot when provided", () => {
    const { container } = render(
      <CommandResult title="t" media={<svg data-testid="icon" />} />,
    );
    const media = slot(container, "media");
    expect(media).toBeInTheDocument();
    expect(media).toContainElement(screen.getByTestId("icon"));
  });

  it("renders the muted description slot when provided", () => {
    const { container } = render(
      <CommandResult title="t" description="Drafts / Q3" />,
    );
    const description = slot(container, "description");
    expect(description).toHaveTextContent("Drafts / Q3");
    expect(description).toHaveClass("text-muted-foreground");
  });

  it("renders trailing meta in font-mono and pushes it with ml-auto", () => {
    const { container } = render(<CommandResult title="t" meta="2.4 KB" />);
    const meta = slot(container, "meta");
    expect(meta).toHaveTextContent("2.4 KB");
    expect(meta).toHaveClass("font-mono", "ml-auto");
  });

  it("gives the action ml-auto when there is no meta to anchor it", () => {
    const { container } = render(
      <CommandResult title="t" action={<button>Open</button>} />,
    );
    const action = slot(container, "action");
    expect(action).toBeInTheDocument();
    expect(action).toHaveClass("ml-auto");
  });

  it("does not give the action ml-auto when meta is present", () => {
    const { container } = render(
      <CommandResult title="t" meta="2.4 KB" action={<button>Open</button>} />,
    );
    const action = slot(container, "action");
    expect(action).toBeInTheDocument();
    expect(action).not.toHaveClass("ml-auto");
  });

  it("merges a custom className onto the root and forwards extra props", () => {
    const { container } = render(
      <CommandResult title="t" className="custom-x" data-testid="root" />,
    );
    const root = container.querySelector('[data-slot="command-result"]');
    expect(root).toHaveClass("custom-x", "flex", "w-full");
    expect(root).toHaveAttribute("data-testid", "root");
  });

  it("has no accessibility violations when fully populated", async () => {
    const { container } = render(
      <CommandResult
        media={<span aria-hidden>★</span>}
        title="hero-banner.png"
        description="Assets / marketing"
        meta="2.4 KB"
        action={<button>Open</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
