/**
 * Exhaustive tests for the PromptInput compound component family
 *
 * Component source: components/ai-elements/prompt-input.tsx
 *
 * Exports (all from @/components/ai-elements/prompt-input):
 *   Hooks:        usePromptInputController, useProviderAttachments,
 *                 usePromptInputAttachments
 *   Providers:    PromptInputProvider
 *   Root/form:    PromptInput, PromptInputBody, PromptInputTextarea
 *   Layout:       PromptInputHeader, PromptInputFooter, PromptInputTools
 *   Buttons:      PromptInputButton, PromptInputSubmit, PromptInputSpeechButton
 *   Attachments:  PromptInputAttachment, PromptInputAttachments,
 *                 PromptInputActionAddAttachments
 *   Action menu:  PromptInputActionMenu, PromptInputActionMenuTrigger,
 *                 PromptInputActionMenuContent, PromptInputActionMenuItem
 *   Select:       PromptInputSelect, PromptInputSelectTrigger,
 *                 PromptInputSelectContent, PromptInputSelectItem,
 *                 PromptInputSelectValue
 *   Hover card:   PromptInputHoverCard, PromptInputHoverCardTrigger,
 *                 PromptInputHoverCardContent
 *   Tabs (divs):  PromptInputTabsList, PromptInputTab, PromptInputTabLabel,
 *                 PromptInputTabBody, PromptInputTabItem
 *   Command:      PromptInputCommand, PromptInputCommandInput,
 *                 PromptInputCommandList, PromptInputCommandEmpty,
 *                 PromptInputCommandGroup, PromptInputCommandItem,
 *                 PromptInputCommandSeparator
 */

import * as React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";

import {
  usePromptInputController,
  useProviderAttachments,
  usePromptInputAttachments,
  PromptInputProvider,
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputHeader,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputSpeechButton,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectValue,
  PromptInputHoverCard,
  PromptInputHoverCardTrigger,
  PromptInputHoverCardContent,
  PromptInputTabsList,
  PromptInputTab,
  PromptInputTabLabel,
  PromptInputTabBody,
  PromptInputTabItem,
  PromptInputCommand,
  PromptInputCommandInput,
  PromptInputCommandList,
  PromptInputCommandEmpty,
  PromptInputCommandGroup,
  PromptInputCommandItem,
  PromptInputCommandSeparator,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

// ---------------------------------------------------------------------------
// Test environment shims — jsdom lacks blob URL + FileReader data-url support
// ---------------------------------------------------------------------------

// cmdk + Base UI Select read ResizeObserver; jsdom lacks it.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);
Element.prototype.scrollIntoView = vi.fn();

let objectUrlCounter = 0;

beforeEach(() => {
  objectUrlCounter = 0;
  // @ts-expect-error — jsdom may not define these
  global.URL.createObjectURL = vi.fn(
    () => `blob:mock/${objectUrlCounter++}`
  );
  // @ts-expect-error — jsdom may not define these
  global.URL.revokeObjectURL = vi.fn();
});

/** Build a fake File with a controllable type/name/size. */
function makeFile(
  name = "photo.png",
  type = "image/png",
  size = 4
): File {
  const blob = new Blob(["x".repeat(size)], { type });
  return new File([blob], name, { type });
}

/** A complete, realistic prompt input for smoke / a11y tests. */
function FullPrompt({
  onSubmit = () => {},
  status,
}: {
  onSubmit?: (m: PromptInputMessage) => void | Promise<void>;
  status?: React.ComponentProps<typeof PromptInputSubmit>["status"];
}) {
  return (
    <PromptInput accept="image/*" multiple onSubmit={onSubmit}>
      <PromptInputBody>
        <PromptInputAttachments>
          {(file) => <PromptInputAttachment data={file} />}
        </PromptInputAttachments>
        <PromptInputTextarea placeholder="Ask anything…" />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit status={status} />
      </PromptInputFooter>
    </PromptInput>
  );
}

// ---------------------------------------------------------------------------
// 1. Smoke / render
// ---------------------------------------------------------------------------

describe("PromptInput — renders without crashing", () => {
  it("renders a bare form with a textarea", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
      </PromptInput>
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("root form carries data-slot='prompt-input'", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
      </PromptInput>
    );
    expect(
      container.querySelector("[data-slot='prompt-input']")?.tagName
    ).toBe("FORM");
  });

  it("renders the hidden file input with an accessible label", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files");
    expect(fileInput).toHaveAttribute("type", "file");
    expect(fileInput).toHaveClass("hidden");
  });

  it("forwards accept + multiple to the file input", () => {
    render(
      <PromptInput accept="image/*" multiple onSubmit={() => {}}>
        <PromptInputTextarea />
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files");
    expect(fileInput).toHaveAttribute("accept", "image/*");
    expect(fileInput).toHaveAttribute("multiple");
  });

  it("renders a complete composed prompt", () => {
    expect(() => render(<FullPrompt />)).not.toThrow();
    expect(screen.getByPlaceholderText("Ask anything…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("forwards className + extra props to the form element", () => {
    const { container } = render(
      <PromptInput className="my-form" id="pi" onSubmit={() => {}}>
        <PromptInputTextarea />
      </PromptInput>
    );
    const form = container.querySelector("[data-slot='prompt-input']");
    expect(form).toHaveClass("my-form");
    expect(form).toHaveAttribute("id", "pi");
  });
});

// ---------------------------------------------------------------------------
// 2. Textarea
// ---------------------------------------------------------------------------

describe("PromptInputTextarea", () => {
  it("has data-slot='prompt-input-textarea' and name='message'", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
      </PromptInput>
    );
    const ta = screen.getByRole("textbox");
    expect(ta).toHaveAttribute("data-slot", "prompt-input-textarea");
    expect(ta).toHaveAttribute("name", "message");
  });

  it("uses the default placeholder", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
      </PromptInput>
    );
    expect(
      screen.getByPlaceholderText("What would you like to know?")
    ).toBeInTheDocument();
  });

  it("accepts a custom placeholder + className", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea placeholder="Hi" className="ta-x" />
      </PromptInput>
    );
    const ta = screen.getByPlaceholderText("Hi");
    expect(ta).toHaveClass("ta-x");
  });

  it("accepts typed input (uncontrolled, no provider)", async () => {
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
      </PromptInput>
    );
    const ta = screen.getByRole("textbox");
    await user.type(ta, "hello");
    expect(ta).toHaveValue("hello");
  });

  it("calls a user-supplied onChange (uncontrolled)", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea onChange={onChange} />
      </PromptInput>
    );
    await user.type(screen.getByRole("textbox"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("throws if used without a PromptInput/Provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<PromptInputTextarea />)).toThrow(
      /usePromptInputAttachments/
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 3. Enter / keyboard submit behavior
// ---------------------------------------------------------------------------

describe("PromptInputTextarea — keyboard submit", () => {
  it("submits on Enter with text", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputTextarea />
        <PromptInputSubmit />
      </PromptInput>
    );
    const ta = screen.getByRole("textbox");
    await user.type(ta, "hi");
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ text: "hi", files: [] }),
        expect.anything()
      )
    );
  });

  it("does NOT submit on Shift+Enter (newline)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputTextarea />
        <PromptInputSubmit />
      </PromptInput>
    );
    const ta = screen.getByRole("textbox");
    await user.type(ta, "line");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does NOT submit on Enter when the submit button is disabled", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputTextarea />
        <PromptInputSubmit disabled />
      </PromptInput>
    );
    await user.type(screen.getByRole("textbox"), "hi");
    await user.keyboard("{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("composition (IME) Enter does not submit", async () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputTextarea />
        <PromptInputSubmit />
      </PromptInput>
    );
    const ta = screen.getByRole("textbox") as HTMLTextAreaElement;
    React.act(() => {
      ta.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
    });
    React.act(() => {
      ta.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      );
    });
    expect(onSubmit).not.toHaveBeenCalled();
    React.act(() => {
      ta.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true }));
    });
  });
});

// ---------------------------------------------------------------------------
// 4. Submit button — status variants
// ---------------------------------------------------------------------------

describe("PromptInputSubmit — status icons", () => {
  it("renders default (no status) with data-slot + aria-label", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputSubmit />
      </PromptInput>
    );
    const btn = screen.getByRole("button", { name: "Submit" });
    expect(btn).toHaveAttribute("data-slot", "prompt-input-submit");
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("status='submitted' shows a spinner", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputSubmit status="submitted" />
      </PromptInput>
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("status='streaming' shows the stop (square) icon", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputSubmit status="streaming" />
      </PromptInput>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("status='error' renders an icon", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputSubmit status="error" />
      </PromptInput>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom children instead of the default icon", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputSubmit>Send</PromptInputSubmit>
      </PromptInput>
    );
    expect(screen.getByRole("button", { name: "Submit" })).toHaveTextContent(
      "Send"
    );
  });

  it("forwards className", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputSubmit className="submit-x" />
      </PromptInput>
    );
    expect(screen.getByRole("button", { name: "Submit" })).toHaveClass(
      "submit-x"
    );
  });
});

// ---------------------------------------------------------------------------
// 5. Submit flow — sync, async (clears), and error (keeps state)
// ---------------------------------------------------------------------------

describe("PromptInput — submit flow", () => {
  it("clicking submit fires onSubmit with the typed text", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputTextarea />
        <PromptInputSubmit />
      </PromptInput>
    );
    await user.type(screen.getByRole("textbox"), "ping");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ text: "ping" }),
        expect.anything()
      )
    );
  });

  it("async onSubmit resolves and clears (provider input)", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <PromptInputProvider initialInput="seed">
        <PromptInput onSubmit={onSubmit}>
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInput>
      </PromptInputProvider>
    );
    const ta = screen.getByRole("textbox");
    expect(ta).toHaveValue("seed");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(ta).toHaveValue(""));
  });

  it("rejected async onSubmit keeps the provider input value", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("nope"));
    const user = userEvent.setup();
    render(
      <PromptInputProvider initialInput="keep">
        <PromptInput onSubmit={onSubmit}>
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInput>
      </PromptInputProvider>
    );
    const ta = screen.getByRole("textbox");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(ta).toHaveValue("keep");
  });

  it("a throwing sync onSubmit does not crash", async () => {
    const onSubmit = vi.fn(() => {
      throw new Error("boom");
    });
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputTextarea />
        <PromptInputSubmit />
      </PromptInput>
    );
    await user.type(screen.getByRole("textbox"), "x");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});

// ---------------------------------------------------------------------------
// 6. Attachments — add via file input, render chip, remove
// ---------------------------------------------------------------------------

describe("PromptInput — attachments", () => {
  it("does not render the attachments row when empty", () => {
    const { container } = render(<FullPrompt />);
    expect(
      container.querySelector("[data-slot='prompt-input-attachments']")
    ).toBeNull();
  });

  it("adds an image file and renders an attachment chip", async () => {
    const user = userEvent.setup();
    render(<FullPrompt />);
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("cat.png", "image/png"));
    await waitFor(() =>
      expect(screen.getByText("cat.png")).toBeInTheDocument()
    );
    expect(
      screen.getByRole("button", { name: "Remove attachment" })
    ).toBeInTheDocument();
  });

  it("removes an attachment via the remove button", async () => {
    const user = userEvent.setup();
    render(<FullPrompt />);
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("dog.png", "image/png"));
    await waitFor(() => screen.getByText("dog.png"));
    await user.click(
      screen.getByRole("button", { name: "Remove attachment" })
    );
    await waitFor(() =>
      expect(screen.queryByText("dog.png")).not.toBeInTheDocument()
    );
  });

  it("rejects a non-matching type and calls onError(accept)", async () => {
    const onError = vi.fn();
    // applyAccept is a setup-level config in user-event v14, not a per-call
    // upload option. Without it, the input's accept="image/*" filters the
    // text/plain file out before it ever reaches the component, so onError
    // would never fire and the component's accept logic would go untested.
    const user = userEvent.setup({ applyAccept: false });
    render(
      <PromptInput accept="image/*" onError={onError} onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("notes.txt", "text/plain"));
    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ code: "accept" })
      )
    );
  });

  it("rejects an oversize file and calls onError(max_file_size)", async () => {
    const onError = vi.fn();
    const user = userEvent.setup();
    render(
      <PromptInput maxFileSize={1} onError={onError} onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("big.png", "image/png", 50));
    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ code: "max_file_size" })
      )
    );
  });

  it("caps at maxFiles and calls onError(max_files)", async () => {
    const onError = vi.fn();
    const user = userEvent.setup();
    render(
      <PromptInput maxFiles={1} multiple onError={onError} onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, [
      makeFile("a.png", "image/png"),
      makeFile("b.png", "image/png"),
    ]);
    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ code: "max_files" })
      )
    );
    expect(screen.getByText("a.png")).toBeInTheDocument();
    expect(screen.queryByText("b.png")).not.toBeInTheDocument();
  });

  it("Backspace on empty textarea removes the last attachment", async () => {
    const user = userEvent.setup();
    render(<FullPrompt />);
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("z.png", "image/png"));
    await waitFor(() => screen.getByText("z.png"));
    const ta = screen.getByRole("textbox");
    ta.focus();
    await user.keyboard("{Backspace}");
    await waitFor(() =>
      expect(screen.queryByText("z.png")).not.toBeInTheDocument()
    );
  });

  it("renders a non-image attachment with a paperclip + label", () => {
    function Harness() {
      const a = usePromptInputAttachments();
      React.useEffect(() => {
        a.add([makeFile("report.pdf", "application/pdf")]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return (
        <PromptInputAttachments>
          {(f) => <PromptInputAttachment data={f} />}
        </PromptInputAttachments>
      );
    }
    render(
      <PromptInput onSubmit={() => {}}>
        <Harness />
        <PromptInputTextarea />
      </PromptInput>
    );
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });

  it("PromptInputAttachment forwards className", () => {
    function Harness() {
      const a = usePromptInputAttachments();
      React.useEffect(() => {
        a.add([makeFile("c.png", "image/png")]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return (
        <PromptInputAttachments className="att-row">
          {(f) => <PromptInputAttachment data={f} className="att-chip" />}
        </PromptInputAttachments>
      );
    }
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <Harness />
        <PromptInputTextarea />
      </PromptInput>
    );
    expect(
      container.querySelector("[data-slot='prompt-input-attachments']")
    ).toHaveClass("att-row");
    expect(
      container.querySelector("[data-slot='prompt-input-attachment']")
    ).toHaveClass("att-chip");
  });

  it("submitting converts files (blob → data url path runs)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<FullPrompt onSubmit={onSubmit} />);
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("p.png", "image/png"));
    await waitFor(() => screen.getByText("p.png"));
    await user.type(screen.getByRole("textbox"), "hey");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const msg = onSubmit.mock.calls[0][0] as PromptInputMessage;
    expect(msg.files.length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 7. Action menu + add-attachments item
// ---------------------------------------------------------------------------

describe("PromptInput — action menu", () => {
  it("trigger renders a default plus button (icon)", () => {
    const { container } = render(<FullPrompt />);
    expect(
      container.querySelector("[data-slot='prompt-input-action-menu-trigger']")
    ).toBeInTheDocument();
  });

  it("opens the menu and reveals the add-attachments item", async () => {
    const user = userEvent.setup();
    render(<FullPrompt />);
    await user.click(screen.getByRole("button", { name: "Open actions" }));
    await waitFor(() =>
      expect(screen.getByText("Add photos or files")).toBeInTheDocument()
    );
  });

  it("clicking add-attachments opens the file dialog without closing", async () => {
    const user = userEvent.setup();
    render(<FullPrompt />);
    const fileInput = screen.getByLabelText("Upload files");
    const clickSpy = vi.spyOn(fileInput, "click").mockImplementation(() => {});
    await user.click(screen.getByRole("button", { name: "Open actions" }));
    await waitFor(() => screen.getByText("Add photos or files"));
    await user.click(screen.getByText("Add photos or files"));
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("PromptInputActionMenuItem renders with data-slot + className", async () => {
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
        <PromptInputActionMenu>
          <PromptInputActionMenuTrigger>open</PromptInputActionMenuTrigger>
          <PromptInputActionMenuContent className="menu-x">
            <PromptInputActionMenuItem className="item-x">
              Reset
            </PromptInputActionMenuItem>
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
      </PromptInput>
    );
    await user.click(screen.getByRole("button", { name: "open" }));
    await waitFor(() => screen.getByText("Reset"));
    const item = screen
      .getByText("Reset")
      .closest("[data-slot='prompt-input-action-menu-item']");
    expect(item).toHaveClass("item-x");
  });

  it("add-attachments accepts a custom label", async () => {
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
        <PromptInputActionMenu>
          <PromptInputActionMenuTrigger>open</PromptInputActionMenuTrigger>
          <PromptInputActionMenuContent>
            <PromptInputActionAddAttachments label="Attach" />
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
      </PromptInput>
    );
    await user.click(screen.getByRole("button", { name: "open" }));
    await waitFor(() =>
      expect(screen.getByText("Attach")).toBeInTheDocument()
    );
  });
});

// ---------------------------------------------------------------------------
// 8. Buttons — PromptInputButton + SpeechButton
// ---------------------------------------------------------------------------

describe("PromptInputButton", () => {
  it("single child → icon-sm size, multi child → sm", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputButton aria-label="solo">
          <span>i</span>
        </PromptInputButton>
        <PromptInputButton aria-label="multi">
          <span>x</span>
          <span>Label</span>
        </PromptInputButton>
      </PromptInput>
    );
    expect(screen.getByRole("button", { name: "solo" })).toHaveAttribute(
      "data-size",
      "icon-sm"
    );
    expect(screen.getByRole("button", { name: "multi" })).toHaveAttribute(
      "data-size",
      "sm"
    );
  });

  it("honors an explicit size + variant", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputButton size="xs" variant="default" aria-label="x">
          x
        </PromptInputButton>
      </PromptInput>
    );
    expect(screen.getByRole("button", { name: "x" })).toHaveAttribute(
      "data-size",
      "xs"
    );
  });

  it("has data-slot='prompt-input-button' and is type=button", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputButton aria-label="b">b</PromptInputButton>
      </PromptInput>
    );
    const btn = screen.getByRole("button", { name: "b" });
    expect(btn).toHaveAttribute("data-slot", "prompt-input-button");
    expect(btn).toHaveAttribute("type", "button");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputButton aria-label="c" onClick={onClick}>
          c
        </PromptInputButton>
      </PromptInput>
    );
    await user.click(screen.getByRole("button", { name: "c" }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("PromptInputSpeechButton", () => {
  it("is disabled when SpeechRecognition is unavailable", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputSpeechButton />
      </PromptInput>
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-slot", "prompt-input-speech-button");
    expect(btn).toBeDisabled();
  });

  it("toggles listening when SpeechRecognition is available", async () => {
    const start = vi.fn();
    const stop = vi.fn();
    let instance: Record<string, unknown> = {};
    class FakeSR {
      continuous = false;
      interimResults = false;
      lang = "";
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onresult: ((e: unknown) => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      start = () => {
        start();
        this.onstart?.();
      };
      stop = () => {
        stop();
        this.onend?.();
      };
      constructor() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        instance = this as unknown as Record<string, unknown>;
      }
    }
    // @ts-expect-error — define test global
    window.SpeechRecognition = FakeSR;
    const onTranscriptionChange = vi.fn();
    const textareaRef = React.createRef<HTMLTextAreaElement>();
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea ref={textareaRef} />
        <PromptInputSpeechButton
          textareaRef={textareaRef}
          onTranscriptionChange={onTranscriptionChange}
        />
      </PromptInput>
    );
    const btn = screen.getByRole("button");
    expect(btn).not.toBeDisabled();
    await user.click(btn);
    expect(start).toHaveBeenCalled();
    // simulate a final result -> writes into the textarea
    React.act(() => {
      (instance.onresult as (e: unknown) => void)?.({
        resultIndex: 0,
        results: {
          length: 1,
          0: { isFinal: true, 0: { transcript: "hello" } },
        },
      });
    });
    expect(onTranscriptionChange).toHaveBeenCalledWith("hello");
    await user.click(btn);
    expect(stop).toHaveBeenCalled();
    // @ts-expect-error — cleanup
    delete window.SpeechRecognition;
  });
});

// ---------------------------------------------------------------------------
// 9. Layout primitives — Header / Footer / Tools / Body
// ---------------------------------------------------------------------------

describe("PromptInput — layout primitives", () => {
  it("PromptInputBody is a contents wrapper with data-slot", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody className="body-x">
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const body = container.querySelector("[data-slot='prompt-input-body']");
    expect(body).toHaveClass("contents", "body-x");
  });

  it("PromptInputHeader uses align=block-end + order-first", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputHeader className="hdr-x">tools</PromptInputHeader>
        <PromptInputTextarea />
      </PromptInput>
    );
    const hdr = container.querySelector("[data-slot='prompt-input-header']");
    expect(hdr).toHaveClass("order-first", "hdr-x");
    expect(hdr).toHaveAttribute("data-align", "block-end");
  });

  it("PromptInputFooter justifies between", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
        <PromptInputFooter className="ft-x">x</PromptInputFooter>
      </PromptInput>
    );
    const ft = container.querySelector("[data-slot='prompt-input-footer']");
    expect(ft).toHaveClass("justify-between", "ft-x");
  });

  it("PromptInputTools is a flex row with data-slot", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
        <PromptInputTools className="tools-x">t</PromptInputTools>
      </PromptInput>
    );
    const tools = container.querySelector("[data-slot='prompt-input-tools']");
    expect(tools).toHaveClass("flex", "items-center", "tools-x");
  });
});

// ---------------------------------------------------------------------------
// 10. Select wrappers
// ---------------------------------------------------------------------------

describe("PromptInput — select", () => {
  function ModelSelect({ onValueChange }: { onValueChange?: (v: string) => void }) {
    return (
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
        <PromptInputSelect
          defaultValue="a"
          items={{ a: "Alpha", b: "Beta" }}
          onValueChange={onValueChange}
        >
          <PromptInputSelectTrigger className="trg-x">
            <PromptInputSelectValue placeholder="Pick" />
          </PromptInputSelectTrigger>
          <PromptInputSelectContent className="cnt-x">
            <PromptInputSelectItem value="a">Alpha</PromptInputSelectItem>
            <PromptInputSelectItem value="b">Beta</PromptInputSelectItem>
          </PromptInputSelectContent>
        </PromptInputSelect>
      </PromptInput>
    );
  }

  it("renders trigger with data-slot + merged className", () => {
    render(<ModelSelect />);
    const trg = screen.getByRole("combobox");
    expect(trg).toHaveAttribute("data-slot", "prompt-input-select-trigger");
    expect(trg).toHaveClass("trg-x");
  });

  it("shows the default value and opens to reveal items", async () => {
    const user = userEvent.setup();
    render(<ModelSelect />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Alpha");
    await user.click(screen.getByRole("combobox"));
    expect(
      await screen.findByRole("option", { name: "Beta" })
    ).toBeInTheDocument();
  });

  it("selecting an item fires onValueChange", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<ModelSelect onValueChange={onValueChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Beta" }));
    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
    expect(onValueChange.mock.calls[0][0]).toBe("b");
  });

  it("select content + item carry data-slot", async () => {
    const user = userEvent.setup();
    render(<ModelSelect />);
    await user.click(screen.getByRole("combobox"));
    await screen.findByRole("option", { name: "Beta" });
    expect(
      document.querySelector("[data-slot='prompt-input-select-content']")
    ).toHaveClass("cnt-x");
    expect(
      document.querySelector("[data-slot='prompt-input-select-item']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Hover card wrappers
// ---------------------------------------------------------------------------

describe("PromptInput — hover card", () => {
  it("renders trigger; content appears on hover", async () => {
    const user = userEvent.setup();
    render(
      <PromptInputHoverCard>
        <PromptInputHoverCardTrigger render={<button type="button">peek</button>} />
        <PromptInputHoverCardContent>
          <span>preview body</span>
        </PromptInputHoverCardContent>
      </PromptInputHoverCard>
    );
    const trigger = screen.getByRole("button", { name: "peek" });
    expect(trigger).toBeInTheDocument();
    await user.hover(trigger);
    await waitFor(() =>
      expect(screen.getByText("preview body")).toBeInTheDocument()
    );
  });

  it("attachment chip exposes a hover-card preview (image)", async () => {
    const user = userEvent.setup();
    render(<FullPrompt />);
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("pic.png", "image/png"));
    await waitFor(() => screen.getByText("pic.png"));
    await user.hover(
      screen.getByText("pic.png").closest(
        "[data-slot='prompt-input-attachment']"
      ) as HTMLElement
    );
    await waitFor(() =>
      expect(screen.getByText("image/png")).toBeInTheDocument()
    );
  });
});

// ---------------------------------------------------------------------------
// 12. Tab primitives (plain divs)
// ---------------------------------------------------------------------------

describe("PromptInput — tab primitives", () => {
  it("renders all tab parts with data-slots + merged classNames", () => {
    const { container } = render(
      <PromptInputTabsList className="tl">
        <PromptInputTab className="tb">
          <PromptInputTabLabel className="lbl">Recents</PromptInputTabLabel>
          <PromptInputTabBody className="bd">
            <PromptInputTabItem className="it">Item</PromptInputTabItem>
          </PromptInputTabBody>
        </PromptInputTab>
      </PromptInputTabsList>
    );
    expect(
      container.querySelector("[data-slot='prompt-input-tabs-list']")
    ).toHaveClass("tl");
    expect(
      container.querySelector("[data-slot='prompt-input-tab']")
    ).toHaveClass("tb");
    const label = container.querySelector(
      "[data-slot='prompt-input-tab-label']"
    );
    expect(label).toHaveClass("lbl", "font-medium");
    expect(label?.tagName).toBe("H3");
    expect(
      container.querySelector("[data-slot='prompt-input-tab-body']")
    ).toHaveClass("bd", "space-y-1");
    expect(
      container.querySelector("[data-slot='prompt-input-tab-item']")
    ).toHaveClass("it");
    expect(screen.getByText("Item")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 13. Command wrappers
// ---------------------------------------------------------------------------

describe("PromptInput — command", () => {
  it("renders a command palette with input, groups, items, separator, empty", () => {
    const { container } = render(
      <PromptInputCommand className="cmd-x">
        <PromptInputCommandInput placeholder="Search…" className="ci" />
        <PromptInputCommandList className="cl">
          <PromptInputCommandEmpty className="ce">None</PromptInputCommandEmpty>
          <PromptInputCommandGroup className="cg" heading="Models">
            <PromptInputCommandItem className="cit">Sonnet</PromptInputCommandItem>
          </PromptInputCommandGroup>
          <PromptInputCommandSeparator className="cs" />
        </PromptInputCommandList>
      </PromptInputCommand>
    );
    expect(
      container.querySelector("[data-slot='prompt-input-command']")
    ).toHaveClass("cmd-x");
    expect(screen.getByPlaceholderText("Search…")).toHaveClass("ci");
    expect(screen.getByText("Sonnet")).toBeInTheDocument();
  });

  it("filters items as the user types", async () => {
    const user = userEvent.setup();
    render(
      <PromptInputCommand>
        <PromptInputCommandInput placeholder="Search…" />
        <PromptInputCommandList>
          <PromptInputCommandEmpty>No results</PromptInputCommandEmpty>
          <PromptInputCommandGroup heading="Models">
            <PromptInputCommandItem>Sonnet</PromptInputCommandItem>
            <PromptInputCommandItem>Opus</PromptInputCommandItem>
          </PromptInputCommandGroup>
        </PromptInputCommandList>
      </PromptInputCommand>
    );
    await user.type(screen.getByPlaceholderText("Search…"), "opu");
    await waitFor(() => {
      expect(screen.getByText("Opus")).toBeInTheDocument();
      expect(screen.queryByText("Sonnet")).not.toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// 14. Provider + hooks
// ---------------------------------------------------------------------------

describe("PromptInputProvider — hooks", () => {
  it("usePromptInputController exposes textInput + attachments + register", () => {
    let captured: ReturnType<typeof usePromptInputController> | null = null;
    function Probe() {
      captured = usePromptInputController();
      return null;
    }
    render(
      <PromptInputProvider initialInput="abc">
        <Probe />
      </PromptInputProvider>
    );
    expect(captured!.textInput.value).toBe("abc");
    expect(typeof captured!.attachments.add).toBe("function");
    expect(typeof captured!.__registerFileInput).toBe("function");
  });

  it("useProviderAttachments add/remove/clear manage the file list", () => {
    let api: ReturnType<typeof useProviderAttachments> | null = null;
    function Probe() {
      api = useProviderAttachments();
      return <span>count:{api.files.length}</span>;
    }
    render(
      <PromptInputProvider>
        <Probe />
      </PromptInputProvider>
    );
    expect(screen.getByText("count:0")).toBeInTheDocument();
    React.act(() => {
      api!.add([makeFile("a.png", "image/png"), makeFile("b.png", "image/png")]);
    });
    expect(screen.getByText("count:2")).toBeInTheDocument();
    const firstId = api!.files[0].id;
    React.act(() => api!.remove(firstId));
    expect(screen.getByText("count:1")).toBeInTheDocument();
    React.act(() => api!.clear());
    expect(screen.getByText("count:0")).toBeInTheDocument();
  });

  it("provider add([]) is a no-op", () => {
    let api: ReturnType<typeof useProviderAttachments> | null = null;
    function Probe() {
      api = useProviderAttachments();
      return <span>n:{api.files.length}</span>;
    }
    render(
      <PromptInputProvider>
        <Probe />
      </PromptInputProvider>
    );
    React.act(() => api!.add([]));
    expect(screen.getByText("n:0")).toBeInTheDocument();
  });

  it("provider openFileDialog calls the registered open()", () => {
    const open = vi.fn();
    let api: ReturnType<typeof usePromptInputController> | null = null;
    function Probe() {
      api = usePromptInputController();
      React.useEffect(() => {
        api!.__registerFileInput({ current: null }, open);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return null;
    }
    render(
      <PromptInputProvider>
        <Probe />
      </PromptInputProvider>
    );
    React.act(() => api!.attachments.openFileDialog());
    expect(open).toHaveBeenCalled();
  });

  it("usePromptInputController throws outside a provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Probe() {
      usePromptInputController();
      return null;
    }
    expect(() => render(<Probe />)).toThrow(/PromptInputProvider/);
    spy.mockRestore();
  });

  it("useProviderAttachments throws outside a provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Probe() {
      useProviderAttachments();
      return null;
    }
    expect(() => render(<Probe />)).toThrow(/PromptInputProvider/);
    spy.mockRestore();
  });

  it("usePromptInputAttachments throws outside any context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Probe() {
      usePromptInputAttachments();
      return null;
    }
    expect(() => render(<Probe />)).toThrow(/usePromptInputAttachments/);
    spy.mockRestore();
  });

  it("PromptInput inside a Provider uses provider attachments (dual-mode)", async () => {
    const user = userEvent.setup();
    render(
      <PromptInputProvider>
        <PromptInput onSubmit={() => {}}>
          <PromptInputBody>
            <PromptInputAttachments>
              {(f) => <PromptInputAttachment data={f} />}
            </PromptInputAttachments>
            <PromptInputTextarea />
          </PromptInputBody>
        </PromptInput>
      </PromptInputProvider>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("prov.png", "image/png"));
    await waitFor(() =>
      expect(screen.getByText("prov.png")).toBeInTheDocument()
    );
  });
});

// ---------------------------------------------------------------------------
// 15. globalDrop / syncHiddenInput props
// ---------------------------------------------------------------------------

describe("PromptInput — drag & drop / sync", () => {
  it("globalDrop attaches a document-level drop that adds files", async () => {
    render(
      <PromptInput globalDrop onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const dt = {
      types: ["Files"],
      files: [makeFile("drop.png", "image/png")],
    };
    React.act(() => {
      const evt = new Event("drop", { bubbles: true, cancelable: true });
      // @ts-expect-error — attach fake dataTransfer
      evt.dataTransfer = dt;
      document.dispatchEvent(evt);
    });
    await waitFor(() =>
      expect(screen.getByText("drop.png")).toBeInTheDocument()
    );
  });

  it("form-level drop (no globalDrop) adds files", async () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const form = container.querySelector(
      "[data-slot='prompt-input']"
    ) as HTMLFormElement;
    React.act(() => {
      const evt = new Event("drop", { bubbles: true, cancelable: true });
      // @ts-expect-error — fake dataTransfer
      evt.dataTransfer = { types: ["Files"], files: [makeFile("fd.png", "image/png")] };
      form.dispatchEvent(evt);
    });
    await waitFor(() =>
      expect(screen.getByText("fd.png")).toBeInTheDocument()
    );
  });

  it("syncHiddenInput renders without error", () => {
    expect(() =>
      render(
        <PromptInput syncHiddenInput onSubmit={() => {}}>
          <PromptInputTextarea />
        </PromptInput>
      )
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 16. Accessibility (axe)
// ---------------------------------------------------------------------------

describe("PromptInput — accessibility (axe)", () => {
  it("a composed prompt has no axe violations", async () => {
    const { container } = render(
      <main>
        <FullPrompt />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("prompt with a select + speech button has no axe violations", async () => {
    const { container } = render(
      <main>
        <PromptInput onSubmit={() => {}}>
          <PromptInputBody>
            <PromptInputTextarea />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputSpeechButton />
              <PromptInputSelect defaultValue="a">
                <PromptInputSelectTrigger aria-label="Model">
                  <PromptInputSelectValue placeholder="Model" />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  <PromptInputSelectItem value="a">Alpha</PromptInputSelectItem>
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("a command palette has no axe violations", async () => {
    const { container } = render(
      <main>
        <PromptInputCommand>
          <PromptInputCommandInput placeholder="Search commands" />
          <PromptInputCommandList>
            <PromptInputCommandEmpty>No results</PromptInputCommandEmpty>
            <PromptInputCommandGroup heading="Models">
              <PromptInputCommandItem>Sonnet</PromptInputCommandItem>
            </PromptInputCommandGroup>
          </PromptInputCommandList>
        </PromptInputCommand>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 17. Coverage completeness — handlers exercised through public behavior
// ---------------------------------------------------------------------------

describe("PromptInputProvider — openFileDialog edge cases", () => {
  it("openFileDialog() before any register is a safe no-op (default openRef)", () => {
    let api: ReturnType<typeof usePromptInputController> | null = null;
    function Probe() {
      api = usePromptInputController();
      return null;
    }
    render(
      <PromptInputProvider>
        <Probe />
      </PromptInputProvider>
    );
    // No PromptInput mounted, no __registerFileInput called: the default
    // openRef (() => {}) must run without throwing.
    expect(() => React.act(() => api!.attachments.openFileDialog())).not.toThrow();
  });

  it("openFileDialog() clicks the mounted PromptInput's hidden file input", () => {
    let api: ReturnType<typeof usePromptInputController> | null = null;
    function Probe() {
      api = usePromptInputController();
      return null;
    }
    render(
      <PromptInputProvider>
        <Probe />
        <PromptInput onSubmit={() => {}}>
          <PromptInputTextarea />
        </PromptInput>
      </PromptInputProvider>
    );
    // PromptInput's effect registers () => inputRef.current?.click() with the
    // provider. Calling openFileDialog() must invoke that registered opener,
    // which clicks the hidden <input type=file>.
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click").mockImplementation(() => {});
    React.act(() => api!.attachments.openFileDialog());
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});

describe("PromptInputTextarea — controlled mode + paste", () => {
  it("controlled (provider) onChange updates input and calls user onChange", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    let api: ReturnType<typeof usePromptInputController> | null = null;
    function Probe() {
      api = usePromptInputController();
      return null;
    }
    render(
      <PromptInputProvider>
        <Probe />
        <PromptInput onSubmit={() => {}}>
          <PromptInputTextarea onChange={onChange} />
        </PromptInput>
      </PromptInputProvider>
    );
    const ta = screen.getByRole("textbox");
    await user.type(ta, "x");
    expect(onChange).toHaveBeenCalled();
    // The controlled onChange wrote through to the shared controller state.
    expect(api!.textInput.value).toBe("x");
    expect(ta).toHaveValue("x");
  });

  it("pasting files adds them as attachments and prevents default", async () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const ta = screen.getByRole("textbox");
    const file = makeFile("pasted.png", "image/png");
    const preventDefault = vi.fn();
    React.act(() => {
      ta.dispatchEvent(
        Object.assign(
          new Event("paste", { bubbles: true, cancelable: true }),
          {
            clipboardData: {
              items: [
                {
                  kind: "file",
                  getAsFile: () => file,
                },
                // a non-file item is ignored
                { kind: "string", getAsFile: () => null },
              ],
            },
            preventDefault,
          }
        )
      );
    });
    expect(preventDefault).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByText("pasted.png")).toBeInTheDocument()
    );
  });

  it("pasting with no clipboard items is a no-op", () => {
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const ta = screen.getByRole("textbox");
    expect(() =>
      React.act(() => {
        ta.dispatchEvent(
          Object.assign(new Event("paste", { bubbles: true }), {
            clipboardData: { items: undefined },
          })
        );
      })
    ).not.toThrow();
  });
});

describe("PromptInput — dragover prevents default on file drags", () => {
  it("form-level dragover with Files calls preventDefault", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const form = container.querySelector(
      "[data-slot='prompt-input']"
    ) as HTMLFormElement;
    const evt = new Event("dragover", { bubbles: true, cancelable: true });
    // @ts-expect-error — fake dataTransfer
    evt.dataTransfer = { types: ["Files"] };
    const preventDefault = vi.spyOn(evt, "preventDefault");
    React.act(() => {
      form.dispatchEvent(evt);
    });
    expect(preventDefault).toHaveBeenCalled();
  });

  it("globalDrop dragover with Files calls preventDefault on document", () => {
    render(
      <PromptInput globalDrop onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const evt = new Event("dragover", { bubbles: true, cancelable: true });
    // @ts-expect-error — fake dataTransfer
    evt.dataTransfer = { types: ["Files"] };
    const preventDefault = vi.spyOn(evt, "preventDefault");
    React.act(() => {
      document.dispatchEvent(evt);
    });
    expect(preventDefault).toHaveBeenCalled();
  });
});

describe("PromptInput — blob→data-url conversion on submit", () => {
  it("converts a blob: attachment to a data URL via FileReader (onloadend)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      // @ts-expect-error — minimal Response shape
      .mockResolvedValue({ blob: async () => new Blob(["data"]) });

    class FakeReader {
      result: string | null = null;
      onloadend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL() {
        this.result = "data:image/png;base64,AAAA";
        this.onloadend?.();
      }
    }
    const OrigReader = globalThis.FileReader;
    // @ts-expect-error — swap in fake reader
    globalThis.FileReader = FakeReader;

    try {
      render(<FullPrompt onSubmit={onSubmit} />);
      const fileInput = screen.getByLabelText(
        "Upload files"
      ) as HTMLInputElement;
      await user.upload(fileInput, makeFile("p.png", "image/png"));
      await waitFor(() => screen.getByText("p.png"));
      await user.type(screen.getByRole("textbox"), "hey");
      await user.click(screen.getByRole("button", { name: "Submit" }));
      await waitFor(() => expect(onSubmit).toHaveBeenCalled());
      const msg = onSubmit.mock.calls[0][0] as PromptInputMessage;
      expect(msg.files[0].url).toBe("data:image/png;base64,AAAA");
    } finally {
      fetchSpy.mockRestore();
      globalThis.FileReader = OrigReader;
    }
  });

  it("keeps the blob URL when FileReader errors (onerror → null)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      // @ts-expect-error — minimal Response shape
      .mockResolvedValue({ blob: async () => new Blob(["data"]) });

    class FakeReader {
      result: string | null = null;
      onloadend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL() {
        this.onerror?.();
      }
    }
    const OrigReader = globalThis.FileReader;
    // @ts-expect-error — swap in fake reader
    globalThis.FileReader = FakeReader;

    try {
      render(<FullPrompt onSubmit={onSubmit} />);
      const fileInput = screen.getByLabelText(
        "Upload files"
      ) as HTMLInputElement;
      await user.upload(fileInput, makeFile("p.png", "image/png"));
      await waitFor(() => screen.getByText("p.png"));
      await user.type(screen.getByRole("textbox"), "hey");
      await user.click(screen.getByRole("button", { name: "Submit" }));
      await waitFor(() => expect(onSubmit).toHaveBeenCalled());
      const msg = onSubmit.mock.calls[0][0] as PromptInputMessage;
      // Conversion failed → original blob URL is preserved.
      expect(msg.files[0].url).toMatch(/^blob:/);
    } finally {
      fetchSpy.mockRestore();
      globalThis.FileReader = OrigReader;
    }
  });
});

describe("PromptInputSpeechButton — error handler", () => {
  it("logs and stops listening when recognition reports an error", async () => {
    const start = vi.fn();
    let instance: Record<string, unknown> = {};
    class FakeSR {
      continuous = false;
      interimResults = false;
      lang = "";
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onresult: ((e: unknown) => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      start = () => {
        start();
        this.onstart?.();
      };
      stop = () => {
        this.onend?.();
      };
      constructor() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        instance = this as unknown as Record<string, unknown>;
      }
    }
    // @ts-expect-error — define test global
    window.SpeechRecognition = FakeSR;
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
        <PromptInputSpeechButton />
      </PromptInput>
    );
    const btn = screen.getByRole("button");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    React.act(() => {
      (instance.onerror as (e: unknown) => void)?.({ error: "no-speech" });
    });
    expect(errorSpy).toHaveBeenCalledWith(
      "Speech recognition error:",
      "no-speech"
    );
    expect(btn).toHaveAttribute("aria-pressed", "false");
    errorSpy.mockRestore();
    // @ts-expect-error — cleanup
    delete window.SpeechRecognition;
  });
});

// ---------------------------------------------------------------------------
// 18. Branch coverage — attachment label/alt fallbacks (empty filename)
// ---------------------------------------------------------------------------

describe("PromptInputAttachment — empty-filename fallbacks", () => {
  // Render an attachment chip with caller-controlled `data`, so we can drive the
  // `filename || …` / `isImage ? "Image" : "Attachment"` fallbacks directly.
  function ChipHarness({
    data,
  }: {
    data: { id: string; type: "file"; url?: string; mediaType?: string; filename?: string };
  }) {
    return (
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          {/* @ts-expect-error — partial FileUIPart is intentional for fallbacks */}
          <PromptInputAttachment data={data} />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
  }

  it("non-image attachment with no filename shows the 'Attachment' label", () => {
    render(
      <ChipHarness
        data={{ id: "1", type: "file", mediaType: "application/pdf", url: "blob:x" }}
      />
    );
    // filename "" → attachmentLabel falls back; isImage false → "Attachment"
    expect(screen.getByText("Attachment")).toBeInTheDocument();
  });

  it("image attachment with no filename shows the 'Image' label + alt='attachment'", () => {
    const { container } = render(
      <ChipHarness
        data={{ id: "2", type: "file", mediaType: "image/png", url: "blob:y" }}
      />
    );
    // isImage true (mediaType image/* AND url present), filename "" → "Image"
    expect(screen.getByText("Image")).toBeInTheDocument();
    // img alt falls back to "attachment" (L317 false side)
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("attachment");
  });

  it("image/* mediaType but NO url is treated as a file (paperclip), not image", () => {
    const { container } = render(
      <ChipHarness data={{ id: "3", type: "file", mediaType: "image/png" }} />
    );
    // data.url falsy → mediaType resolves to "file" → paperclip, no <img>
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("Attachment")).toBeInTheDocument();
  });

  it("non-image, no-filename hover preview falls back to 'Attachment' (no mediaType line)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      // No mediaType at all → the `data.mediaType && …` <p> is skipped (L368 false)
      <ChipHarness data={{ id: "4", type: "file", url: "blob:z" }} />
    );
    const chip = container.querySelector(
      "[data-slot='prompt-input-attachment']"
    ) as HTMLElement;
    await user.hover(chip);
    // The hover card heading uses the same `filename || (isImage ? … : "Attachment")`
    // fallback (L366). Two "Attachment" texts now (chip + preview heading).
    await waitFor(() =>
      expect(screen.getAllByText("Attachment").length).toBeGreaterThanOrEqual(2)
    );
  });

  it("image, no-filename hover preview uses alt='attachment preview' + 'Image' heading", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ChipHarness
        data={{ id: "5", type: "file", mediaType: "image/png", url: "blob:w" }}
      />
    );
    const chip = container.querySelector(
      "[data-slot='prompt-input-attachment']"
    ) as HTMLElement;
    await user.hover(chip);
    await waitFor(() =>
      expect(
        document.querySelector("img[alt='attachment preview']")
      ).toBeInTheDocument()
    );
    // heading also resolves to "Image" via the isImage branch (L366 true side)
    expect(screen.getAllByText("Image").length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// 19. Branch coverage — accept exact-match (no trailing /*)
// ---------------------------------------------------------------------------

describe("PromptInput — accept exact mime match", () => {
  it("accepts a file whose type exactly equals a non-wildcard accept pattern", async () => {
    const onError = vi.fn();
    const user = userEvent.setup({ applyAccept: false });
    render(
      <PromptInput accept="image/png" onError={onError} onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    // Exact-match path: pattern "image/png" has no "/*", so f.type === pattern.
    await user.upload(fileInput, makeFile("ok.png", "image/png"));
    await waitFor(() => expect(screen.getByText("ok.png")).toBeInTheDocument());
    expect(onError).not.toHaveBeenCalled();
  });

  it("rejects a file whose type does not equal a non-wildcard accept pattern", async () => {
    const onError = vi.fn();
    const user = userEvent.setup({ applyAccept: false });
    render(
      <PromptInput accept="image/png" onError={onError} onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("nope.jpg", "image/jpeg"));
    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ code: "accept" })
      )
    );
  });
});

// ---------------------------------------------------------------------------
// 20. Branch coverage — provider/local remove + clear with missing ids/urls
// ---------------------------------------------------------------------------

describe("PromptInput — remove/clear edge cases", () => {
  it("provider remove(unknown-id) is a no-op (found undefined, no revoke)", () => {
    let api: ReturnType<typeof useProviderAttachments> | null = null;
    function Probe() {
      api = useProviderAttachments();
      return <span>n:{api.files.length}</span>;
    }
    render(
      <PromptInputProvider>
        <Probe />
      </PromptInputProvider>
    );
    React.act(() => {
      api!.add([makeFile("a.png", "image/png")]);
    });
    expect(screen.getByText("n:1")).toBeInTheDocument();
    // found?.url short-circuits when id is not present (found === undefined).
    React.act(() => api!.remove("does-not-exist"));
    expect(screen.getByText("n:1")).toBeInTheDocument();
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it("local remove(unknown-id) is a no-op (found undefined)", async () => {
    const user = userEvent.setup();
    let attApi: ReturnType<typeof usePromptInputAttachments> | null = null;
    function Probe() {
      attApi = usePromptInputAttachments();
      return null;
    }
    render(
      <PromptInput onSubmit={() => {}}>
        <Probe />
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("keep.png", "image/png"));
    await waitFor(() => screen.getByText("keep.png"));
    React.act(() => attApi!.remove("missing"));
    expect(screen.getByText("keep.png")).toBeInTheDocument();
  });

  it("provider clear with a url-less file skips revoke (f.url false branch)", () => {
    // Force createObjectURL to return an empty string so the stored file has a
    // falsy url, exercising the `if (f.url)` false branch in clear()/unmount.
    (global.URL.createObjectURL as ReturnType<typeof vi.fn>).mockReturnValue("");
    let api: ReturnType<typeof useProviderAttachments> | null = null;
    function Probe() {
      api = useProviderAttachments();
      return <span>n:{api.files.length}</span>;
    }
    render(
      <PromptInputProvider>
        <Probe />
      </PromptInputProvider>
    );
    React.act(() => {
      api!.add([makeFile("u.png", "image/png")]);
    });
    expect(screen.getByText("n:1")).toBeInTheDocument();
    React.act(() => api!.clear());
    expect(screen.getByText("n:0")).toBeInTheDocument();
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it("local clear with a url-less file skips revoke; unmount cleanup too", async () => {
    (global.URL.createObjectURL as ReturnType<typeof vi.fn>).mockReturnValue("");
    const user = userEvent.setup();
    let attApi: ReturnType<typeof usePromptInputAttachments> | null = null;
    function Probe() {
      attApi = usePromptInputAttachments();
      return null;
    }
    const { unmount } = render(
      <PromptInput onSubmit={() => {}}>
        <Probe />
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("nourl.png", "image/png"));
    await waitFor(() => expect(attApi!.files.length).toBe(1));
    React.act(() => attApi!.clear());
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
    unmount();
  });

  it("LOCAL unmount cleanup skips revoke for url-less files (no clear first)", async () => {
    (global.URL.createObjectURL as ReturnType<typeof vi.fn>).mockReturnValue("");
    const user = userEvent.setup();
    let attApi: ReturnType<typeof usePromptInputAttachments> | null = null;
    function Probe() {
      attApi = usePromptInputAttachments();
      return null;
    }
    const { unmount } = render(
      <PromptInput onSubmit={() => {}}>
        <Probe />
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("leak.png", "image/png"));
    await waitFor(() => expect(attApi!.files.length).toBe(1));
    // Unmount WHILE the url-less file is still present → cleanup loop runs its
    // `if (f.url)` false side for the local (non-provider) cleanup effect.
    unmount();
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it("PROVIDER unmount cleanup skips revoke for url-less files (no clear first)", () => {
    (global.URL.createObjectURL as ReturnType<typeof vi.fn>).mockReturnValue("");
    let api: ReturnType<typeof useProviderAttachments> | null = null;
    function Probe() {
      api = useProviderAttachments();
      return <span>n:{api.files.length}</span>;
    }
    const { unmount } = render(
      <PromptInputProvider>
        <Probe />
      </PromptInputProvider>
    );
    React.act(() => {
      api!.add([makeFile("p.png", "image/png")]);
    });
    expect(screen.getByText("n:1")).toBeInTheDocument();
    // Unmount with the url-less file still present → provider cleanup effect's
    // `if (f.url)` false side.
    unmount();
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 21. Branch coverage — drop/dragover guards (no Files, no files)
// ---------------------------------------------------------------------------

describe("PromptInput — drop/dragover guard branches", () => {
  function fireEvt(
    target: EventTarget,
    name: string,
    dataTransfer: unknown
  ): Event {
    const evt = new Event(name, { bubbles: true, cancelable: true });
    // @ts-expect-error — fake dataTransfer
    evt.dataTransfer = dataTransfer;
    React.act(() => {
      target.dispatchEvent(evt);
    });
    return evt;
  }

  it("form dragover WITHOUT Files does not preventDefault", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const form = container.querySelector(
      "[data-slot='prompt-input']"
    ) as HTMLFormElement;
    const evt = fireEvt(form, "dragover", { types: ["text/plain"] });
    expect(evt.defaultPrevented).toBe(false);
  });

  it("form drop WITHOUT Files in types and with empty files is a no-op", () => {
    const onError = vi.fn();
    const { container } = render(
      <PromptInput onError={onError} onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const form = container.querySelector(
      "[data-slot='prompt-input']"
    ) as HTMLFormElement;
    // types lacks "Files" (first guard false) AND files empty (second guard false)
    const evt = fireEvt(form, "drop", { types: ["text/plain"], files: [] });
    expect(evt.defaultPrevented).toBe(false);
    expect(
      container.querySelector("[data-slot='prompt-input-attachments']")
    ).toBeNull();
  });

  it("globalDrop dragover WITHOUT Files does not preventDefault", () => {
    render(
      <PromptInput globalDrop onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const evt = fireEvt(document, "dragover", { types: ["text/plain"] });
    expect(evt.defaultPrevented).toBe(false);
  });

  it("globalDrop drop WITHOUT Files and empty files is a no-op", () => {
    const { container } = render(
      <PromptInput globalDrop onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const evt = fireEvt(document, "drop", { types: ["text/plain"], files: [] });
    expect(evt.defaultPrevented).toBe(false);
    expect(
      container.querySelector("[data-slot='prompt-input-attachments']")
    ).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 22. Branch coverage — file input onChange with null files
// ---------------------------------------------------------------------------

describe("PromptInput — file input change guard", () => {
  it("change event with no files does not add attachments", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    // jsdom gives an empty (but truthy) FileList by default; force `.files` to
    // null so the `if (event.currentTarget.files)` guard takes its false side.
    Object.defineProperty(fileInput, "files", {
      configurable: true,
      get: () => null,
    });
    React.act(() => {
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(
      container.querySelector("[data-slot='prompt-input-attachments']")
    ).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 23. Branch coverage — submit text fallback + provider sync clear + non-blob url
// ---------------------------------------------------------------------------

describe("PromptInput — submit branch coverage", () => {
  it("uncontrolled submit with no message field uses '' fallback", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    // No PromptInputTextarea → FormData has no "message"; formData.get returns
    // null → `|| ""` fallback path (L737 false side).
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputSubmit />
      </PromptInput>
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({ text: "", files: [] });
  });

  it("sync onSubmit inside a provider clears the controller input", async () => {
    const onSubmit = vi.fn(); // returns undefined (sync) → sync clear branch
    const user = userEvent.setup();
    render(
      <PromptInputProvider initialInput="draft">
        <PromptInput onSubmit={onSubmit}>
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInput>
      </PromptInputProvider>
    );
    const ta = screen.getByRole("textbox");
    expect(ta).toHaveValue("draft");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    // Sync path: usingProvider true → controller.textInput.clear() (L779 true).
    await waitFor(() => expect(ta).toHaveValue(""));
  });

  it("async onSubmit WITHOUT a provider resolves and clears attachments", async () => {
    let resolve: (() => void) | undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        })
    );
    const user = userEvent.setup();
    // Use a data: URL for the attachment so the blob→data-url conversion (and a
    // real fetch() of the blob URL, which would settle late after the test) is
    // skipped. No provider → on async resolve, `if (usingProvider)` takes its
    // false side (only clear() runs, no controller.textInput.clear()).
    (global.URL.createObjectURL as ReturnType<typeof vi.fn>).mockReturnValue(
      "data:image/png;base64,QQQ"
    );
    render(<FullPrompt onSubmit={onSubmit} />);
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("a.png", "image/png"));
    await waitFor(() => screen.getByText("a.png"));
    await user.type(screen.getByRole("textbox"), "hi");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    React.act(() => resolve!());
    // Attachment chip is cleared once the async submit resolves.
    await waitFor(() =>
      expect(screen.queryByText("a.png")).not.toBeInTheDocument()
    );
  });

  it("submit keeps a non-blob (data) url unchanged (skips conversion)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    // createObjectURL returns a data: URL so the stored attachment is not blob:,
    // exercising the `item.url.startsWith("blob:")` false branch.
    (global.URL.createObjectURL as ReturnType<typeof vi.fn>).mockReturnValue(
      "data:image/png;base64,ZZZ"
    );
    render(<FullPrompt onSubmit={onSubmit} />);
    const fileInput = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(fileInput, makeFile("d.png", "image/png"));
    await waitFor(() => screen.getByText("d.png"));
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const msg = onSubmit.mock.calls[0][0] as PromptInputMessage;
    expect(msg.files[0].url).toBe("data:image/png;base64,ZZZ");
  });
});

// ---------------------------------------------------------------------------
// 24. Branch coverage — paste guards (null getAsFile, no files)
// ---------------------------------------------------------------------------

describe("PromptInputTextarea — paste guards", () => {
  it("paste of file-kind items that all return null adds nothing", () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(f) => <PromptInputAttachment data={f} />}
          </PromptInputAttachments>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    const ta = screen.getByRole("textbox");
    const preventDefault = vi.fn();
    React.act(() => {
      ta.dispatchEvent(
        Object.assign(new Event("paste", { bubbles: true, cancelable: true }), {
          clipboardData: {
            // kind "file" but getAsFile returns null → `if (file)` false side,
            // and files stays empty → `if (files.length > 0)` false side.
            items: [{ kind: "file", getAsFile: () => null }],
          },
          preventDefault,
        })
      );
    });
    expect(preventDefault).not.toHaveBeenCalled();
    expect(
      container.querySelector("[data-slot='prompt-input-attachments']")
    ).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 25. Branch coverage — SpeechRecognition webkit fallback + result branches
// ---------------------------------------------------------------------------

describe("PromptInputSpeechButton — recognition branches", () => {
  function makeFakeSR(captured: { instance?: Record<string, unknown> }) {
    return class FakeSR {
      continuous = false;
      interimResults = false;
      lang = "";
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onresult: ((e: unknown) => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      start = () => this.onstart?.();
      stop = () => this.onend?.();
      constructor() {
        captured.instance = this as unknown as Record<string, unknown>;
      }
    };
  }

  it("uses webkitSpeechRecognition when only the prefixed global exists", () => {
    const captured: { instance?: Record<string, unknown> } = {};
    // Only webkit-prefixed present → `SpeechRecognition || webkit…` right side.
    // @ts-expect-error — define test global
    window.webkitSpeechRecognition = makeFakeSR(captured);
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
        <PromptInputSpeechButton />
      </PromptInput>
    );
    // Button is enabled because a recognition instance was constructed.
    expect(screen.getByRole("button")).not.toBeDisabled();
    expect(captured.instance).toBeDefined();
    // @ts-expect-error — cleanup
    delete window.webkitSpeechRecognition;
  });

  it("ignores non-final results and missing transcripts; appends with a space", async () => {
    const captured: { instance?: Record<string, unknown> } = {};
    // @ts-expect-error — define test global
    window.SpeechRecognition = makeFakeSR(captured);
    const onTranscriptionChange = vi.fn();
    const textareaRef = React.createRef<HTMLTextAreaElement>();
    const user = userEvent.setup();
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea ref={textareaRef} />
        <PromptInputSpeechButton
          textareaRef={textareaRef}
          onTranscriptionChange={onTranscriptionChange}
        />
      </PromptInput>
    );
    await user.click(screen.getByRole("button"));
    // Seed existing textarea value so the `currentValue ? " " : ""` true side runs.
    React.act(() => {
      textareaRef.current!.value = "existing";
    });
    React.act(() => {
      (captured.instance!.onresult as (e: unknown) => void)({
        resultIndex: 0,
        results: {
          length: 2,
          // non-final result → `if (result.isFinal)` false side
          0: { isFinal: false, 0: { transcript: "skip" } },
          // final result with missing alternative → `?? ""` fallback (transcript undefined)
          1: { isFinal: true, 0: {} },
        },
      });
    });
    // final transcript === "" (undefined ?? "") → `if (finalTranscript && …)` false
    expect(onTranscriptionChange).not.toHaveBeenCalled();

    // Now a real final transcript with existing text → appends with a space.
    React.act(() => {
      (captured.instance!.onresult as (e: unknown) => void)({
        resultIndex: 0,
        results: {
          length: 1,
          0: { isFinal: true, 0: { transcript: "world" } },
        },
      });
    });
    expect(onTranscriptionChange).toHaveBeenCalledWith("existing world");
    // @ts-expect-error — cleanup
    delete window.SpeechRecognition;
  });

  it("final transcript without a textareaRef does not write/notify", async () => {
    const captured: { instance?: Record<string, unknown> } = {};
    // @ts-expect-error — define test global
    window.SpeechRecognition = makeFakeSR(captured);
    const onTranscriptionChange = vi.fn();
    const user = userEvent.setup();
    // No textareaRef passed → `textareaRef?.current` is undefined (L1213 false).
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTextarea />
        <PromptInputSpeechButton onTranscriptionChange={onTranscriptionChange} />
      </PromptInput>
    );
    await user.click(screen.getByRole("button"));
    React.act(() => {
      (captured.instance!.onresult as (e: unknown) => void)({
        resultIndex: 0,
        results: { length: 1, 0: { isFinal: true, 0: { transcript: "hi" } } },
      });
    });
    expect(onTranscriptionChange).not.toHaveBeenCalled();
    // @ts-expect-error — cleanup
    delete window.SpeechRecognition;
  });

  // Note: the `if (!recognition) return;` guard in toggleListening (the false
  // side of the !recognition check, i.e. when recognition is null) is not
  // reachable through the public UI: the button is `disabled` exactly when
  // recognition is null, so React never dispatches its onClick. Left uncovered.
});
