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
            Proof
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] md:text-4xl">
            Theme applied to a real whole.
          </h2>
          <p className="mt-4 text-sm leading-relaxed tracking-tight text-muted-foreground md:text-base">
            Agents compose shadcn primitives under{" "}
            <span className="font-mono text-foreground">design.md</span> — quiet
            chrome, mono IDs, selected wash, object-bound agent rail on{" "}
            <span className="font-mono text-foreground">ISS-1842</span>.
          </p>
        </div>

        <div className="mt-10 overscroll-none">
          <Workbench className="pointer-events-none" />
        </div>
      </div>
    </Stage>
  );
}

export { WorkbenchSection };
