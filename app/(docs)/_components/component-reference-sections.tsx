import Link from "next/link"

import {
  getComponentFeatures,
  getComponentSourceRows,
  resolveRelatedComponents,
  type ComponentDoc,
} from "@/content/components"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h2>
  )
}

function ReferenceTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: string[][]
}) {
  if (rows.length === 0) return null

  return (
    <div className="overflow-hidden rounded-xl edge">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((column, index) => (
              <TableHead
                key={column}
                className={
                  index === 0
                    ? "pl-4 text-muted-foreground"
                    : index === columns.length - 1
                      ? "pr-4 text-muted-foreground"
                      : "text-muted-foreground"
                }
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.join(":")}>
              {row.map((cell, index) => (
                <TableCell
                  key={`${row[0]}-${index}`}
                  className={
                    index === 0
                      ? "pl-4 font-mono text-xs"
                      : index === row.length - 1
                        ? "pr-4 whitespace-normal text-muted-foreground"
                        : "font-mono text-xs text-muted-foreground"
                  }
                >
                  {cell || "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ApiGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

export function ComponentReferenceSections({ doc }: { doc: ComponentDoc }) {
  const features = getComponentFeatures(doc)
  const sourceRows = getComponentSourceRows(doc)
  const related = resolveRelatedComponents(doc)
  const deps = [...(doc.registryDeps ?? []), ...(doc.npmDeps ?? [])]
  const hasApi =
    (doc.props?.length ?? 0) > 0 ||
    (doc.exports?.length ?? 0) > 0 ||
    (doc.slots?.length ?? 0) > 0 ||
    (doc.cssVars?.length ?? 0) > 0 ||
    deps.length > 0

  return (
    <>
      {features.length > 0 ? (
        <section className="space-y-3">
          <Label>Features</Label>
          <ul className="grid gap-2 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature.title} className="rounded-xl edge bg-card p-4">
                <p className="text-sm font-medium text-foreground">
                  {feature.title}
                </p>
                {feature.description ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasApi ? (
        <section className="space-y-5">
          <Label>API</Label>
          {doc.props && doc.props.length > 0 ? (
            <ApiGroup title="Props">
              <ReferenceTable
                columns={["Prop", "Type", "Default", "Description"]}
                rows={doc.props.map((prop) => [
                  prop.name,
                  prop.type,
                  prop.default ?? "-",
                  prop.description,
                ])}
              />
            </ApiGroup>
          ) : null}
          {doc.exports && doc.exports.length > 0 ? (
            <ApiGroup title="Exports">
              <ReferenceTable
                columns={["Export", "Kind", "Description"]}
                rows={doc.exports.map((item) => [
                  item.name,
                  item.type,
                  item.description,
                ])}
              />
            </ApiGroup>
          ) : null}
          {doc.slots && doc.slots.length > 0 ? (
            <ApiGroup title="Slots">
              <ReferenceTable
                columns={["Slot", "Element", "Description"]}
                rows={doc.slots.map((slot) => [
                  slot.name,
                  slot.element ?? "-",
                  slot.description,
                ])}
              />
            </ApiGroup>
          ) : null}
          {doc.cssVars && doc.cssVars.length > 0 ? (
            <ApiGroup title="CSS Variables">
              <ReferenceTable
                columns={["Variable", "Default", "Description"]}
                rows={doc.cssVars.map((cssVar) => [
                  cssVar.name,
                  cssVar.default ?? "-",
                  cssVar.description,
                ])}
              />
            </ApiGroup>
          ) : null}
          {deps.length > 0 ? (
            <ApiGroup title="Dependencies">
              <ReferenceTable
                columns={["Package", "Kind", "Description"]}
                rows={[
                  ...(doc.registryDeps ?? []).map((dep) => [
                    dep,
                    "registry",
                    "Installed through the byronwade/ui registry.",
                  ]),
                  ...(doc.npmDeps ?? []).map((dep) => [
                    dep,
                    "npm",
                    "Installed from npm.",
                  ]),
                ]}
              />
            </ApiGroup>
          ) : null}
        </section>
      ) : null}

      {sourceRows.length > 0 || related.length > 0 ? (
        <section className="space-y-4">
          <Label>Source and related</Label>
          {sourceRows.length > 0 ? (
            <ReferenceTable
              columns={["File", "Path"]}
              rows={sourceRows.map((row) => [row.label, row.path])}
            />
          ) : null}
          {related.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={item.href}
                  className="rounded-full edge bg-card px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  )
}
