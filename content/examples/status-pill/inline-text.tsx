import { StatusPill } from "@/components/status-pill";

export default function Example() {
  return (
    <div className="flex flex-col gap-5 p-8 max-w-xl">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
        Inline with prose
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed">
        The background job is currently{" "}
        <StatusPill tone="success" pulse>running</StatusPill>{" "}
        and will complete in approximately 3 minutes.
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Your last deployment ended with a{" "}
        <StatusPill tone="danger">failure</StatusPill>{" "}
        — check the build logs for details.
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed">
        The scheduled maintenance window is{" "}
        <StatusPill tone="info">pending</StatusPill>{" "}
        and will begin tonight at 02:00 UTC.
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed">
        API response times are{" "}
        <StatusPill tone="warning">degraded</StatusPill>{" "}
        — P99 latency has exceeded the 500 ms threshold.
      </p>
    </div>
  );
}
