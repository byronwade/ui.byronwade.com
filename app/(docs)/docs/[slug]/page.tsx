import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { bySlug, components } from "@/content/components";
import { examples } from "@/content/examples/registry";
import { ExampleTabs } from "@/app/(docs)/_components/example-tabs";
import { InstallCommand } from "@/app/(docs)/_components/install-command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <article className="max-w-2xl space-y-10">
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
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-4 text-muted-foreground">Prop</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Default</TableHead>
                  <TableHead className="pr-4 text-muted-foreground">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doc.props.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="pl-4 font-mono text-xs">{p.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.type}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.default ?? "—"}</TableCell>
                    <TableCell className="pr-4 whitespace-normal text-muted-foreground">{p.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </article>
  );
}
