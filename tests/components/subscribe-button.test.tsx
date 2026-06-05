import * as React from "react";
import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";
import { axe } from "vitest-axe";

import {
  SubscribeButton,
  type NotificationLevel,
} from "@/components/ui/subscribe-button";

function getRoot() {
  return document.querySelector('[data-slot="subscribe-button"]') as HTMLElement;
}

async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /Subscribed/i }));
  await waitFor(() =>
    expect(
      screen.getByRole("menuitem", { name: "Personalized" })
    ).toBeInTheDocument()
  );
}

describe("SubscribeButton", () => {
  it("renders the Subscribe label by default (unsubscribed)", () => {
    render(<SubscribeButton />);
    expect(
      screen.getByRole("button", { name: "Subscribe" })
    ).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(<SubscribeButton label="Follow" />);
    expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument();
  });

  it("clicking subscribe toggles to the subscribed state and fires onSubscribedChange", async () => {
    const user = userEvent.setup();
    const onSubscribedChange = vi.fn();
    render(<SubscribeButton onSubscribedChange={onSubscribedChange} />);

    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(onSubscribedChange).toHaveBeenCalledWith(true);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Subscribed/i })
      ).toBeInTheDocument()
    );
  });

  it("uncontrolled subscribe works without an onSubscribedChange handler", async () => {
    const user = userEvent.setup();
    render(<SubscribeButton />);

    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Subscribed/i })
      ).toBeInTheDocument()
    );
  });

  it("respects the controlled subscribed prop (does not self-toggle)", async () => {
    const user = userEvent.setup();
    const onSubscribedChange = vi.fn();
    render(
      <SubscribeButton
        subscribed={false}
        onSubscribedChange={onSubscribedChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(onSubscribedChange).toHaveBeenCalledWith(true);
    // Still unsubscribed because the parent owns the state.
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("renders the subscribed state with a custom subscribedLabel", () => {
    render(
      <SubscribeButton defaultSubscribed subscribedLabel="Following" />
    );
    expect(
      screen.getByRole("button", { name: /Following/i })
    ).toBeInTheDocument();
  });

  it("opening the menu and selecting a notification level fires onNotificationChange (uncontrolled)", async () => {
    const user = userEvent.setup();
    const onNotificationChange = vi.fn();
    render(
      <SubscribeButton
        defaultSubscribed
        defaultNotification="all"
        onNotificationChange={onNotificationChange}
      />
    );

    await openMenu(user);
    await user.click(screen.getByRole("menuitem", { name: "None" }));

    expect(onNotificationChange).toHaveBeenCalledWith("none");
  });

  it("selects each notification level", async () => {
    for (const level of ["all", "personalized", "none"] as NotificationLevel[]) {
      const user = userEvent.setup();
      const onNotificationChange = vi.fn();
      const { unmount } = render(
        <SubscribeButton
          defaultSubscribed
          onNotificationChange={onNotificationChange}
        />
      );

      await openMenu(user);
      const name =
        level === "all" ? "All" : level === "none" ? "None" : "Personalized";
      await user.click(screen.getByRole("menuitem", { name }));

      expect(onNotificationChange).toHaveBeenCalledWith(level);
      unmount();
    }
  });

  it("respects the controlled notification prop", async () => {
    const user = userEvent.setup();
    const onNotificationChange = vi.fn();
    render(
      <SubscribeButton
        defaultSubscribed
        notification="all"
        onNotificationChange={onNotificationChange}
      />
    );

    await openMenu(user);
    await user.click(screen.getByRole("menuitem", { name: "Personalized" }));

    expect(onNotificationChange).toHaveBeenCalledWith("personalized");
  });

  it("selecting a level without a handler does not throw (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<SubscribeButton defaultSubscribed />);

    await openMenu(user);
    await user.click(screen.getByRole("menuitem", { name: "All" }));

    expect(
      screen.getByRole("button", { name: /Subscribed/i })
    ).toBeInTheDocument();
  });

  it("Unsubscribe item returns to the unsubscribed state and fires onSubscribedChange", async () => {
    const user = userEvent.setup();
    const onSubscribedChange = vi.fn();
    render(
      <SubscribeButton
        defaultSubscribed
        onSubscribedChange={onSubscribedChange}
      />
    );

    await openMenu(user);
    await user.click(screen.getByRole("menuitem", { name: "Unsubscribe" }));

    expect(onSubscribedChange).toHaveBeenCalledWith(false);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Subscribe" })
      ).toBeInTheDocument()
    );
  });

  it("controlled subscribed=true with Unsubscribe does not self-toggle", async () => {
    const user = userEvent.setup();
    const onSubscribedChange = vi.fn();
    render(
      <SubscribeButton
        subscribed={true}
        onSubscribedChange={onSubscribedChange}
      />
    );

    await openMenu(user);
    await user.click(screen.getByRole("menuitem", { name: "Unsubscribe" }));

    expect(onSubscribedChange).toHaveBeenCalledWith(false);
    expect(
      screen.getByRole("button", { name: /Subscribed/i })
    ).toBeInTheDocument();
  });

  it("merges className onto the root in both states", () => {
    const { rerender } = render(<SubscribeButton className="custom-x" />);
    expect(getRoot()).toHaveClass("custom-x");

    rerender(<SubscribeButton defaultSubscribed className="custom-x" />);
    expect(getRoot()).toHaveClass("custom-x");
  });

  it("a fully controlled instance round-trips through a parent", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [subscribed, setSubscribed] = useState(false);
      const [level, setLevel] = useState<NotificationLevel>("personalized");
      return (
        <SubscribeButton
          subscribed={subscribed}
          onSubscribedChange={setSubscribed}
          notification={level}
          onNotificationChange={setLevel}
        />
      );
    }

    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Subscribed/i })
      ).toBeInTheDocument()
    );

    await openMenu(user);
    await user.click(screen.getByRole("menuitem", { name: "None" }));

    await user.click(screen.getByRole("button", { name: /Subscribed/i }));
    await waitFor(() =>
      expect(
        screen.getByRole("menuitem", { name: "None" })
      ).toBeInTheDocument()
    );
  });

  it("has no axe violations (unsubscribed)", async () => {
    const { container } = render(<SubscribeButton />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (subscribed)", async () => {
    const { container } = render(<SubscribeButton defaultSubscribed />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
