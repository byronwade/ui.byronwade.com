"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, Hash, Component } from "lucide-react";
import { searchIndex, type SearchEntry } from "@/content/search-index";

/* ── helpers ─────────────────────────────────────────────────────── */

function navigateTo(href: string, router: ReturnType<typeof useRouter>, close: () => void) {
  close();
  if (href.startsWith("/components/")) {
    router.push(href);
    return;
  }
  // Section anchor: /#sectionId
  const id = href.replace("/#", "");
  const el = typeof document !== "undefined" ? document.getElementById(id) : null;
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", href);
  } else {
    // We're on a detail page — navigate home, Next will handle the hash
    router.push(href);
  }
}

/* ── palette ─────────────────────────────────────────────────────── */

const components: SearchEntry[] = searchIndex.filter((e) => e.kind === "Component");
const sections: SearchEntry[]   = searchIndex.filter((e) => e.kind === "Section");

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // ⌘K / Ctrl+K global shortcut
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Custom event fired by the search button in SiteHeader
  React.useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search components and sections"
      // Radix dialog portal — overlayClassName controls the backdrop
      overlayClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      className={[
        "fixed left-1/2 top-[20vh] z-50 w-full max-w-[560px] -translate-x-1/2",
        "overflow-hidden rounded-xl border border-white/10 bg-[oklch(0.13_0_0)] shadow-xl",
        "text-[oklch(0.98_0_0)]",
      ].join(" ")}
    >
      {/* Search input row */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <Search className="size-4 shrink-0 text-[oklch(0.55_0_0)]" />
        <Command.Input
          placeholder="Search components and sections…"
          className={[
            "flex-1 bg-transparent text-sm outline-none placeholder:text-[oklch(0.45_0_0)]",
            "caret-[oklch(0.6_0.17_148)]",
          ].join(" ")}
        />
        <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[oklch(0.45_0_0)] sm:inline">
          ESC
        </kbd>
      </div>

      {/* Results list */}
      <Command.List className="max-h-[400px] overflow-y-auto p-2 pb-3">
        <Command.Empty className="py-10 text-center text-sm text-[oklch(0.45_0_0)]">
          No results found.
        </Command.Empty>

        {/* Sections group */}
        <Command.Group
          heading="Sections"
          className="[&_[cmdk-group-heading]]:mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[oklch(0.4_0_0)]"
        >
          {sections.map((entry) => (
            <Command.Item
              key={entry.href}
              value={entry.label}
              keywords={entry.keywords ? entry.keywords.split(" ") : undefined}
              onSelect={() => navigateTo(entry.href, router, () => setOpen(false))}
              className={[
                "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                "text-[oklch(0.75_0_0)] outline-none",
                "data-[selected=true]:bg-[oklch(0.6_0.17_148)]/15 data-[selected=true]:text-[oklch(0.98_0_0)]",
              ].join(" ")}
            >
              <Hash className="size-3.5 shrink-0 text-[oklch(0.6_0.17_148)]" />
              {entry.label}
            </Command.Item>
          ))}
        </Command.Group>

        {/* Separator */}
        <div className="my-1 border-t border-white/5" />

        {/* Components group */}
        <Command.Group
          heading="Components"
          className="[&_[cmdk-group-heading]]:mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[oklch(0.4_0_0)]"
        >
          {components.map((entry) => (
            <Command.Item
              key={`${entry.href}-${entry.label}`}
              value={entry.label}
              keywords={entry.keywords ? entry.keywords.split(" ") : undefined}
              onSelect={() => navigateTo(entry.href, router, () => setOpen(false))}
              className={[
                "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                "text-[oklch(0.75_0_0)] outline-none",
                "data-[selected=true]:bg-[oklch(0.6_0.17_148)]/15 data-[selected=true]:text-[oklch(0.98_0_0)]",
              ].join(" ")}
            >
              <Component className="size-3.5 shrink-0 text-[oklch(0.45_0_0)]" />
              {entry.label}
              {entry.href.startsWith("/components/") && (
                <span className="ml-auto font-mono text-[10px] text-[oklch(0.35_0_0)]">
                  {entry.href}
                </span>
              )}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>

      {/* Footer */}
      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2.5 text-[10px] text-[oklch(0.4_0_0)]">
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono">↑↓</kbd>
          navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono">↵</kbd>
          open
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono">ESC</kbd>
          close
        </span>
      </div>
    </Command.Dialog>
  );
}
