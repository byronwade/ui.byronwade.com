"use client";

import * as React from "react";
import { FolderPlus } from "lucide-react";
import { Bloom } from "@/components/ui/bloom";
import { BloomFlow, type BloomFlowDef } from "@/components/ui/bloom-flow";

interface ProjectState {
  name: string;
  template: "blank" | "starter" | "advanced" | "";
}

const TEMPLATES = [
  { id: "blank", label: "Blank", description: "Start from scratch" },
  { id: "starter", label: "Starter", description: "Common defaults pre-configured" },
  { id: "advanced", label: "Advanced", description: "Full feature set enabled" },
] as const;

const createProjectFlow: BloomFlowDef<ProjectState, { name: string; template: string }> = {
  id: "create-project",
  initial: { name: "", template: "" },
  steps: [
    {
      title: "Name your project",
      caption: "Choose a unique name for your new project.",
      body: (state, set) => (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="proj-name">
            Project name
          </label>
          <input
            id="proj-name"
            type="text"
            value={state.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="my-project"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ),
      primaryLabel: "Next",
      canAdvance: (s) => s.name.trim().length >= 2,
    },
    {
      title: "Choose a template",
      caption: "Select the starting point that fits your workflow.",
      body: (state, set) => (
        <div className="space-y-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => set({ template: t.id })}
              className={[
                "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                state.template === t.id
                  ? "border-brand bg-brand/5 text-foreground"
                  : "border-border text-foreground hover:border-foreground/30",
              ].join(" ")}
            >
              <div className="text-sm font-medium">{t.label}</div>
              <div className="text-xs text-muted-foreground">{t.description}</div>
            </button>
          ))}
        </div>
      ),
      primaryLabel: "Review",
      canAdvance: (s) => s.template !== "",
    },
    {
      title: "Review & confirm",
      caption: "Everything look right? Click Create to finish.",
      body: (state) => (
        <div className="space-y-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
          {[
            { label: "Name", value: state.name },
            { label: "Template", value: TEMPLATES.find((t) => t.id === state.template)?.label ?? state.template },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      ),
      primaryLabel: "Create project",
      canAdvance: () => true,
    },
  ],
  onComplete: async (state) => {
    await new Promise((r) => setTimeout(r, 900));
    return { name: state.name, template: state.template };
  },
  success: (result) => ({
    title: `"${result.name}" created`,
    actions: (
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Create another
      </button>
    ),
  }),
};

export default function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-[320px] items-end justify-center rounded-xl border border-border p-8">
      <Bloom
        open={open}
        onOpenChange={setOpen}
        placement="top"
        tone="surface"
        size={420}
        bar={
          <span className="flex items-center gap-2">
            <FolderPlus className="size-4" />
            New project
          </span>
        }
      >
        <BloomFlow flow={createProjectFlow} onClose={() => setOpen(false)} />
      </Bloom>
    </div>
  );
}
