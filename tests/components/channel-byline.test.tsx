import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { ChannelByline } from "@/components/channel-byline";

function getRoot() {
  return document.querySelector(
    '[data-slot="channel-byline"]'
  ) as HTMLElement;
}

function getIdentity() {
  return document.querySelector(
    '[data-slot="channel-byline-identity"]'
  ) as HTMLElement;
}

describe("ChannelByline", () => {
  it("renders the root data-slot and the channel name", () => {
    render(<ChannelByline name="Marques Brownlee" />);
    expect(getRoot()).toBeInTheDocument();
    expect(screen.getByText("Marques Brownlee")).toBeInTheDocument();
  });

  it("renders the identity and subscribe slots", () => {
    render(<ChannelByline name="Marques Brownlee" />);
    expect(getIdentity()).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="channel-byline-subscribe"]')
    ).toBeInTheDocument();
  });

  it("derives the avatar fallback from the first two name letters (uppercased)", () => {
    render(<ChannelByline name="marques brownlee" />);
    expect(screen.getByText("MA")).toBeInTheDocument();
  });

  it("renders the avatar with the image branch when avatarSrc is provided", () => {
    render(
      <ChannelByline name="Marques Brownlee" avatarSrc="https://x.test/a.jpg" />
    );
    // Base UI's AvatarImage only mounts after the image load event (never fires
    // in jsdom), so assert the avatar slot + fallback the avatarSrc branch renders.
    expect(document.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
    expect(screen.getByText("MA")).toBeInTheDocument();
  });

  it("renders the verified badge only when verified is true", () => {
    const { rerender } = render(<ChannelByline name="Marques Brownlee" />);
    expect(
      document.querySelector('[data-slot="verified-badge"]')
    ).not.toBeInTheDocument();

    rerender(<ChannelByline name="Marques Brownlee" verified />);
    expect(
      document.querySelector('[data-slot="verified-badge"]')
    ).toBeInTheDocument();
  });

  it("formats the subscriber count compactly", () => {
    render(<ChannelByline name="Marques Brownlee" subscriberCount={8600000} />);
    expect(screen.getByText("8.6M subscribers")).toBeInTheDocument();
  });

  it("omits the subscriber line when subscriberCount is undefined", () => {
    render(<ChannelByline name="Marques Brownlee" />);
    expect(screen.queryByText(/subscribers/i)).not.toBeInTheDocument();
  });

  it("renders the subscriber line for a zero count", () => {
    render(<ChannelByline name="Marques Brownlee" subscriberCount={0} />);
    expect(screen.getByText("0 subscribers")).toBeInTheDocument();
  });

  it("makes the identity a link when href is provided", () => {
    render(<ChannelByline name="Marques Brownlee" href="/channel/mkbhd" />);
    const identity = getIdentity();
    expect(identity.tagName).toBe("A");
    expect(identity).toHaveAttribute("href", "/channel/mkbhd");
  });

  it("renders the identity as a non-link when href is omitted", () => {
    render(<ChannelByline name="Marques Brownlee" />);
    const identity = getIdentity();
    expect(identity.tagName).not.toBe("A");
    expect(getRoot().querySelector("a")).toBeNull();
  });

  it("renders the SubscribeButton (unsubscribed by default)", () => {
    render(<ChannelByline name="Marques Brownlee" />);
    expect(
      screen.getByRole("button", { name: "Subscribe" })
    ).toBeInTheDocument();
  });

  it("forwards defaultSubscribed to the SubscribeButton", () => {
    render(<ChannelByline name="Marques Brownlee" defaultSubscribed />);
    expect(
      screen.getByRole("button", { name: /Subscribed/i })
    ).toBeInTheDocument();
  });

  it("respects the controlled subscribed prop", () => {
    render(<ChannelByline name="Marques Brownlee" subscribed />);
    expect(
      screen.getByRole("button", { name: /Subscribed/i })
    ).toBeInTheDocument();
  });

  it("clicking subscribe fires onSubscribedChange", async () => {
    const user = userEvent.setup();
    const onSubscribedChange = vi.fn();
    render(
      <ChannelByline
        name="Marques Brownlee"
        onSubscribedChange={onSubscribedChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(onSubscribedChange).toHaveBeenCalledWith(true);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Subscribed/i })
      ).toBeInTheDocument()
    );
  });

  it("renders the actions slot only when actions are provided", () => {
    const { rerender } = render(<ChannelByline name="Marques Brownlee" />);
    expect(
      document.querySelector('[data-slot="channel-byline-actions"]')
    ).not.toBeInTheDocument();

    rerender(
      <ChannelByline
        name="Marques Brownlee"
        actions={<button type="button">Join</button>}
      />
    );
    const slot = document.querySelector(
      '[data-slot="channel-byline-actions"]'
    ) as HTMLElement;
    expect(slot).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Join" })
    ).toBeInTheDocument();
  });

  it("merges className onto the root", () => {
    render(<ChannelByline name="Marques Brownlee" className="custom-x" />);
    expect(getRoot()).toHaveClass("custom-x");
  });

  it("spreads extra props onto the root", () => {
    render(<ChannelByline name="Marques Brownlee" data-testid="byline" />);
    expect(getRoot()).toHaveAttribute("data-testid", "byline");
  });

  it("has no axe violations (linked, full)", async () => {
    const { container } = render(
      <ChannelByline
        name="Marques Brownlee"
        avatarSrc="https://x.test/a.jpg"
        verified
        subscriberCount={8600000}
        href="/channel/mkbhd"
        actions={<button type="button">Join</button>}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (non-linked, minimal)", async () => {
    const { container } = render(<ChannelByline name="Marques Brownlee" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
