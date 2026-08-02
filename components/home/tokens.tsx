import { Stage } from "@/components/cinematic/stage";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { Reveal } from "@/components/cinematic/reveal";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const swatches = [
  { name: "background", className: "bg-background edge" },
  { name: "foreground", className: "bg-foreground" },
  { name: "brand", className: "bg-brand" },
  { name: "muted", className: "bg-muted edge" },
  { name: "card", className: "bg-card edge" },
  { name: "dock", className: "bg-dock" },
];

function Tokens() {
  return (
    <Stage
      id="tokens"
      tone="theater"
      className="flex flex-col justify-center px-5 py-24 md:px-8 md:py-32"
    >
      <MediaPlane />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
            Tokens
          </p>
          <h2 className="mt-4 max-w-[16ch] text-3xl font-medium tracking-[-0.035em] text-dock-foreground md:text-5xl">
            Cool paper. One arc. Theater when earned.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed tracking-tight text-dock-foreground/60">
            shadcn semantic tokens remapped to Meridian. Override{" "}
            <code className="font-mono text-sm text-dock-foreground">
              --brand
            </code>{" "}
            to reskin the system.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <Card className="bg-card/95">
            <CardHeader>
              <CardTitle>Color</CardTitle>
              <CardDescription>Semantic surfaces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                {swatches.map((swatch) => (
                  <div key={swatch.name} className="space-y-2">
                    <div
                      className={`aspect-[3/4] rounded-xl md:aspect-[4/5] ${swatch.className}`}
                    />
                    <p className="font-mono text-[10px] text-muted-foreground md:text-xs">
                      {swatch.name}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {(
                  [
                    ["thinking", "bg-activity-thinking"],
                    ["search", "bg-activity-search"],
                    ["read", "bg-activity-read"],
                    ["edit", "bg-activity-edit"],
                  ] as const
                ).map(([label, cls]) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className={`border-transparent font-mono text-foreground ${cls}`}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </Stage>
  );
}

export { Tokens };
