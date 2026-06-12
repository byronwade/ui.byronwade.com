/**
 * Exhaustive tests for the Reasoning compound component (AI Elements).
 *
 * Component source: components/ai-elements/reasoning.tsx
 *
 * Exports:
 *   Reasoning        – root Collapsible wrapper, data-slot="reasoning". Tracks
 *                      streaming duration + auto-open/auto-close. Controllable via
 *                      `open`/`onOpenChange` and `duration`.
 *   ReasoningTrigger – CollapsibleTrigger, data-slot="reasoning-trigger". Renders
 *                      brain icon + thinking message + chevron by default; `size`
 *                      variant ("default"|"sm"); `getThinkingMessage` override.
 *   ReasoningContent – CollapsibleContent, data-slot="reasoning-content". Renders
 *                      its string child through Streamdown.
 *   useReasoning     – context hook; throws outside <Reasoning>.
 */

import { render, screen, fireEvent, renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  useReasoning,
} from "@/components/ai-elements/reasoning";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderReasoning(props: React.ComponentProps<typeof Reasoning> = {}) {
  return render(
    <Reasoning {...props}>
      <ReasoningTrigger />
      <ReasoningContent>The reasoning trace **markdown**.</ReasoningContent>
    </Reasoning>
  );
}

const trigger = () =>
  document.querySelector("[data-slot='reasoning-trigger']") as HTMLElement;
const root = () =>
  document.querySelector("[data-slot='reasoning']") as HTMLElement;

/**
 * Base UI's Collapsible marks the OPEN state with `aria-expanded="true"` on the
 * trigger (and `data-panel-open` on it; `data-open` on the root). We assert on
 * the trigger's `aria-expanded` as the canonical open/closed signal.
 */
const isOpen = () => trigger()?.getAttribute("aria-expanded") === "true";

// ---------------------------------------------------------------------------
// 1. Render without crashing
// ---------------------------------------------------------------------------

describe("Reasoning — renders without crashing", () => {
  it("renders a fully-composed reasoning block", () => {
    expect(() => renderReasoning()).not.toThrow();
  });

  it("renders the default trigger message", () => {
    renderReasoning();
    expect(screen.getByText(/Thought for/)).toBeInTheDocument();
  });

  it("renders the streamdown content", () => {
    renderReasoning({ defaultOpen: true });
    expect(screen.getByText(/reasoning trace/)).toBeInTheDocument();
  });

  it("renders children passed to Reasoning", () => {
    render(
      <Reasoning>
        <span>custom child</span>
      </Reasoning>
    );
    expect(screen.getByText("custom child")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("Reasoning — data-slot attributes", () => {
  it("root has data-slot='reasoning'", () => {
    renderReasoning();
    expect(root()).toBeInTheDocument();
  });

  it("trigger has data-slot='reasoning-trigger'", () => {
    renderReasoning();
    expect(trigger()).toBeInTheDocument();
  });

  it("content has data-slot='reasoning-content'", () => {
    renderReasoning({ defaultOpen: true });
    expect(
      document.querySelector("[data-slot='reasoning-content']")
    ).toBeInTheDocument();
  });

  it("trigger icon has data-slot='reasoning-trigger-icon'", () => {
    renderReasoning();
    expect(
      document.querySelector("[data-slot='reasoning-trigger-icon']")
    ).toBeInTheDocument();
  });

  it("trigger chevron has data-slot='reasoning-trigger-chevron'", () => {
    renderReasoning();
    expect(
      document.querySelector("[data-slot='reasoning-trigger-chevron']")
    ).toBeInTheDocument();
  });

  it("default message has data-slot='reasoning-message'", () => {
    renderReasoning();
    expect(
      document.querySelector("[data-slot='reasoning-message']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. ReasoningTrigger — default content + variants
// ---------------------------------------------------------------------------

describe("ReasoningTrigger — default content", () => {
  it("renders brain icon, message, and chevron when no children", () => {
    renderReasoning();
    expect(
      document.querySelector("[data-slot='reasoning-trigger-icon']")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='reasoning-message']")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='reasoning-trigger-chevron']")
    ).toBeInTheDocument();
  });

  it("renders custom children instead of the default content", () => {
    render(
      <Reasoning>
        <ReasoningTrigger>
          <span>Show reasoning</span>
        </ReasoningTrigger>
      </Reasoning>
    );
    expect(screen.getByText("Show reasoning")).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='reasoning-trigger-icon']")
    ).not.toBeInTheDocument();
  });

  it("has the default size class (text-sm)", () => {
    renderReasoning();
    expect(trigger().className).toContain("text-sm");
  });

  it("size='sm' applies text-xs", () => {
    render(
      <Reasoning>
        <ReasoningTrigger size="sm" />
      </Reasoning>
    );
    expect(trigger().className).toContain("text-xs");
  });

  it("uses muted-foreground base and foreground on hover (token-only)", () => {
    renderReasoning();
    const cls = trigger().className;
    expect(cls).toContain("text-muted-foreground");
    expect(cls).toContain("hover:text-foreground");
  });

  it("carries a focus-visible ring (focus-visible:ring-ring)", () => {
    renderReasoning();
    expect(trigger().className).toContain("focus-visible:ring-ring");
  });

  it("forwards a custom className on the trigger", () => {
    render(
      <Reasoning>
        <ReasoningTrigger className="custom-trigger" />
      </Reasoning>
    );
    expect(trigger().className).toContain("custom-trigger");
    expect(trigger().className).toContain("text-muted-foreground");
  });

  it("chevron rotates via group-data-[panel-open] (no hardcoded color)", () => {
    renderReasoning();
    // the icon renders an <svg>; SVGElement.className is an SVGAnimatedString,
    // so read the raw class attribute.
    const chevron = document.querySelector(
      "[data-slot='reasoning-trigger-chevron']"
    ) as SVGElement;
    expect(chevron.getAttribute("class")).toContain(
      "group-data-[panel-open]:rotate-180"
    );
  });
});

// ---------------------------------------------------------------------------
// 4. getThinkingMessage — every branch
// ---------------------------------------------------------------------------

describe("ReasoningTrigger — thinking message branches", () => {
  it("shows the Shimmer 'Thinking...' while streaming", () => {
    render(
      <Reasoning isStreaming>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
    // the default message uses the Shimmer primitive (data-slot="shimmer")
    expect(
      document.querySelector("[data-slot='shimmer']")
    ).toBeInTheDocument();
  });

  it("shows the Shimmer when duration === 0", () => {
    render(
      <Reasoning duration={0}>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("shows 'Thought for a few seconds' when duration is undefined", () => {
    render(
      <Reasoning>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText("Thought for a few seconds")).toBeInTheDocument();
  });

  it("shows 'Thought for N seconds' with a font-mono count when duration is set", () => {
    render(
      <Reasoning duration={5}>
        <ReasoningTrigger />
      </Reasoning>
    );
    const count = screen.getByText("5");
    expect(count.className).toContain("font-mono");
    expect(count.tagName).toBe("SPAN");
    expect(screen.getByText(/Thought for/)).toBeInTheDocument();
    expect(screen.getByText(/seconds/)).toBeInTheDocument();
  });

  it("honors a custom getThinkingMessage", () => {
    render(
      <Reasoning duration={3}>
        <ReasoningTrigger
          getThinkingMessage={(streaming, d) => (
            <span>custom: {streaming ? "streaming" : `done in ${d}`}</span>
          )}
        />
      </Reasoning>
    );
    expect(screen.getByText("custom: done in 3")).toBeInTheDocument();
  });

  it("custom getThinkingMessage receives the streaming flag", () => {
    render(
      <Reasoning isStreaming>
        <ReasoningTrigger
          getThinkingMessage={(streaming) => (
            <span>{streaming ? "live" : "idle"}</span>
          )}
        />
      </Reasoning>
    );
    expect(screen.getByText("live")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. ReasoningContent
// ---------------------------------------------------------------------------

describe("ReasoningContent — classes and content", () => {
  it("renders markdown content through Streamdown", () => {
    render(
      <Reasoning defaultOpen>
        <ReasoningContent>Hello **bold** content</ReasoningContent>
      </Reasoning>
    );
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("renders emphasized markdown segments as their own inline element", () => {
    render(
      <Reasoning defaultOpen>
        <ReasoningContent>plain **strongly**</ReasoningContent>
      </Reasoning>
    );
    // Streamdown renders the bold run in a dedicated inline node (not the
    // surrounding paragraph), so the emphasized text is isolated.
    const node = screen.getByText("strongly");
    expect(node).toBeInTheDocument();
    expect(node.textContent).toBe("strongly");
  });

  it("uses muted-foreground text (token-only)", () => {
    render(
      <Reasoning defaultOpen>
        <ReasoningContent>x</ReasoningContent>
      </Reasoning>
    );
    const content = document.querySelector(
      "[data-slot='reasoning-content']"
    ) as HTMLElement;
    expect(content.className).toContain("text-muted-foreground");
  });

  it("forwards a custom className on the content", () => {
    render(
      <Reasoning defaultOpen>
        <ReasoningContent className="custom-content">x</ReasoningContent>
      </Reasoning>
    );
    const content = document.querySelector(
      "[data-slot='reasoning-content']"
    ) as HTMLElement;
    expect(content.className).toContain("custom-content");
    expect(content.className).toContain("text-muted-foreground");
  });
});

// ---------------------------------------------------------------------------
// 6. Open / close state — uncontrolled + controlled
// ---------------------------------------------------------------------------

describe("Reasoning — open/close behavior", () => {
  it("defaultOpen renders the content open (panel-open on root)", () => {
    renderReasoning({ defaultOpen: true });
    expect(isOpen()).toBe(true);
  });

  it("defaultOpen={false} renders collapsed", () => {
    renderReasoning({ defaultOpen: false });
    expect(isOpen()).toBe(false);
  });

  it("clicking the trigger toggles open state (uncontrolled)", () => {
    renderReasoning({ defaultOpen: false });
    expect(isOpen()).toBe(false);
    fireEvent.click(trigger());
    expect(isOpen()).toBe(true);
  });

  it("controlled open keeps it open regardless of clicks", () => {
    const onOpenChange = vi.fn();
    renderReasoning({ open: true, onOpenChange });
    expect(isOpen()).toBe(true);
    fireEvent.click(trigger());
    // still controlled-open; parent decides
    expect(isOpen()).toBe(true);
    expect(onOpenChange).toHaveBeenCalled();
  });

  it("controlled open={false} stays closed", () => {
    renderReasoning({ open: false });
    expect(isOpen()).toBe(false);
  });

  it("fires onOpenChange when the user toggles", () => {
    const onOpenChange = vi.fn();
    renderReasoning({ defaultOpen: false, onOpenChange });
    fireEvent.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("controlled open updates on re-render", () => {
    const { rerender } = render(
      <Reasoning open={false}>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(isOpen()).toBe(false);
    rerender(
      <Reasoning open={true}>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(isOpen()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 7. className / attribute forwarding on root
// ---------------------------------------------------------------------------

describe("Reasoning — className & attribute forwarding", () => {
  it("forwards a custom className and keeps base classes", () => {
    renderReasoning({ className: "my-reasoning" });
    expect(root().className).toContain("my-reasoning");
    expect(root().className).toContain("not-prose");
    expect(root().className).toContain("mb-4");
  });

  it("forwards arbitrary HTML attributes (id, data-testid)", () => {
    render(
      <Reasoning id="r1" data-testid="reasoning-root">
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(root()).toHaveAttribute("id", "r1");
    expect(root()).toHaveAttribute("data-testid", "reasoning-root");
  });
});

// ---------------------------------------------------------------------------
// 8. Streaming → duration tracking + auto-open / auto-close (fake timers)
// ---------------------------------------------------------------------------

describe("Reasoning — streaming lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("records elapsed seconds when streaming stops and updates the message", () => {
    const nowSpy = vi.spyOn(Date, "now");
    nowSpy.mockReturnValue(1000);

    const { rerender } = render(
      <Reasoning isStreaming defaultOpen>
        <ReasoningTrigger />
      </Reasoning>
    );
    // streaming → shimmer
    expect(screen.getByText("Thinking...")).toBeInTheDocument();

    // 3.2s later, streaming stops → ceil(3200/1000) = 4
    nowSpy.mockReturnValue(4200);
    act(() => {
      rerender(
        <Reasoning isStreaming={false} defaultOpen>
          <ReasoningTrigger />
        </Reasoning>
      );
    });

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText(/Thought for/)).toBeInTheDocument();
    nowSpy.mockRestore();
  });

  it("auto-closes after the delay when streaming ends (uncontrolled, defaultOpen)", () => {
    const { rerender } = render(
      <Reasoning isStreaming defaultOpen>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(isOpen()).toBe(true);

    act(() => {
      rerender(
        <Reasoning isStreaming={false} defaultOpen>
          <ReasoningTrigger />
        </Reasoning>
      );
    });
    // still open until the delay elapses
    expect(isOpen()).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(isOpen()).toBe(false);
  });

  it("does NOT auto-close when defaultOpen is false", () => {
    const { rerender } = render(
      <Reasoning isStreaming defaultOpen={false}>
        <ReasoningTrigger />
      </Reasoning>
    );
    act(() => {
      rerender(
        <Reasoning isStreaming={false} defaultOpen={false}>
          <ReasoningTrigger />
        </Reasoning>
      );
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // never auto-opened, so no auto-close churn — remains closed without throwing
    expect(isOpen()).toBe(false);
  });

  it("auto-close fires only once (hasAutoClosed guard)", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Reasoning isStreaming defaultOpen onOpenChange={onOpenChange}>
        <ReasoningTrigger />
      </Reasoning>
    );
    act(() => {
      rerender(
        <Reasoning isStreaming={false} defaultOpen onOpenChange={onOpenChange}>
          <ReasoningTrigger />
        </Reasoning>
      );
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const callsAfterFirst = onOpenChange.mock.calls.length;

    // Re-open and let time pass again — should not auto-close a second time
    act(() => {
      rerender(
        <Reasoning isStreaming defaultOpen onOpenChange={onOpenChange}>
          <ReasoningTrigger />
        </Reasoning>
      );
    });
    act(() => {
      rerender(
        <Reasoning isStreaming={false} defaultOpen onOpenChange={onOpenChange}>
          <ReasoningTrigger />
        </Reasoning>
      );
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // No additional auto-close beyond the first
    expect(onOpenChange.mock.calls.length).toBe(callsAfterFirst);
  });

  it("controlled duration prop is reflected without streaming", () => {
    render(
      <Reasoning duration={7}>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 9. useReasoning hook
// ---------------------------------------------------------------------------

describe("useReasoning — context hook", () => {
  it("returns the context values inside a Reasoning provider", () => {
    const { result } = renderHook(() => useReasoning(), {
      wrapper: ({ children }) => (
        <Reasoning isStreaming duration={9}>
          {children}
        </Reasoning>
      ),
    });
    expect(result.current.isStreaming).toBe(true);
    expect(result.current.duration).toBe(9);
    expect(typeof result.current.setIsOpen).toBe("function");
    expect(typeof result.current.isOpen).toBe("boolean");
  });

  it("throws when used outside <Reasoning>", () => {
    // suppress the expected React error log
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useReasoning())).toThrow(
      "Reasoning components must be used within Reasoning"
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 10. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Reasoning — accessibility (axe)", () => {
  it("closed default reasoning has no axe violations", async () => {
    const { container } = render(
      <main>
        <Reasoning defaultOpen={false}>
          <ReasoningTrigger />
          <ReasoningContent>The trace.</ReasoningContent>
        </Reasoning>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("open reasoning with content has no axe violations", async () => {
    const { container } = render(
      <main>
        <Reasoning defaultOpen>
          <ReasoningTrigger />
          <ReasoningContent>
            Step one. **Step two.** Final answer.
          </ReasoningContent>
        </Reasoning>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("streaming reasoning has no axe violations", async () => {
    const { container } = render(
      <main>
        <Reasoning isStreaming>
          <ReasoningTrigger />
          <ReasoningContent>partial trace</ReasoningContent>
        </Reasoning>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("custom-trigger reasoning has no axe violations", async () => {
    const { container } = render(
      <main>
        <Reasoning duration={4}>
          <ReasoningTrigger size="sm">
            <span>Show reasoning</span>
          </ReasoningTrigger>
          <ReasoningContent>trace</ReasoningContent>
        </Reasoning>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
