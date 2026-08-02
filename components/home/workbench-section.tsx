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
            Prove the system in one screen.
          </h2>
          <p className="mt-4 text-sm leading-relaxed tracking-tight text-muted-foreground md:text-base">
            Parts and whole together: quiet chrome, stable rows, mono IDs, ⌘K,
            selected wash on{" "}
            <span className="font-mono text-foreground">ISS-1842</span>, and an
            agent rail that only appears because that object needs it.
          </p>
        </div>

        <div className="mt-10">
          <Workbench />
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed tracking-tight text-muted-foreground md:text-sm">
          Density for scanning · type for data · edge before shadow · AI bound
          to the issue — complexity available, not required.
        </p>
      </div>
    </Stage>
  );
}

export { WorkbenchSection };
