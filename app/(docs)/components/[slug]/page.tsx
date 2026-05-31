import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { bySlug, components } from "@/content/components";
import { examples } from "@/content/examples/registry";
import { ExampleTabs } from "@/app/(docs)/_components/example-tabs";
import { InstallCommand } from "@/app/(docs)/_components/install-command";

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = bySlug(slug);
  if (!doc) notFound();

  const demos = examples[slug] ?? [];
  const rendered = demos.map((d) => ({
    name: d.name,
    Component: d.Component,
    code: readFileSync(join(process.cwd(), "content/examples", d.file), "utf8").trimEnd(),
  }));

  return (
    <article className="max-w-3xl space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{doc.name}</h1>
        <p className="mt-2 text-muted-foreground">{doc.description}</p>
      </header>

      {rendered.length > 0 && (
        <section className="space-y-8">
          {rendered.map(({ name, Component, code }) => (
            <ExampleTabs key={name} title={name} preview={<Component />} code={code} />
          ))}
        </section>
      )}

      {doc.slug !== "foundation" && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Installation</h2>
          <InstallCommand slug={doc.slug} />
        </section>
      )}

      {doc.props && doc.props.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Props</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Prop</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Default</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {doc.props.map((p) => (
                  <tr key={p.name} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-xs">{p.name}</td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{p.type}</td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{p.default ?? "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </article>
  );
}
