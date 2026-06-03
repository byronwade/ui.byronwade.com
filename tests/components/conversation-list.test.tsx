/** Tests for ConversationList (components/conversation-list.tsx). */

import * as React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";

import { ConversationList } from "@/components/conversation-list";
import { MessagesProvider, useMessages } from "@/lib/comms-store";

function stubMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: false, media: q, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  }));
}
beforeEach(stubMatchMedia);
afterEach(() => vi.restoreAllMocks());

function renderList(onSelect?: (id: string) => void) {
  return render(
    <MessagesProvider latencyMs={0}>
      <ConversationList onSelect={onSelect} />
    </MessagesProvider>,
  );
}
const rows = () => document.querySelectorAll('[data-slot="conversation-row"]');
const rowByName = (name: string) =>
  [...rows()].find((r) => r.textContent?.includes(name)) as HTMLElement;

describe("ConversationList", () => {
  it("renders seeded conversations with a 'now' label on the newest", () => {
    renderList();
    expect(rows().length).toBeGreaterThan(0);
    expect(screen.getByText("Ana Reyes")).toBeInTheDocument();
    expect(screen.getAllByText("now").length).toBeGreaterThan(0);
  });

  it("filters by search across name / handle / message", async () => {
    renderList();
    const input = screen.getByLabelText("Search conversations");
    await userEvent.type(input, "invoice");
    expect(rowByName("Dev Patel")).toBeTruthy();
    expect(rowByName("Ana Reyes")).toBeUndefined();
    await userEvent.clear(input);
    await userEvent.type(input, "zzzznomatch");
    expect(screen.getByText("No conversations match.")).toBeInTheDocument();
  });

  it("filter tabs scope the list and show counts", async () => {
    renderList();
    await userEvent.click(screen.getByRole("button", { name: /Unread/ }));
    // only unread convs (v1 unread 2, v3 unread 1) — Dev Patel (v2, 0 unread) hidden
    expect(rowByName("Dev Patel")).toBeUndefined();
    expect(rowByName("Ana Reyes")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: /Pinned/ }));
    expect(rowByName("Ana Reyes")).toBeTruthy(); // v1 is pinned
  });

  it("selecting a row (pinned or not) sets it active and fires onSelect", async () => {
    const onSelect = vi.fn();
    renderList(onSelect);
    await userEvent.click(rowByName("Dev Patel")); // rest section
    expect(onSelect).toHaveBeenCalledWith("v2");
    expect(rowByName("Dev Patel")).toHaveAttribute("data-active");
    await userEvent.click(rowByName("Ana Reyes")); // pinned section
    expect(onSelect).toHaveBeenCalledWith("v1");
    expect(rowByName("Ana Reyes")).toHaveAttribute("data-active");
  });

  it("row hover actions: pin, mark read, archive, delete", async () => {
    renderList();
    const ana = rowByName("Ana Reyes");
    // pin toggle
    fireEvent.click(within(ana).getByRole("button", { name: "Unpin" })); // v1 starts pinned
    expect(within(rowByName("Ana Reyes")).getByRole("button", { name: "Pin" })).toBeInTheDocument();
    // mark read clears the unread dot (match the "<n> unread" dot, not the "Mark unread" button)
    fireEvent.click(within(rowByName("Ana Reyes")).getByRole("button", { name: "Mark read" }));
    expect(within(rowByName("Ana Reyes")).queryByLabelText(/\d+ unread/)).toBeNull();
    // archive then delete other rows
    fireEvent.click(within(rowByName("Dev Patel")).getByRole("button", { name: "Archive" }));
    fireEvent.click(within(rowByName("Theo Novak")).getByRole("button", { name: "Delete" }));
    expect(rowByName("Theo Novak")).toBeUndefined();
  });

  it("mark unread on a read row arms the unread dot", () => {
    renderList();
    const dev = rowByName("Dev Patel"); // 0 unread
    fireEvent.click(within(dev).getByRole("button", { name: "Mark unread" }));
    expect(within(rowByName("Dev Patel")).getByLabelText(/unread/)).toBeInTheDocument();
  });

  it("bulk select + actions (read, pin, archive, delete, clear)", async () => {
    renderList();
    const bulkBar = () => document.querySelector('[data-slot="bulk-bar"]') as HTMLElement;
    // enter select mode by selecting two rows
    await userEvent.click(within(rowByName("Dev Patel")).getByRole("button", { name: "Select conversation" }));
    await userEvent.click(within(rowByName("Theo Novak")).getByRole("button", { name: "Select conversation" }));
    expect(screen.getByText("2 selected")).toBeInTheDocument();
    await userEvent.click(within(bulkBar()).getByRole("button", { name: "Pin" }));     // bulk pin
    expect(screen.queryByText("2 selected")).toBeNull();                                // selection cleared
    // archive bulk
    await userEvent.click(within(rowByName("Dev Patel")).getByRole("button", { name: "Select conversation" }));
    await userEvent.click(within(bulkBar()).getByRole("button", { name: "Archive" }));
    // delete bulk
    await userEvent.click(within(rowByName("Mara Lin")).getByRole("button", { name: "Select conversation" }));
    await userEvent.click(within(bulkBar()).getByRole("button", { name: "Delete" }));
    expect(rowByName("Mara Lin")).toBeUndefined();
    // mark-read bulk + clear
    await userEvent.click(within(rowByName("Ana Reyes")).getByRole("button", { name: "Select conversation" }));
    await userEvent.click(within(bulkBar()).getByRole("button", { name: "Mark read" }));
    await userEvent.click(within(rowByName("Ana Reyes")).getByRole("button", { name: "Select conversation" }));
    await userEvent.click(within(bulkBar()).getByRole("button", { name: "Clear selection" }));
    expect(screen.queryByText(/selected/)).toBeNull();
  });

  it("deselecting a selected row works (toggle off)", async () => {
    renderList();
    const sel = () => within(rowByName("Dev Patel")).getByRole("button", { name: /(Select|Deselect) conversation/ });
    await userEvent.click(sel());
    expect(screen.getByText("1 selected")).toBeInTheDocument();
    await userEvent.click(sel());
    expect(screen.queryByText(/selected/)).toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = renderList();
    expect(await axe(container)).toHaveNoViolations();
  });
});
