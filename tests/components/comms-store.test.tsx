/**
 * Tests for the comms-store fake messaging backend (lib/comms-store.tsx).
 * Exercises every action + the realtime feed so the swappable boundary is solid.
 */

import * as React from "react";
import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, afterEach } from "vitest";

import {
  MessagesProvider,
  useMessages,
  useMessagesActions,
  seedSource,
  type Contact,
} from "@/lib/comms-store";

function setup(props: Partial<React.ComponentProps<typeof MessagesProvider>> = {}) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MessagesProvider latencyMs={0} {...props}>
      {children}
    </MessagesProvider>
  );
  return renderHook(() => ({ data: useMessages(), actions: useMessagesActions() }), { wrapper });
}

const contact: Contact = { id: "x", name: "New Person", handle: "+1 555 000 0000", avatarSeed: "new-person" };

afterEach(() => vi.restoreAllMocks());

describe("comms-store", () => {
  it("seeds conversations sorted by updatedAt (newest first)", () => {
    const { result } = setup();
    const convs = result.current.data.conversations;
    expect(convs.length).toBeGreaterThan(0);
    for (let i = 1; i < convs.length; i++) {
      expect(convs[i - 1].updatedAt).toBeGreaterThanOrEqual(convs[i].updatedAt);
    }
  });

  it("accepts a custom source", () => {
    const src = seedSource();
    const { result } = setup({ source: src });
    expect(result.current.data.conversations).toHaveLength(src.conversations.length);
  });

  it("markRead zeroes unread and clears the unread flag", () => {
    const { result } = setup();
    act(() => result.current.actions.markRead("v3"));
    const c = result.current.data.conversations.find((x) => x.id === "v3")!;
    expect(c.unread).toBe(0);
    expect(c.flags).not.toContain("unread");
  });

  it("markUnread sets unread + flag", () => {
    const { result } = setup();
    act(() => result.current.actions.markUnread("v2"));
    const c = result.current.data.conversations.find((x) => x.id === "v2")!;
    expect(c.unread).toBe(1);
    expect(c.flags).toContain("unread");
  });

  it("toggleFlag adds then removes a flag", () => {
    const { result } = setup();
    act(() => result.current.actions.toggleFlag("v2", "pinned"));
    expect(result.current.data.conversations.find((x) => x.id === "v2")!.flags).toContain("pinned");
    act(() => result.current.actions.toggleFlag("v2", "pinned"));
    expect(result.current.data.conversations.find((x) => x.id === "v2")!.flags).not.toContain("pinned");
  });

  it("archive adds the archived flag (idempotent)", () => {
    const { result } = setup();
    act(() => result.current.actions.archive("v2"));
    act(() => result.current.actions.archive("v2"));
    expect(result.current.data.conversations.find((x) => x.id === "v2")!.flags).toContain("archived");
  });

  it("remove drops the conversation and clears active if it was active", () => {
    const { result } = setup();
    act(() => result.current.actions.setActive("v4"));
    act(() => result.current.actions.remove("v4"));
    expect(result.current.data.conversations.find((x) => x.id === "v4")).toBeUndefined();
    expect(result.current.data.activeId).toBeNull();
  });

  it("bulk applies read / archive / remove", () => {
    const { result } = setup();
    act(() => result.current.actions.bulk(["v1"], "read"));
    expect(result.current.data.conversations.find((x) => x.id === "v1")!.unread).toBe(0);
    act(() => result.current.actions.bulk(["v2"], "archive"));
    expect(result.current.data.conversations.find((x) => x.id === "v2")!.flags).toContain("archived");
    act(() => result.current.actions.bulk(["v3"], "remove"));
    expect(result.current.data.conversations.find((x) => x.id === "v3")).toBeUndefined();
  });

  it("send appends an outgoing message and resolves to sent", async () => {
    const { result } = setup();
    const before = result.current.data.messages["v1"].length;
    await act(async () => {
      await result.current.actions.send("v1", "Hello there", [{ name: "a.png", kind: "image" }]);
    });
    const list = result.current.data.messages["v1"];
    expect(list).toHaveLength(before + 1);
    const last = list[list.length - 1];
    expect(last.direction).toBe("out");
    expect(last.status).toBe("sent");
    expect(last.attachments).toHaveLength(1);
    expect(result.current.data.conversations.find((x) => x.id === "v1")!.lastMessage).toBe("Hello there");
  });

  it("schedule adds a message with scheduledAt", () => {
    const { result } = setup();
    act(() => result.current.actions.schedule("v2", "Later!", 1_800_000_000_000));
    const list = result.current.data.messages["v2"];
    expect(list[list.length - 1].scheduledAt).toBe(1_800_000_000_000);
  });

  it("react toggles an emoji on a message", () => {
    const { result } = setup();
    const mid = result.current.data.messages["v1"][0].id;
    act(() => result.current.actions.react("v1", mid, "👍"));
    expect(result.current.data.messages["v1"][0].reactions).toContain("👍");
    act(() => result.current.actions.react("v1", mid, "👍"));
    expect(result.current.data.messages["v1"][0].reactions).not.toContain("👍");
  });

  it("createConversation adds a conversation and makes it active", () => {
    const { result } = setup();
    let id = "";
    act(() => { id = result.current.actions.createConversation(contact); });
    expect(result.current.data.activeId).toBe(id);
    expect(result.current.data.conversations.find((x) => x.id === id)!.contact.name).toBe("New Person");
  });

  it("setActive sets and clears the active id", () => {
    const { result } = setup();
    act(() => result.current.actions.setActive("v2"));
    expect(result.current.data.activeId).toBe("v2");
    act(() => result.current.actions.setActive(null));
    expect(result.current.data.activeId).toBeNull();
  });

  it("liveUpsert inserts a new conversation and updates an existing one", () => {
    const { result } = setup();
    const fresh = { id: "live1", contact, number: "Main line", lastMessage: "ping", unread: 1, flags: [], updatedAt: 1_900_000_000_000 };
    act(() => result.current.actions.liveUpsert(fresh));
    expect(result.current.data.conversations[0].id).toBe("live1");
    act(() => result.current.actions.liveUpsert({ ...fresh, lastMessage: "pong" }));
    expect(result.current.data.conversations.find((x) => x.id === "live1")!.lastMessage).toBe("pong");
    act(() => result.current.actions.liveDrop("live1"));
    expect(result.current.data.conversations.find((x) => x.id === "live1")).toBeUndefined();
  });

  it("simulateRealtime emits an inbound update on its interval", () => {
    vi.useFakeTimers();
    try {
      const { result } = setup({ simulateRealtime: true });
      const firstId = result.current.data.conversations[0].id;
      const beforeUnread = result.current.data.conversations[0].unread;
      act(() => { vi.advanceTimersByTime(8000); });
      const updated = result.current.data.conversations.find((c) => c.id === firstId)!;
      expect(updated.unread).toBe(beforeUnread + 1);
      expect(updated.lastMessage).toContain("checking in");
    } finally {
      vi.useRealTimers();
    }
  });

  it("hooks throw outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useMessages())).toThrow(/MessagesProvider/);
    expect(() => renderHook(() => useMessagesActions())).toThrow(/MessagesProvider/);
  });
});
