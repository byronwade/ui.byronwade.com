import { Stage } from "@/components/cinematic/stage";
import { Reveal } from "@/components/cinematic/reveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function TypeSpecimen() {
  return (
    <Stage
      id="type"
      tone="paper"
      className="flex flex-col justify-center px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Type
          </p>
          <h2 className="mt-4 max-w-[18ch] text-3xl font-medium tracking-[-0.035em] text-foreground md:text-5xl">
            Hierarchy from size and tracking — not weight.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Specimens</CardTitle>
                <CardDescription>Geist Sans + Geist Mono</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    display
                  </p>
                  <p className="mt-2 text-4xl font-medium tracking-[-0.045em] md:text-5xl">
                    Meridian
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-mono text-xs text-muted-foreground">ui</p>
                  <p className="mt-2 text-sm tracking-tight">
                    Resource lists stay compact —{" "}
                    <span className="text-muted-foreground">
                      14px / tight tracking
                    </span>
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    mono
                  </p>
                  <p className="mt-2 font-mono text-sm tracking-tight">
                    ISS-1842 · 48m · bg-brand/10 · --brand
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>reading-ui</CardTitle>
                <CardDescription>Docs lane</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="reading-ui text-foreground">
                  <p className="reading-lead">
                    Web reading on emissive screens is not e-ink.
                  </p>
                  <p className="reading-muted mt-4">
                    Docs use a capped measure and relaxed line-height so
                    paragraphs stay readable without abandoning the product
                    voice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </Stage>
  );
}

export { TypeSpecimen };
