/**
 * Exhaustive tests for the Confirmation compound component (AI Elements).
 *
 * Component source: components/ai-elements/confirmation.tsx
 *
 * Exports:
 *   Confirmation          – root, gated on `approval` + `state`; provides context; renders an Alert
 *   ConfirmationTitle     – AlertDescription wrapper, data-slot="confirmation-title"
 *   ConfirmationRequest   – renders children only while state === "approval-requested"
 *   ConfirmationAccepted  – renders children when approved + a response state
 *   ConfirmationRejected  – renders children when rejected + a response state
 *   ConfirmationActions   – action row, only while state === "approval-requested"
 *   ConfirmationAction    – Button (size="sm", type="button"), data-slot="confirmation-action"
 *
 * State is typed as ToolUIPart["state"] but the v6 approval states
 * ("approval-requested" | "approval-responded" | "output-denied") are not in
 * the v5 union, so tests cast through `as never` / `as ToolState`.
 */

import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

import {
  Confirmation,
  ConfirmationTitle,
  ConfirmationRequest,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationActions,
  ConfirmationAction,
} from "@/components/ai-elements/confirmation";

// Loosen the state type so we can exercise the v6 approval states the
// component branches on (they are not part of the v5 ToolUIPart union).
type ToolState = React.ComponentProps<typeof Confirmation>["state"];
const stateOf = (s: string) => s as unknown as ToolState;

const REQUEST = stateOf("approval-requested");
const RESPONDED = stateOf("approval-responded");
const OUTPUT_AVAILABLE = stateOf("output-available");
const OUTPUT_DENIED = stateOf("output-denied");

const approvedApproval = { id: "t1", approved: true } as const;
const rejectedApproval = { id: "t1", approved: false } as const;
const pendingApproval = { id: "t1" } as const;

// ---------------------------------------------------------------------------
// 1. Confirmation root — gating logic (every early-return branch)
// ---------------------------------------------------------------------------

describe("Confirmation — gating", () => {
  it("renders nothing when approval is undefined", () => {
    const { container } = render(
      <Confirmation approval={undefined} state={REQUEST}>
        <ConfirmationTitle>Hidden</ConfirmationTitle>
      </Confirmation>
    );
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("renders nothing when state is 'input-streaming'", () => {
    const { container } = render(
      <Confirmation approval={pendingApproval} state={stateOf("input-streaming")}>
        <ConfirmationTitle>Hidden</ConfirmationTitle>
      </Confirmation>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when state is 'input-available'", () => {
    const { container } = render(
      <Confirmation approval={pendingApproval} state={stateOf("input-available")}>
        <ConfirmationTitle>Hidden</ConfirmationTitle>
      </Confirmation>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders the Alert when approval is present and state is allowed", () => {
    render(
      <Confirmation approval={pendingApproval} state={REQUEST}>
        <ConfirmationTitle>Shown</ConfirmationTitle>
      </Confirmation>
    );
    expect(screen.getByText("Shown")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. Confirmation root — structure, slot, classes, forwarding
// ---------------------------------------------------------------------------

describe("Confirmation — root element", () => {
  function renderRoot(props?: Partial<React.ComponentProps<typeof Confirmation>>) {
    return render(
      <Confirmation approval={pendingApproval} state={REQUEST} {...props}>
        <ConfirmationTitle>Body</ConfirmationTitle>
      </Confirmation>
    );
  }

  it("has data-slot='confirmation'", () => {
    const { container } = renderRoot();
    expect(
      container.querySelector("[data-slot='confirmation']")
    ).toBeInTheDocument();
  });

  it("is built on Alert (role='alert')", () => {
    renderRoot();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("has flex flex-col gap-2 base classes", () => {
    const { container } = renderRoot();
    const root = container.querySelector(
      "[data-slot='confirmation']"
    ) as HTMLElement;
    expect(root.className).toContain("flex");
    expect(root.className).toContain("flex-col");
    expect(root.className).toContain("gap-2");
  });

  it("uses the immersive edge (no hard border-border)", () => {
    const { container } = renderRoot();
    const root = container.querySelector(
      "[data-slot='confirmation']"
    ) as HTMLElement;
    expect(root.className).toContain("edge");
    expect(root.className).not.toContain("border-border");
  });

  it("forwards custom className, merging with base classes", () => {
    const { container } = renderRoot({ className: "my-confirmation" });
    const root = container.querySelector(
      "[data-slot='confirmation']"
    ) as HTMLElement;
    expect(root.className).toContain("my-confirmation");
    expect(root.className).toContain("flex-col");
  });

  it("forwards arbitrary HTML attributes (id, data-testid)", () => {
    const { container } = renderRoot({
      id: "confirm-1",
      "data-testid": "confirm",
    } as never);
    const root = container.querySelector("[data-slot='confirmation']");
    expect(root).toHaveAttribute("id", "confirm-1");
    expect(root).toHaveAttribute("data-testid", "confirm");
  });

  it("supports the Alert 'destructive' variant", () => {
    const { container } = render(
      <Confirmation
        approval={pendingApproval}
        state={REQUEST}
        variant="destructive"
      >
        <ConfirmationTitle>Danger</ConfirmationTitle>
      </Confirmation>
    );
    const root = container.querySelector(
      "[data-slot='confirmation']"
    ) as HTMLElement;
    expect(root.className).toContain("text-destructive");
  });
});

// ---------------------------------------------------------------------------
// 3. ConfirmationTitle
// ---------------------------------------------------------------------------

describe("ConfirmationTitle", () => {
  function renderTitle(props?: Partial<React.ComponentProps<typeof ConfirmationTitle>>) {
    return render(
      <Confirmation approval={pendingApproval} state={REQUEST}>
        <ConfirmationTitle {...props}>Run shell command?</ConfirmationTitle>
      </Confirmation>
    );
  }

  it("renders its children", () => {
    renderTitle();
    expect(screen.getByText("Run shell command?")).toBeInTheDocument();
  });

  it("has data-slot='confirmation-title'", () => {
    const { container } = renderTitle();
    expect(
      container.querySelector("[data-slot='confirmation-title']")
    ).toBeInTheDocument();
  });

  it("has 'inline' display class", () => {
    const { container } = renderTitle();
    const title = container.querySelector(
      "[data-slot='confirmation-title']"
    ) as HTMLElement;
    expect(title.className).toContain("inline");
  });

  it("uses foreground text (not muted) for legibility", () => {
    const { container } = renderTitle();
    const title = container.querySelector(
      "[data-slot='confirmation-title']"
    ) as HTMLElement;
    expect(title.className).toContain("text-foreground");
  });

  it("is not bold (editorial typography)", () => {
    const { container } = renderTitle();
    const title = container.querySelector(
      "[data-slot='confirmation-title']"
    ) as HTMLElement;
    expect(title.className).not.toContain("font-bold");
    expect(title.className).not.toContain("font-semibold");
  });

  it("forwards custom className", () => {
    const { container } = renderTitle({ className: "my-title" });
    const title = container.querySelector(
      "[data-slot='confirmation-title']"
    ) as HTMLElement;
    expect(title.className).toContain("my-title");
  });

  it("forwards HTML attributes", () => {
    const { container } = renderTitle({ id: "title-1" } as never);
    expect(
      container.querySelector("[data-slot='confirmation-title']")
    ).toHaveAttribute("id", "title-1");
  });
});

// ---------------------------------------------------------------------------
// 4. ConfirmationRequest — visible only while requesting
// ---------------------------------------------------------------------------

describe("ConfirmationRequest", () => {
  it("renders children when state is 'approval-requested'", () => {
    render(
      <Confirmation approval={pendingApproval} state={REQUEST}>
        <ConfirmationRequest>
          <span>Please decide</span>
        </ConfirmationRequest>
      </Confirmation>
    );
    expect(screen.getByText("Please decide")).toBeInTheDocument();
  });

  it("renders nothing when state is a response state", () => {
    render(
      <Confirmation approval={approvedApproval} state={RESPONDED}>
        <ConfirmationRequest>
          <span>Please decide</span>
        </ConfirmationRequest>
      </Confirmation>
    );
    expect(screen.queryByText("Please decide")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. ConfirmationAccepted — approved + response state
// ---------------------------------------------------------------------------

describe("ConfirmationAccepted", () => {
  const child = <span>Approved!</span>;

  function renderAccepted(
    approval: React.ComponentProps<typeof Confirmation>["approval"],
    state: ToolState
  ) {
    return render(
      <Confirmation approval={approval} state={state}>
        <ConfirmationAccepted>{child}</ConfirmationAccepted>
      </Confirmation>
    );
  }

  it("renders when approved and state is 'approval-responded'", () => {
    renderAccepted(approvedApproval, RESPONDED);
    expect(screen.getByText("Approved!")).toBeInTheDocument();
  });

  it("renders when approved and state is 'output-available'", () => {
    renderAccepted(approvedApproval, OUTPUT_AVAILABLE);
    expect(screen.getByText("Approved!")).toBeInTheDocument();
  });

  it("renders when approved and state is 'output-denied'", () => {
    renderAccepted(approvedApproval, OUTPUT_DENIED);
    expect(screen.getByText("Approved!")).toBeInTheDocument();
  });

  it("renders nothing when not approved (rejected) even in a response state", () => {
    renderAccepted(rejectedApproval, RESPONDED);
    expect(screen.queryByText("Approved!")).not.toBeInTheDocument();
  });

  it("renders nothing when approved but state is still 'approval-requested'", () => {
    renderAccepted(approvedApproval, REQUEST);
    expect(screen.queryByText("Approved!")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. ConfirmationRejected — rejected + response state
// ---------------------------------------------------------------------------

describe("ConfirmationRejected", () => {
  const child = <span>Rejected!</span>;

  function renderRejected(
    approval: React.ComponentProps<typeof Confirmation>["approval"],
    state: ToolState
  ) {
    return render(
      <Confirmation approval={approval} state={state}>
        <ConfirmationRejected>{child}</ConfirmationRejected>
      </Confirmation>
    );
  }

  it("renders when rejected and state is 'approval-responded'", () => {
    renderRejected(rejectedApproval, RESPONDED);
    expect(screen.getByText("Rejected!")).toBeInTheDocument();
  });

  it("renders when rejected and state is 'output-available'", () => {
    renderRejected(rejectedApproval, OUTPUT_AVAILABLE);
    expect(screen.getByText("Rejected!")).toBeInTheDocument();
  });

  it("renders when rejected and state is 'output-denied'", () => {
    renderRejected(rejectedApproval, OUTPUT_DENIED);
    expect(screen.getByText("Rejected!")).toBeInTheDocument();
  });

  it("renders nothing when approved (not rejected) in a response state", () => {
    renderRejected(approvedApproval, RESPONDED);
    expect(screen.queryByText("Rejected!")).not.toBeInTheDocument();
  });

  it("renders nothing when approval is pending (approved undefined)", () => {
    renderRejected(pendingApproval, RESPONDED);
    expect(screen.queryByText("Rejected!")).not.toBeInTheDocument();
  });

  it("renders nothing when rejected but state is still 'approval-requested'", () => {
    renderRejected(rejectedApproval, REQUEST);
    expect(screen.queryByText("Rejected!")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. ConfirmationActions — action row
// ---------------------------------------------------------------------------

describe("ConfirmationActions", () => {
  it("renders children while state is 'approval-requested'", () => {
    const { container } = render(
      <Confirmation approval={pendingApproval} state={REQUEST}>
        <ConfirmationActions>
          <button type="button">Go</button>
        </ConfirmationActions>
      </Confirmation>
    );
    expect(
      container.querySelector("[data-slot='confirmation-actions']")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("renders nothing once state moves to a response state", () => {
    const { container } = render(
      <Confirmation approval={approvedApproval} state={RESPONDED}>
        <ConfirmationActions>
          <button type="button">Go</button>
        </ConfirmationActions>
      </Confirmation>
    );
    expect(
      container.querySelector("[data-slot='confirmation-actions']")
    ).not.toBeInTheDocument();
  });

  it("has the alignment classes (flex justify-end self-end)", () => {
    const { container } = render(
      <Confirmation approval={pendingApproval} state={REQUEST}>
        <ConfirmationActions>
          <button type="button">Go</button>
        </ConfirmationActions>
      </Confirmation>
    );
    const actions = container.querySelector(
      "[data-slot='confirmation-actions']"
    ) as HTMLElement;
    expect(actions.className).toContain("flex");
    expect(actions.className).toContain("justify-end");
    expect(actions.className).toContain("self-end");
  });

  it("forwards custom className", () => {
    const { container } = render(
      <Confirmation approval={pendingApproval} state={REQUEST}>
        <ConfirmationActions className="my-actions">
          <button type="button">Go</button>
        </ConfirmationActions>
      </Confirmation>
    );
    const actions = container.querySelector(
      "[data-slot='confirmation-actions']"
    ) as HTMLElement;
    expect(actions.className).toContain("my-actions");
  });

  it("forwards HTML attributes", () => {
    const { container } = render(
      <Confirmation approval={pendingApproval} state={REQUEST}>
        <ConfirmationActions data-testid="row">
          <button type="button">Go</button>
        </ConfirmationActions>
      </Confirmation>
    );
    expect(
      container.querySelector("[data-slot='confirmation-actions']")
    ).toHaveAttribute("data-testid", "row");
  });
});

// ---------------------------------------------------------------------------
// 8. ConfirmationAction — button
// ---------------------------------------------------------------------------

describe("ConfirmationAction", () => {
  function renderAction(
    props?: Partial<React.ComponentProps<typeof ConfirmationAction>>
  ) {
    return render(
      <Confirmation approval={pendingApproval} state={REQUEST}>
        <ConfirmationActions>
          <ConfirmationAction {...props}>Approve</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    );
  }

  it("renders a button with its label", () => {
    renderAction();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
  });

  it("has data-slot='confirmation-action'", () => {
    renderAction();
    expect(
      screen.getByRole("button", { name: "Approve" })
    ).toHaveAttribute("data-slot", "confirmation-action");
  });

  it("is type='button'", () => {
    renderAction();
    expect(screen.getByRole("button", { name: "Approve" })).toHaveAttribute(
      "type",
      "button"
    );
  });

  it("uses the small button size (h-8)", () => {
    renderAction();
    expect(
      screen.getByRole("button", { name: "Approve" }).className
    ).toContain("h-8");
  });

  it("fires onClick when clicked", async () => {
    const onClick = vi.fn();
    renderAction({ onClick });
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports button variants (outline)", () => {
    renderAction({ variant: "outline" });
    expect(
      screen.getByRole("button", { name: "Approve" }).className
    ).toContain("border-border");
  });

  it("forwards custom className", () => {
    renderAction({ className: "my-action" });
    expect(
      screen.getByRole("button", { name: "Approve" }).className
    ).toContain("my-action");
  });

  it("respects disabled", () => {
    renderAction({ disabled: true });
    expect(screen.getByRole("button", { name: "Approve" })).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// 9. useConfirmation guard — children outside a Confirmation throw
// ---------------------------------------------------------------------------

describe("Confirmation context guard", () => {
  it("throws when ConfirmationRequest is used outside Confirmation", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <ConfirmationRequest>
          <span>x</span>
        </ConfirmationRequest>
      )
    ).toThrow("Confirmation components must be used within Confirmation");
    spy.mockRestore();
  });

  it("throws when ConfirmationActions is used outside Confirmation", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <ConfirmationActions>
          <button type="button">x</button>
        </ConfirmationActions>
      )
    ).toThrow("Confirmation components must be used within Confirmation");
    spy.mockRestore();
  });

  it("throws when ConfirmationAccepted is used outside Confirmation", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <ConfirmationAccepted>
          <span>x</span>
        </ConfirmationAccepted>
      )
    ).toThrow("Confirmation components must be used within Confirmation");
    spy.mockRestore();
  });

  it("throws when ConfirmationRejected is used outside Confirmation", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <ConfirmationRejected>
          <span>x</span>
        </ConfirmationRejected>
      )
    ).toThrow("Confirmation components must be used within Confirmation");
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 10. Full flow / composition
// ---------------------------------------------------------------------------

describe("Confirmation — full composition flow", () => {
  function Full({
    approval,
    state,
  }: {
    approval: React.ComponentProps<typeof Confirmation>["approval"];
    state: ToolState;
  }) {
    return (
      <Confirmation approval={approval} state={state}>
        <ConfirmationTitle>
          Deploy <span className="font-mono">api-gateway</span>?
        </ConfirmationTitle>
        <ConfirmationRequest>
          <ConfirmationActions>
            <ConfirmationAction variant="outline">Reject</ConfirmationAction>
            <ConfirmationAction>Approve</ConfirmationAction>
          </ConfirmationActions>
        </ConfirmationRequest>
        <ConfirmationAccepted>
          <span>Deployment started</span>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <span>No changes made</span>
        </ConfirmationRejected>
      </Confirmation>
    );
  }

  it("shows actions and hides outcomes while requesting", () => {
    render(<Full approval={pendingApproval} state={REQUEST} />);
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
    expect(screen.queryByText("Deployment started")).not.toBeInTheDocument();
    expect(screen.queryByText("No changes made")).not.toBeInTheDocument();
  });

  it("shows the accepted outcome after approval", () => {
    render(<Full approval={approvedApproval} state={RESPONDED} />);
    expect(screen.getByText("Deployment started")).toBeInTheDocument();
    expect(screen.queryByText("No changes made")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Approve" })
    ).not.toBeInTheDocument();
  });

  it("shows the rejected outcome after rejection", () => {
    render(<Full approval={rejectedApproval} state={RESPONDED} />);
    expect(screen.getByText("No changes made")).toBeInTheDocument();
    expect(screen.queryByText("Deployment started")).not.toBeInTheDocument();
  });

  it("transitions from request to accepted on re-render", () => {
    const { rerender } = render(
      <Full approval={pendingApproval} state={REQUEST} />
    );
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    rerender(<Full approval={approvedApproval} state={RESPONDED} />);
    expect(screen.getByText("Deployment started")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Confirmation — accessibility (axe)", () => {
  it("requesting state has no axe violations", async () => {
    const { container } = render(
      <main>
        <Confirmation approval={pendingApproval} state={REQUEST}>
          <ConfirmationTitle>Run the deploy command?</ConfirmationTitle>
          <ConfirmationRequest>
            <ConfirmationActions>
              <ConfirmationAction variant="outline">Reject</ConfirmationAction>
              <ConfirmationAction>Approve</ConfirmationAction>
            </ConfirmationActions>
          </ConfirmationRequest>
        </Confirmation>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("accepted state has no axe violations", async () => {
    const { container } = render(
      <main>
        <Confirmation approval={approvedApproval} state={RESPONDED}>
          <ConfirmationTitle>Run the deploy command?</ConfirmationTitle>
          <ConfirmationAccepted>
            <p>Deployment started.</p>
          </ConfirmationAccepted>
        </Confirmation>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("rejected state has no axe violations", async () => {
    const { container } = render(
      <main>
        <Confirmation approval={rejectedApproval} state={RESPONDED}>
          <ConfirmationTitle>Run the deploy command?</ConfirmationTitle>
          <ConfirmationRejected>
            <p>No changes were made.</p>
          </ConfirmationRejected>
        </Confirmation>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
