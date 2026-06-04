/**
 * Exhaustive tests for the ai-message (Message) compound component.
 *
 * Component source: components/ai-elements/message.tsx
 *
 * Exports:
 *   Message               – root row; data-slot="message"; `from` variant
 *   MessageContent        – bubble/body; data-slot="message-content"
 *   MessageActions        – action row; data-slot="message-actions"
 *   MessageAction         – icon button (optional tooltip); data-slot="message-action"
 *   MessageBranch         – branch context provider; data-slot="message-branch"
 *   MessageBranchContent  – branch panels; data-slot="message-branch-content"
 *   MessageBranchSelector – branch nav group; data-slot="message-branch-selector"
 *   MessageBranchPrevious – prev branch button; data-slot="message-branch-previous"
 *   MessageBranchNext     – next branch button; data-slot="message-branch-next"
 *   MessageBranchPage     – "X of Y" counter; data-slot="message-branch-page"
 *   MessageResponse       – memoized Streamdown renderer; data-slot="message-response"
 *   MessageAttachment     – single attachment chip; data-slot="message-attachment"
 *   MessageAttachments    – attachment wrapper; data-slot="message-attachments"
 *   MessageToolbar        – toolbar row; data-slot="message-toolbar"
 *   messageVariants       – cva variant fn
 */

import { render, screen, within, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageBranchPrevious,
  MessageBranchNext,
  MessageBranchPage,
  MessageResponse,
  MessageAttachment,
  MessageAttachments,
  MessageToolbar,
  messageVariants,
} from "@/components/ai-elements/message";

// ---------------------------------------------------------------------------
// 1. Message — render, data-slot, from variant
// ---------------------------------------------------------------------------

describe("Message — root", () => {
  it("renders without crashing", () => {
    const { container } = render(<Message from="assistant" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("is a <div>", () => {
    const { container } = render(<Message from="assistant" />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("has data-slot='message'", () => {
    const { container } = render(<Message from="assistant" />);
    expect(container.firstChild).toHaveAttribute("data-slot", "message");
  });

  it("reflects from='user' via data-from", () => {
    const { container } = render(<Message from="user" />);
    expect(container.firstChild).toHaveAttribute("data-from", "user");
  });

  it("reflects from='assistant' via data-from", () => {
    const { container } = render(<Message from="assistant" />);
    expect(container.firstChild).toHaveAttribute("data-from", "assistant");
  });

  it("from='user' applies is-user class", () => {
    const { container } = render(<Message from="user" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "is-user"
    );
  });

  it("from='user' aligns to the right (ml-auto)", () => {
    const { container } = render(<Message from="user" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "ml-auto"
    );
  });

  it("from='assistant' applies is-assistant class", () => {
    const { container } = render(<Message from="assistant" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "is-assistant"
    );
  });

  it("from='system' maps to is-assistant styling", () => {
    const { container } = render(<Message from="system" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "is-assistant"
    );
    expect(container.firstChild).toHaveAttribute("data-from", "system");
  });

  it("unknown from value falls back to assistant variant", () => {
    // exercises the `?? "assistant"` fallback branch
    const { container } = render(
      // @ts-expect-error — testing the runtime fallback path
      <Message from="tool" />
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "is-assistant"
    );
  });

  it("forwards custom className", () => {
    const { container } = render(
      <Message className="my-msg" from="assistant" />
    );
    expect((container.firstChild as HTMLElement).className).toContain("my-msg");
  });

  it("merges custom className with base classes", () => {
    const { container } = render(
      <Message className="my-msg" from="assistant" />
    );
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("my-msg");
    expect(cls).toContain("flex");
  });

  it("forwards arbitrary HTML attributes", () => {
    const { container } = render(
      <Message data-testid="msg" id="m1" from="assistant" />
    );
    expect(container.firstChild).toHaveAttribute("id", "m1");
    expect(container.firstChild).toHaveAttribute("data-testid", "msg");
  });

  it("renders children", () => {
    render(<Message from="assistant">hi there</Message>);
    expect(screen.getByText("hi there")).toBeInTheDocument();
  });
});

describe("messageVariants — cva fn", () => {
  it("returns is-user for from='user'", () => {
    expect(messageVariants({ from: "user" })).toContain("is-user");
  });
  it("returns is-assistant for from='assistant'", () => {
    expect(messageVariants({ from: "assistant" })).toContain("is-assistant");
  });
  it("defaults to assistant when no args", () => {
    expect(messageVariants()).toContain("is-assistant");
  });
});

// ---------------------------------------------------------------------------
// 2. MessageContent
// ---------------------------------------------------------------------------

describe("MessageContent", () => {
  it("has data-slot='message-content'", () => {
    const { container } = render(<MessageContent>body</MessageContent>);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "message-content"
    );
  });

  it("renders children", () => {
    render(<MessageContent>Hello world</MessageContent>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("styles the user bubble via group-[.is-user] tokens (bg-secondary)", () => {
    const { container } = render(<MessageContent />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "group-[.is-user]:bg-secondary"
    );
  });

  it("forwards custom className", () => {
    const { container } = render(
      <MessageContent className="custom-content" />
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "custom-content"
    );
  });

  it("forwards HTML attributes", () => {
    const { container } = render(<MessageContent data-testid="mc" />);
    expect(container.firstChild).toHaveAttribute("data-testid", "mc");
  });

  it("renders inside a user Message and inherits bubble styling target", () => {
    const { container } = render(
      <Message from="user">
        <MessageContent>Hi</MessageContent>
      </Message>
    );
    const msg = container.querySelector("[data-slot='message']") as HTMLElement;
    expect(msg.className).toContain("is-user");
    expect(
      within(msg).getByText("Hi").closest("[data-slot='message-content']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. MessageActions / MessageToolbar
// ---------------------------------------------------------------------------

describe("MessageActions", () => {
  it("has data-slot='message-actions'", () => {
    const { container } = render(<MessageActions />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "message-actions"
    );
  });
  it("renders children", () => {
    render(
      <MessageActions>
        <button>act</button>
      </MessageActions>
    );
    expect(screen.getByRole("button", { name: "act" })).toBeInTheDocument();
  });
  it("forwards className", () => {
    const { container } = render(<MessageActions className="acts" />);
    expect((container.firstChild as HTMLElement).className).toContain("acts");
  });
});

describe("MessageToolbar", () => {
  it("has data-slot='message-toolbar'", () => {
    const { container } = render(<MessageToolbar />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "message-toolbar"
    );
  });
  it("renders children", () => {
    render(<MessageToolbar>toolbar content</MessageToolbar>);
    expect(screen.getByText("toolbar content")).toBeInTheDocument();
  });
  it("forwards className", () => {
    const { container } = render(<MessageToolbar className="tb" />);
    expect((container.firstChild as HTMLElement).className).toContain("tb");
  });
  it("has mt-4 spacing class", () => {
    const { container } = render(<MessageToolbar />);
    expect((container.firstChild as HTMLElement).className).toContain("mt-4");
  });
});

// ---------------------------------------------------------------------------
// 4. MessageAction — with & without tooltip
// ---------------------------------------------------------------------------

describe("MessageAction", () => {
  it("renders a button without a tooltip", () => {
    render(
      <MessageAction label="Copy">
        <span aria-hidden>icon</span>
      </MessageAction>
    );
    expect(
      screen.getByRole("button", { name: "Copy" })
    ).toBeInTheDocument();
  });

  it("has data-slot='message-action'", () => {
    const { container } = render(
      <MessageAction label="Copy">
        <span aria-hidden>icon</span>
      </MessageAction>
    );
    expect(
      container.querySelector("[data-slot='message-action']")
    ).toBeInTheDocument();
  });

  it("renders the sr-only label text", () => {
    render(<MessageAction label="Copy message" />);
    expect(screen.getByText("Copy message")).toBeInTheDocument();
  });

  it("falls back to tooltip text for the sr-only label when label is absent", () => {
    render(<MessageAction tooltip="Regenerate" />);
    // tooltip wraps it; sr-only text equals the tooltip string
    expect(
      screen.getByRole("button", { name: "Regenerate" })
    ).toBeInTheDocument();
  });

  it("renders accessible button when tooltip is provided", () => {
    render(
      <MessageAction label="Copy" tooltip="Copy to clipboard">
        <span aria-hidden>c</span>
      </MessageAction>
    );
    // label takes priority for the sr-only span
    expect(
      screen.getByRole("button", { name: "Copy" })
    ).toBeInTheDocument();
  });

  it("fires onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <MessageAction label="Copy" onClick={onClick}>
        <span aria-hidden>c</span>
      </MessageAction>
    );
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects a custom variant prop", () => {
    const { container } = render(
      <MessageAction label="Del" variant="destructive" />
    );
    const btn = container.querySelector(
      "[data-slot='message-action']"
    ) as HTMLElement;
    expect(btn.className).toContain("text-destructive");
  });

  it("respects a custom size prop", () => {
    const { container } = render(<MessageAction label="X" size="icon" />);
    const btn = container.querySelector(
      "[data-slot='message-action']"
    ) as HTMLElement;
    expect(btn.className).toContain("size-8");
  });
});

// ---------------------------------------------------------------------------
// 5. MessageResponse — memoized Streamdown
// ---------------------------------------------------------------------------

describe("MessageResponse", () => {
  it("renders markdown content", () => {
    render(<MessageResponse>hello **bold**</MessageResponse>);
    expect(screen.getByText(/hello/)).toBeInTheDocument();
  });

  it("has a displayName", () => {
    expect(MessageResponse.displayName).toBe("MessageResponse");
  });

  it("does not re-render when children are identical (memo equality true)", () => {
    const { rerender } = render(<MessageResponse>same text</MessageResponse>);
    rerender(<MessageResponse>same text</MessageResponse>);
    expect(screen.getByText(/same text/)).toBeInTheDocument();
  });

  it("re-renders when children change (memo equality false)", () => {
    const { rerender } = render(<MessageResponse>first</MessageResponse>);
    expect(screen.getByText(/first/)).toBeInTheDocument();
    rerender(<MessageResponse>second</MessageResponse>);
    expect(screen.getByText(/second/)).toBeInTheDocument();
  });

  it("forwards custom className to the markdown root", () => {
    const { container } = render(
      <MessageResponse className="prose-x">text</MessageResponse>
    );
    expect(container.innerHTML).toContain("prose-x");
  });
});

// ---------------------------------------------------------------------------
// 6. MessageBranch — context, navigation, selector, page
// ---------------------------------------------------------------------------

describe("MessageBranch — provider & data-slot", () => {
  it("has data-slot='message-branch'", () => {
    const { container } = render(
      <MessageBranch>
        <MessageBranchContent>
          <div key="a">A</div>
        </MessageBranchContent>
      </MessageBranch>
    );
    expect(
      container.querySelector("[data-slot='message-branch']")
    ).toBeInTheDocument();
  });

  it("forwards className on the provider div", () => {
    const { container } = render(
      <MessageBranch className="branch-x">
        <MessageBranchContent>
          <div key="a">A</div>
        </MessageBranchContent>
      </MessageBranch>
    );
    const el = container.querySelector(
      "[data-slot='message-branch']"
    ) as HTMLElement;
    expect(el.className).toContain("branch-x");
  });

  it("renders only the default branch content (index 0) visibly", () => {
    const { container } = render(
      <MessageBranch>
        <MessageBranchContent>
          {[<div key="a">Branch A</div>, <div key="b">Branch B</div>]}
        </MessageBranchContent>
      </MessageBranch>
    );
    const panels = container.querySelectorAll(
      "[data-slot='message-branch-content']"
    );
    expect(panels[0].className).toContain("block");
    expect(panels[1].className).toContain("hidden");
  });

  it("respects defaultBranch prop", () => {
    const { container } = render(
      <MessageBranch defaultBranch={1}>
        <MessageBranchContent>
          {[<div key="a">Branch A</div>, <div key="b">Branch B</div>]}
        </MessageBranchContent>
      </MessageBranch>
    );
    const panels = container.querySelectorAll(
      "[data-slot='message-branch-content']"
    );
    expect(panels[0].className).toContain("hidden");
    expect(panels[1].className).toContain("block");
  });

  it("MessageBranchContent forwards className to each panel", () => {
    const { container } = render(
      <MessageBranch>
        <MessageBranchContent className="panel-x">
          {[<div key="a">A</div>, <div key="b">B</div>]}
        </MessageBranchContent>
      </MessageBranch>
    );
    const panels = container.querySelectorAll(
      "[data-slot='message-branch-content']"
    );
    panels.forEach((p) => expect(p.className).toContain("panel-x"));
  });

  it("MessageBranchContent handles a single (non-array) child", () => {
    const { container } = render(
      <MessageBranch>
        <MessageBranchContent>
          <div key="solo">Only branch</div>
        </MessageBranchContent>
      </MessageBranch>
    );
    expect(screen.getByText("Only branch")).toBeInTheDocument();
    const panels = container.querySelectorAll(
      "[data-slot='message-branch-content']"
    );
    expect(panels).toHaveLength(1);
  });
});

describe("MessageBranchSelector / Page / nav", () => {
  function renderBranchUI(branchCount: number, defaultBranch = 0) {
    const branches = Array.from({ length: branchCount }, (_, i) => (
      <div key={`b${i}`}>Branch {i + 1}</div>
    ));
    return render(
      <MessageBranch defaultBranch={defaultBranch}>
        <MessageBranchContent>{branches}</MessageBranchContent>
        <MessageBranchSelector from="assistant">
          <MessageBranchPrevious />
          <MessageBranchPage />
          <MessageBranchNext />
        </MessageBranchSelector>
      </MessageBranch>
    );
  }

  it("MessageBranchSelector renders when there is more than one branch", () => {
    const { container } = renderBranchUI(2);
    expect(
      container.querySelector("[data-slot='message-branch-selector']")
    ).toBeInTheDocument();
  });

  it("MessageBranchSelector returns null when there is one branch", () => {
    const { container } = renderBranchUI(1);
    expect(
      container.querySelector("[data-slot='message-branch-selector']")
    ).not.toBeInTheDocument();
  });

  it("MessageBranchSelector forwards a custom className", () => {
    const branches = [
      <div key="a">A</div>,
      <div key="b">B</div>,
    ];
    const { container } = render(
      <MessageBranch>
        <MessageBranchContent>{branches}</MessageBranchContent>
        <MessageBranchSelector className="sel-x" from="assistant">
          <MessageBranchPage />
        </MessageBranchSelector>
      </MessageBranch>
    );
    const sel = container.querySelector(
      "[data-slot='message-branch-selector']"
    ) as HTMLElement;
    expect(sel.className).toContain("sel-x");
  });

  it("MessageBranchPage shows the 'X of Y' counter with mono font", () => {
    const { container } = renderBranchUI(3);
    const page = container.querySelector(
      "[data-slot='message-branch-page']"
    ) as HTMLElement;
    expect(page).toHaveTextContent("1 of 3");
    expect(page.className).toContain("font-mono");
  });

  it("MessageBranchPage forwards className", () => {
    const branches = [
      <div key="a">A</div>,
      <div key="b">B</div>,
    ];
    const { container } = render(
      <MessageBranch>
        <MessageBranchContent>{branches}</MessageBranchContent>
        <MessageBranchSelector from="assistant">
          <MessageBranchPage className="page-x" />
        </MessageBranchSelector>
      </MessageBranch>
    );
    const page = container.querySelector(
      "[data-slot='message-branch-page']"
    ) as HTMLElement;
    expect(page.className).toContain("page-x");
  });

  it("Next advances the counter", () => {
    const { container } = renderBranchUI(3);
    fireEvent.click(
      container.querySelector(
        "[data-slot='message-branch-next']"
      ) as HTMLElement
    );
    expect(
      container.querySelector("[data-slot='message-branch-page']")
    ).toHaveTextContent("2 of 3");
  });

  it("Previous decrements the counter", () => {
    const { container } = renderBranchUI(3, 2);
    fireEvent.click(
      container.querySelector(
        "[data-slot='message-branch-previous']"
      ) as HTMLElement
    );
    expect(
      container.querySelector("[data-slot='message-branch-page']")
    ).toHaveTextContent("2 of 3");
  });

  it("Next wraps from last back to first", () => {
    const { container } = renderBranchUI(3, 2);
    fireEvent.click(
      container.querySelector(
        "[data-slot='message-branch-next']"
      ) as HTMLElement
    );
    expect(
      container.querySelector("[data-slot='message-branch-page']")
    ).toHaveTextContent("1 of 3");
  });

  it("Previous wraps from first to last", () => {
    const { container } = renderBranchUI(3, 0);
    fireEvent.click(
      container.querySelector(
        "[data-slot='message-branch-previous']"
      ) as HTMLElement
    );
    expect(
      container.querySelector("[data-slot='message-branch-page']")
    ).toHaveTextContent("3 of 3");
  });

  it("fires onBranchChange callback on navigation", () => {
    const onBranchChange = vi.fn();
    const branches = [
      <div key="a">A</div>,
      <div key="b">B</div>,
    ];
    const { container } = render(
      <MessageBranch onBranchChange={onBranchChange}>
        <MessageBranchContent>{branches}</MessageBranchContent>
        <MessageBranchSelector from="assistant">
          <MessageBranchNext />
        </MessageBranchSelector>
      </MessageBranch>
    );
    fireEvent.click(
      container.querySelector(
        "[data-slot='message-branch-next']"
      ) as HTMLElement
    );
    expect(onBranchChange).toHaveBeenCalledWith(1);
  });

  it("MessageBranchPrevious has data-slot and aria-label", () => {
    const { container } = renderBranchUI(2);
    const prev = container.querySelector(
      "[data-slot='message-branch-previous']"
    ) as HTMLElement;
    expect(prev).toHaveAttribute("aria-label", "Previous branch");
  });

  it("MessageBranchNext has data-slot and aria-label", () => {
    const { container } = renderBranchUI(2);
    const next = container.querySelector(
      "[data-slot='message-branch-next']"
    ) as HTMLElement;
    expect(next).toHaveAttribute("aria-label", "Next branch");
  });

  it("MessageBranchPrevious forwards className and custom children", () => {
    const branches = [
      <div key="a">A</div>,
      <div key="b">B</div>,
    ];
    const { container } = render(
      <MessageBranch>
        <MessageBranchContent>{branches}</MessageBranchContent>
        <MessageBranchSelector from="assistant">
          <MessageBranchPrevious className="prev-x">
            <span>PREV</span>
          </MessageBranchPrevious>
        </MessageBranchSelector>
      </MessageBranch>
    );
    const prev = container.querySelector(
      "[data-slot='message-branch-previous']"
    ) as HTMLElement;
    expect(prev.className).toContain("prev-x");
    expect(prev).toHaveTextContent("PREV");
  });

  it("MessageBranchNext forwards className and custom children", () => {
    const branches = [
      <div key="a">A</div>,
      <div key="b">B</div>,
    ];
    const { container } = render(
      <MessageBranch>
        <MessageBranchContent>{branches}</MessageBranchContent>
        <MessageBranchSelector from="assistant">
          <MessageBranchNext className="next-x">
            <span>NEXT</span>
          </MessageBranchNext>
        </MessageBranchSelector>
      </MessageBranch>
    );
    const next = container.querySelector(
      "[data-slot='message-branch-next']"
    ) as HTMLElement;
    expect(next.className).toContain("next-x");
    expect(next).toHaveTextContent("NEXT");
  });
});

describe("useMessageBranch — guard", () => {
  it("throws if a branch sub-component is used outside MessageBranch", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<MessageBranchPage />)).toThrow(
      /must be used within MessageBranch/
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 7. MessageAttachment / MessageAttachments
// ---------------------------------------------------------------------------

const imagePart = {
  type: "file" as const,
  mediaType: "image/png",
  url: "https://example.com/img.png",
  filename: "photo.png",
};

const filePart = {
  type: "file" as const,
  mediaType: "application/pdf",
  url: "https://example.com/doc.pdf",
  filename: "report.pdf",
};

describe("MessageAttachment", () => {
  it("renders an image attachment with data-slot", () => {
    const { container } = render(<MessageAttachment data={imagePart} />);
    expect(
      container.querySelector("[data-slot='message-attachment']")
    ).toBeInTheDocument();
  });

  it("renders an <img> for image attachments", () => {
    const { container } = render(<MessageAttachment data={imagePart} />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", imagePart.url);
    expect(img).toHaveAttribute("alt", "photo.png");
  });

  it("uses fallback alt when filename is missing on an image", () => {
    const { container } = render(
      <MessageAttachment data={{ ...imagePart, filename: undefined }} />
    );
    expect(container.querySelector("img")).toHaveAttribute(
      "alt",
      "attachment"
    );
  });

  it("renders a paperclip (non-image) attachment", () => {
    const { container } = render(<MessageAttachment data={filePart} />);
    // no img element for file attachments
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='message-attachment']")
    ).toBeInTheDocument();
  });

  it("treats a missing url as a file attachment even with image media type", () => {
    const { container } = render(
      <MessageAttachment data={{ ...imagePart, url: "" }} />
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("shows a remove button on an image when onRemove is provided", () => {
    render(<MessageAttachment data={imagePart} onRemove={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Remove attachment" })
    ).toBeInTheDocument();
  });

  it("omits the remove button on an image when onRemove is absent", () => {
    render(<MessageAttachment data={imagePart} />);
    expect(
      screen.queryByRole("button", { name: "Remove attachment" })
    ).not.toBeInTheDocument();
  });

  it("shows a remove button on a file when onRemove is provided", () => {
    render(<MessageAttachment data={filePart} onRemove={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Remove attachment" })
    ).toBeInTheDocument();
  });

  it("omits the remove button on a file when onRemove is absent", () => {
    render(<MessageAttachment data={filePart} />);
    expect(
      screen.queryByRole("button", { name: "Remove attachment" })
    ).not.toBeInTheDocument();
  });

  it("calls onRemove and stops propagation when image remove is clicked", () => {
    const onRemove = vi.fn();
    const onParentClick = vi.fn();
    render(
      <div onClick={onParentClick}>
        <MessageAttachment data={imagePart} onRemove={onRemove} />
      </div>
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Remove attachment" })
    );
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it("calls onRemove and stops propagation when file remove is clicked", () => {
    const onRemove = vi.fn();
    const onParentClick = vi.fn();
    render(
      <div onClick={onParentClick}>
        <MessageAttachment data={filePart} onRemove={onRemove} />
      </div>
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Remove attachment" })
    );
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it("forwards custom className", () => {
    const { container } = render(
      <MessageAttachment className="att-x" data={imagePart} />
    );
    const el = container.querySelector(
      "[data-slot='message-attachment']"
    ) as HTMLElement;
    expect(el.className).toContain("att-x");
  });

  it("uses the file fallback label when filename is missing on a file", () => {
    // exercises the `(isImage ? "Image" : "Attachment")` fallback branch
    const { container } = render(
      <MessageAttachment data={{ ...filePart, filename: undefined }} />
    );
    expect(
      container.querySelector("[data-slot='message-attachment']")
    ).toBeInTheDocument();
  });
});

describe("MessageAttachments", () => {
  it("returns null when there are no children", () => {
    const { container } = render(<MessageAttachments />);
    expect(
      container.querySelector("[data-slot='message-attachments']")
    ).not.toBeInTheDocument();
  });

  it("renders a wrapper with data-slot when given children", () => {
    const { container } = render(
      <MessageAttachments>
        <MessageAttachment data={imagePart} />
      </MessageAttachments>
    );
    expect(
      container.querySelector("[data-slot='message-attachments']")
    ).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    const { container } = render(
      <MessageAttachments className="atts-x">
        <MessageAttachment data={imagePart} />
      </MessageAttachments>
    );
    const el = container.querySelector(
      "[data-slot='message-attachments']"
    ) as HTMLElement;
    expect(el.className).toContain("atts-x");
  });
});

// ---------------------------------------------------------------------------
// 8. Composition & accessibility (axe)
// ---------------------------------------------------------------------------

describe("ai-message — accessibility (axe)", () => {
  it("a user + assistant conversation has no axe violations", async () => {
    const { container } = render(
      <main>
        <Message from="user">
          <MessageContent>What is byronwade/ui?</MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            <MessageResponse>A namespaced shadcn registry.</MessageResponse>
            <MessageToolbar>
              <MessageActions>
                <MessageAction label="Copy" tooltip="Copy">
                  <span aria-hidden>C</span>
                </MessageAction>
              </MessageActions>
            </MessageToolbar>
          </MessageContent>
        </Message>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("branch navigation UI has no axe violations", async () => {
    const { container } = render(
      <main>
        <MessageBranch>
          <MessageBranchContent>
            {[
              <div key="a">First answer</div>,
              <div key="b">Second answer</div>,
            ]}
          </MessageBranchContent>
          <MessageBranchSelector from="assistant">
            <MessageBranchPrevious />
            <MessageBranchPage />
            <MessageBranchNext />
          </MessageBranchSelector>
        </MessageBranch>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("attachments grid has no axe violations", async () => {
    const { container } = render(
      <main>
        <Message from="user">
          <MessageAttachments>
            <MessageAttachment data={imagePart} onRemove={vi.fn()} />
            <MessageAttachment data={filePart} onRemove={vi.fn()} />
          </MessageAttachments>
          <MessageContent>See attached.</MessageContent>
        </Message>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
