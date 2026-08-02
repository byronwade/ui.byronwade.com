import { Stage } from "@/components/cinematic/stage";
import { Workbench } from "@/components/surfaces/workbench";

function WorkbenchSection() {
  return (
    <Stage
      id="workbench"
      tone="paper"
      className="px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Workbench
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] md:text-4xl">
            One screen. The whole merge.
          </h2>
          <p className="mt-4 text-sm leading-relaxed tracking-tight text-muted-foreground md:text-base">
            Sidebar and resource density for long sessions. Mono IDs and ⌘K for
            speed. Selected row is a quiet brand wash. Agent rail attaches to{" "}
            <span className="font-mono text-foreground">ISS-1842</span> — never
            a floating chatbot.
          </p>
        </div>

        <div className="mt-10">
          <Workbench />
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Density", "Stable rows · brand/10 selected"],
              ["Type", "Geist · mono for data · ⌘K"],
              ["Depth", "Edge hairline · no shadow soup"],
              ["AI", "Provenance · activity · object-bound"],
            ] as const
          ).map(([title, body]) => (
            <div key={title} className="rounded-2xl bg-card p-4 edge">
              <dt className="font-mono text-[10px] tracking-[0.14em] text-brand uppercase">
                {title}
              </dt>
              <dd className="mt-2 text-sm tracking-tight text-foreground">
                {body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Stage>
  );
}

export { WorkbenchSection };
