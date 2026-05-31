import { EventTimeline, type TimelineEvent } from "@/components/event-timeline";

const events: TimelineEvent[] = [
  {
    title: (
      <span>
        Pull request{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">#482</code>{" "}
        merged
      </span>
    ),
    description: (
      <span>
        Branch <code className="font-mono text-xs">feat/dark-mode</code> → <code className="font-mono text-xs">main</code>. Approved by 2 reviewers.
      </span>
    ),
    timestamp: "2026-05-31T11:04:30Z",
    tone: "success",
  },
  {
    title: (
      <span>
        CI pipeline{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">#1093</code>{" "}
        failed
      </span>
    ),
    description: (
      <span>
        Step <code className="font-mono text-xs">lint</code> exited with code <code className="font-mono text-xs">1</code>. 3 errors found.
      </span>
    ),
    timestamp: "2026-05-31T11:06:10Z",
    tone: "danger",
  },
  {
    title: (
      <span>
        Release{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">v2.4.0</code>{" "}
        tagged
      </span>
    ),
    description: "Changelog generated and GitHub Release draft created.",
    timestamp: "2026-05-31T11:30:00Z",
    tone: "info",
  },
];

export default function Example() {
  return (
    <div className="max-w-md p-6">
      <h2 className="mb-4 text-sm font-semibold">Rich JSX Content</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        <code>title</code> and <code>description</code> accept <code>React.ReactNode</code> — inline code, links, and formatted text all work.
      </p>
      <EventTimeline events={events} />
    </div>
  );
}
