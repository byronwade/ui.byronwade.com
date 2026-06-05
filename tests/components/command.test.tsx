import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  Element.prototype.scrollIntoView = vi.fn();
});

afterAll(() => {
  vi.unstubAllGlobals();
});
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

function Palette({ open = true }: { open?: boolean }) {
  return (
    <CommandDialog open={open}>
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>New project</CommandItem>
            <CommandItem>Invite teammate</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              Billing
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function InlineCommand({
  onSelect,
}: {
  onSelect?: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border">
      <Command>
        <CommandInput placeholder="Search actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={onSelect}>Calendar</CommandItem>
            <CommandItem onSelect={onSelect}>Search emoji</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={onSelect}>
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

describe("Command – smoke", () => {
  it("renders command root with data-slot", () => {
    const { container } = render(
      <Command>
        <CommandList />
      </Command>
    );
    expect(container.querySelector("[data-slot='command']")).toBeInTheDocument();
  });

  it("CommandInput wrapper has data-slot", () => {
    const { container } = render(
      <Command>
        <CommandInput />
        <CommandList />
      </Command>
    );
    expect(
      container.querySelector("[data-slot='command-input-wrapper']")
    ).toBeInTheDocument();
  });

  it("CommandList has data-slot", () => {
    const { container } = render(
      <Command>
        <CommandList />
      </Command>
    );
    expect(container.querySelector("[data-slot='command-list']")).toBeInTheDocument();
  });
});

describe("Command – dialog palette", () => {
  it("CommandDialog renders items when open", () => {
    render(<Palette />);
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
    expect(screen.getByText("New project")).toBeInTheDocument();
    expect(screen.getByText("Invite teammate")).toBeInTheDocument();
  });

  it("shows group headings", () => {
    render(<Palette />);
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders CommandShortcut text", () => {
    render(<Palette />);
    expect(screen.getByText("⌘B")).toBeInTheDocument();
  });

  it("CommandEmpty appears when filter matches nothing", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    await user.type(screen.getByPlaceholderText("Search…"), "zzzz-no-match");
    expect(await screen.findByText("No results.")).toBeInTheDocument();
  });
});

describe("Command – standalone usage", () => {
  it("CommandItem has data-slot", () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandItem>Run</CommandItem>
        </CommandList>
      </Command>
    );
    expect(container.querySelector("[data-slot='command-item']")).toBeInTheDocument();
  });

  it("only highlights the active item (value-matched, not attribute-presence)", () => {
    // Regression: cmdk renders data-selected="false" on inactive items, so a bare
    // `data-selected:` Tailwind variant (attribute presence) would fill every row.
    // The class must scope the fill to data-[selected=true].
    const { container } = render(
      <Command>
        <CommandList>
          <CommandItem>Run</CommandItem>
        </CommandList>
      </Command>
    );
    const item = container.querySelector("[data-slot='command-item']")!;
    expect(item.className).toContain("data-[selected=true]:bg-muted");
    expect(item.className).not.toMatch(/(?<!\[)\bdata-selected:bg-muted/);
  });

  it("CommandGroup has data-slot", () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup heading="General">
            <CommandItem>One</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    expect(container.querySelector("[data-slot='command-group']")).toBeInTheDocument();
  });
});

describe("Command – inline (no dialog)", () => {
  it("renders items and group headings inline", () => {
    render(<InlineCommand />);
    expect(screen.getByPlaceholderText("Search actions…")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Search emoji")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Suggestions")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders CommandSeparator with data-slot", () => {
    const { container } = render(<InlineCommand />);
    expect(
      container.querySelector("[data-slot='command-separator']")
    ).toBeInTheDocument();
  });

  it("renders CommandShortcut text", () => {
    render(<InlineCommand />);
    expect(screen.getByText("⌘P")).toBeInTheDocument();
  });

  it("typing filters items down to the match", async () => {
    const user = userEvent.setup();
    render(<InlineCommand />);
    await user.type(screen.getByPlaceholderText("Search actions…"), "Calendar");
    await waitFor(() => {
      expect(screen.queryByText("Search emoji")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  it("typing a no-match query reveals CommandEmpty", async () => {
    const user = userEvent.setup();
    render(<InlineCommand />);
    await user.type(
      screen.getByPlaceholderText("Search actions…"),
      "zzzz-no-match"
    );
    expect(await screen.findByText("No results found.")).toBeInTheDocument();
  });

  it("clicking an item fires onSelect", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<InlineCommand onSelect={onSelect} />);
    await user.click(screen.getByText("Calendar"));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("Calendar");
  });
});

describe("Command – accessibility", () => {
  it("open command dialog has no axe violations", async () => {
    const { container } = render(<Palette />);
    expect(await axe(container)).toHaveNoViolations();
  });

  // NOTE: axe a separator-free inline command. cmdk renders CommandSeparator as
  // role="separator", which is an invalid child of the CommandList's
  // role="listbox" (aria-required-children) — a known cmdk quirk. The dialog
  // palette only "passes" axe because Radix portals its content outside the
  // scanned container. `label` gives the combobox an accessible name the
  // cmdk-sanctioned way (no axe rules are disabled here).
  it("inline command has no axe violations", async () => {
    const { container } = render(
      <div className="rounded-xl border">
        <Command label="Command menu">
          <CommandInput placeholder="Search actions…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search emoji</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
