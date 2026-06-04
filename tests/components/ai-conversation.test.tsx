/**
 * Exhaustive tests for the ai-conversation component family
 * (Vercel AI Elements "conversation", adapted to byronwade/ui).
 *
 * Component source: components/ai-elements/conversation.tsx
 *
 * Exports:
 *   Conversation              – StickToBottom root, data-slot="conversation", role="log"
 *   ConversationContent       – StickToBottom.Content, data-slot="conversation-content"
 *   ConversationEmptyState    – centered empty state, data-slot="conversation-empty-state"
 *   ConversationScrollButton  – scroll-to-bottom button (only renders when not at bottom)
 *
 * Notes on use-stick-to-bottom:
 *   - useStickToBottomContext() throws unless rendered inside <Conversation>.
 *   - isAtBottom initializes to (initial !== false). Conversation passes initial="smooth"
 *     by default, so the scroll button is hidden; pass initial={false} to surface it.
 */

import {
  render,
  screen,
  within,
  fireEvent,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { axe } from "vitest-axe";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

// use-stick-to-bottom attaches a ResizeObserver to the scroll/content refs,
// which jsdom does not provide. setup.ts intentionally does NOT polyfill it
// globally (recharts relies on its absence), so polyfill locally.
const OriginalResizeObserver = globalThis.ResizeObserver;
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});
afterAll(() => {
  globalThis.ResizeObserver = OriginalResizeObserver;
});

// ---------------------------------------------------------------------------
// 1. Conversation — root
// ---------------------------------------------------------------------------

describe("Conversation — root", () => {
  it("renders without crashing", () => {
    const { container } = render(<Conversation />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has data-slot='conversation'", () => {
    const { container } = render(<Conversation />);
    const root = container.querySelector("[data-slot='conversation']");
    expect(root).toBeInTheDocument();
  });

  it("has role='log'", () => {
    render(<Conversation aria-label="Chat" />);
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("applies base classes (relative, flex-1, overflow-y-hidden)", () => {
    const { container } = render(<Conversation />);
    const root = container.querySelector(
      "[data-slot='conversation']",
    ) as HTMLElement;
    expect(root.className).toContain("relative");
    expect(root.className).toContain("flex-1");
    expect(root.className).toContain("overflow-y-hidden");
  });

  it("forwards custom className and merges with base", () => {
    const { container } = render(<Conversation className="my-convo" />);
    const root = container.querySelector(
      "[data-slot='conversation']",
    ) as HTMLElement;
    expect(root.className).toContain("my-convo");
    expect(root.className).toContain("relative");
  });

  it("forwards HTML attributes (id, aria-label)", () => {
    const { container } = render(
      <Conversation id="convo-1" aria-label="Support chat" />,
    );
    const root = container.querySelector("[data-slot='conversation']");
    expect(root).toHaveAttribute("id", "convo-1");
    expect(root).toHaveAttribute("aria-label", "Support chat");
  });

  it("renders children", () => {
    render(
      <Conversation aria-label="Chat">
        <ConversationContent>hello</ConversationContent>
      </Conversation>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. ConversationContent
// ---------------------------------------------------------------------------

describe("ConversationContent", () => {
  it("renders without crashing inside Conversation", () => {
    const { container } = render(
      <Conversation>
        <ConversationContent>body</ConversationContent>
      </Conversation>,
    );
    expect(
      container.querySelector("[data-slot='conversation-content']"),
    ).toBeInTheDocument();
  });

  it("has data-slot='conversation-content'", () => {
    const { container } = render(
      <Conversation>
        <ConversationContent />
      </Conversation>,
    );
    expect(
      container.querySelector("[data-slot='conversation-content']"),
    ).toBeInTheDocument();
  });

  it("applies base classes (flex, flex-col, gap-8, p-4)", () => {
    const { container } = render(
      <Conversation>
        <ConversationContent />
      </Conversation>,
    );
    const content = container.querySelector(
      "[data-slot='conversation-content']",
    ) as HTMLElement;
    expect(content.className).toContain("flex");
    expect(content.className).toContain("flex-col");
    expect(content.className).toContain("gap-8");
    expect(content.className).toContain("p-4");
  });

  it("forwards custom className", () => {
    const { container } = render(
      <Conversation>
        <ConversationContent className="custom-content" />
      </Conversation>,
    );
    const content = container.querySelector(
      "[data-slot='conversation-content']",
    ) as HTMLElement;
    expect(content.className).toContain("custom-content");
  });

  it("renders children", () => {
    render(
      <Conversation>
        <ConversationContent>
          <p>message text</p>
        </ConversationContent>
      </Conversation>,
    );
    expect(screen.getByText("message text")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. ConversationEmptyState — defaults & branches
// ---------------------------------------------------------------------------

describe("ConversationEmptyState — defaults", () => {
  it("renders without crashing", () => {
    const { container } = render(<ConversationEmptyState />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has data-slot='conversation-empty-state'", () => {
    const { container } = render(<ConversationEmptyState />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "conversation-empty-state",
    );
  });

  it("applies base centering classes", () => {
    const { container } = render(<ConversationEmptyState />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("flex");
    expect(el.className).toContain("items-center");
    expect(el.className).toContain("justify-center");
    expect(el.className).toContain("text-center");
  });

  it("renders default title", () => {
    render(<ConversationEmptyState />);
    expect(screen.getByText("No messages yet")).toBeInTheDocument();
  });

  it("renders default description", () => {
    render(<ConversationEmptyState />);
    expect(
      screen.getByText("Start a conversation to see messages here"),
    ).toBeInTheDocument();
  });

  it("default title is an <h3> with data-slot and font-medium (never bold)", () => {
    render(<ConversationEmptyState />);
    const title = screen.getByText("No messages yet");
    expect(title.tagName).toBe("H3");
    expect(title).toHaveAttribute(
      "data-slot",
      "conversation-empty-state-title",
    );
    expect(title.className).toContain("font-medium");
    expect(title.className).not.toContain("font-bold");
    expect(title.className).not.toContain("font-semibold");
  });

  it("default description has muted token + data-slot", () => {
    render(<ConversationEmptyState />);
    const desc = screen.getByText(
      "Start a conversation to see messages here",
    );
    expect(desc).toHaveAttribute(
      "data-slot",
      "conversation-empty-state-description",
    );
    expect(desc.className).toContain("text-muted-foreground");
  });
});

describe("ConversationEmptyState — custom props", () => {
  it("renders a custom title", () => {
    render(<ConversationEmptyState title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders a custom description", () => {
    render(<ConversationEmptyState description="Ask me anything" />);
    expect(screen.getByText("Ask me anything")).toBeInTheDocument();
  });

  it("renders an icon when provided (wrapped with muted token)", () => {
    const { container } = render(
      <ConversationEmptyState icon={<svg data-testid="icon" />} />,
    );
    const iconWrap = container.querySelector(
      "[data-slot='conversation-empty-state-icon']",
    ) as HTMLElement;
    expect(iconWrap).toBeInTheDocument();
    expect(iconWrap.className).toContain("text-muted-foreground");
    expect(within(iconWrap).getByTestId("icon")).toBeInTheDocument();
  });

  it("does NOT render an icon wrapper when icon is omitted", () => {
    const { container } = render(<ConversationEmptyState />);
    expect(
      container.querySelector("[data-slot='conversation-empty-state-icon']"),
    ).not.toBeInTheDocument();
  });

  it("does NOT render description paragraph when description is empty string", () => {
    const { container } = render(
      <ConversationEmptyState description="" title="Only a title" />,
    );
    expect(
      container.querySelector(
        "[data-slot='conversation-empty-state-description']",
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Only a title")).toBeInTheDocument();
  });

  it("renders custom children INSTEAD of the default title/description block", () => {
    const { container } = render(
      <ConversationEmptyState>
        <div data-testid="custom-empty">Custom empty body</div>
      </ConversationEmptyState>,
    );
    expect(screen.getByTestId("custom-empty")).toBeInTheDocument();
    // default title must not render when children are provided
    expect(screen.queryByText("No messages yet")).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='conversation-empty-state-title']"),
    ).not.toBeInTheDocument();
  });

  it("forwards custom className", () => {
    const { container } = render(
      <ConversationEmptyState className="custom-empty-state" />,
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "custom-empty-state",
    );
  });

  it("forwards HTML attributes (id, data-testid)", () => {
    const { container } = render(
      <ConversationEmptyState id="empty-1" data-testid="empty" />,
    );
    expect(container.firstChild).toHaveAttribute("id", "empty-1");
    expect(container.firstChild).toHaveAttribute("data-testid", "empty");
  });

  it("is a <div> element", () => {
    const { container } = render(<ConversationEmptyState />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });
});

// ---------------------------------------------------------------------------
// 4. ConversationScrollButton — context-dependent rendering
// ---------------------------------------------------------------------------

describe("ConversationScrollButton", () => {
  it("does NOT render when at bottom (default initial='smooth' → isAtBottom true)", () => {
    const { container } = render(
      <Conversation aria-label="Chat">
        <ConversationContent>messages</ConversationContent>
        <ConversationScrollButton />
      </Conversation>,
    );
    expect(
      container.querySelector("[data-slot='conversation-scroll-button']"),
    ).not.toBeInTheDocument();
  });

  it("renders the button when NOT at bottom (initial={false})", () => {
    render(
      <Conversation aria-label="Chat" initial={false}>
        <ConversationContent>messages</ConversationContent>
        <ConversationScrollButton />
      </Conversation>,
    );
    expect(
      screen.getByRole("button"),
    ).toBeInTheDocument();
  });

  it("rendered button has data-slot='conversation-scroll-button'", () => {
    const { container } = render(
      <Conversation aria-label="Chat" initial={false}>
        <ConversationScrollButton />
      </Conversation>,
    );
    expect(
      container.querySelector("[data-slot='conversation-scroll-button']"),
    ).toBeInTheDocument();
  });

  it("rendered button is type='button' and outline variant positioning classes", () => {
    render(
      <Conversation aria-label="Chat" initial={false}>
        <ConversationScrollButton />
      </Conversation>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.className).toContain("absolute");
    expect(btn.className).toContain("rounded-full");
    expect(btn.className).toContain("left-1/2");
  });

  it("renders the ArrowDown icon (svg) inside the button", () => {
    const { container } = render(
      <Conversation aria-label="Chat" initial={false}>
        <ConversationScrollButton />
      </Conversation>,
    );
    const btn = screen.getByRole("button");
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  it("clicking the button does not throw (invokes scrollToBottom)", () => {
    render(
      <Conversation aria-label="Chat" initial={false}>
        <ConversationScrollButton />
      </Conversation>,
    );
    const btn = screen.getByRole("button");
    expect(() => fireEvent.click(btn)).not.toThrow();
  });

  it("forwards custom className when rendered", () => {
    render(
      <Conversation aria-label="Chat" initial={false}>
        <ConversationScrollButton className="custom-scroll-btn" />
      </Conversation>,
    );
    expect(screen.getByRole("button").className).toContain("custom-scroll-btn");
  });

  it("forwards extra props (aria-label) when rendered", () => {
    render(
      <Conversation aria-label="Chat" initial={false}>
        <ConversationScrollButton aria-label="Scroll to latest" />
      </Conversation>,
    );
    expect(
      screen.getByRole("button", { name: "Scroll to latest" }),
    ).toBeInTheDocument();
  });

  it("forwards onClick alongside the internal scroll handler", () => {
    const onClick = vi.fn();
    render(
      <Conversation aria-label="Chat" initial={false}>
        <ConversationScrollButton onClick={onClick} />
      </Conversation>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("throws when used outside of a Conversation (context guard)", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ConversationScrollButton />)).toThrow();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 5. Composition
// ---------------------------------------------------------------------------

describe("Conversation — composition", () => {
  it("renders a full conversation (content + empty state) without crashing", () => {
    expect(() =>
      render(
        <Conversation aria-label="Chat">
          <ConversationContent>
            <ConversationEmptyState
              icon={<svg data-testid="empty-icon" />}
              title="No messages yet"
              description="Start chatting"
            />
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>,
      ),
    ).not.toThrow();
  });

  it("renders message bubbles inside content", () => {
    render(
      <Conversation aria-label="Chat">
        <ConversationContent>
          <div>User: hi</div>
          <div>AI: hello</div>
        </ConversationContent>
      </Conversation>,
    );
    expect(screen.getByText("User: hi")).toBeInTheDocument();
    expect(screen.getByText("AI: hello")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Conversation — accessibility (axe)", () => {
  it("conversation with content has no axe violations", async () => {
    const { container } = render(
      <main>
        <Conversation aria-label="Conversation transcript">
          <ConversationContent>
            <p>How can I help?</p>
          </ConversationContent>
        </Conversation>
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("empty state has no axe violations", async () => {
    const { container } = render(
      <main>
        <Conversation aria-label="Conversation transcript">
          <ConversationContent>
            <ConversationEmptyState
              icon={<svg aria-hidden="true" />}
              title="No messages yet"
              description="Start a conversation to see messages here"
            />
          </ConversationContent>
        </Conversation>
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("scroll button (rendered) has no axe violations", async () => {
    const { container } = render(
      <main>
        <Conversation aria-label="Conversation transcript" initial={false}>
          <ConversationContent>
            <p>message</p>
          </ConversationContent>
          <ConversationScrollButton aria-label="Scroll to bottom" />
        </Conversation>
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
