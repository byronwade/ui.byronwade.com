import { components } from "@/content/components";
import { examples } from "@/content/examples/registry";

// Component previews for the catalog gallery cards (scaled inside a lazy iframe).
// Mirrors app/preview/[slug] (archetypes/templates) but renders a component's
// DEFAULT example. Only known component slugs are valid. The example is centered
// in a full-width canvas so full-bleed components lay out correctly; the card
// scales this canvas down to fit.
export const dynamicParams = false;

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export default async function ComponentPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demos = examples[slug] ?? [];
  const demo = demos.find((d) => d.file.endsWith("/default.tsx")) ?? demos[0];
  const Component = demo?.Component;

  return (
    <div className="grid min-h-dvh place-items-center bg-background p-6">
      {Component ? (
        <Component />
      ) : (
        <span className="font-mono text-sm text-muted-foreground">{slug}</span>
      )}
    </div>
  );
}
