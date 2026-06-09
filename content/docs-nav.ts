import {
  byCategory,
  bySlug,
  components,
  type ComponentDoc,
} from "@/content/components"
import {
  catalogSurfaces,
  categoriesForSurface,
  getSurface,
  type CatalogSurface,
} from "@/content/catalog-surfaces"

export type DocsNavLeaf = {
  kind: "leaf"
  slug: string
  label: string
  href: string
}

export type DocsNavFamily = {
  kind: "family"
  slug: string
  label: string
  href: string
  children: DocsNavLeaf[]
}

export type DocsNavEntry = DocsNavLeaf | DocsNavFamily

export function isNavHidden(doc: ComponentDoc): boolean {
  return doc.demoContext?.hidden === true
}

export function isDocsNavFamily(entry: DocsNavEntry): entry is DocsNavFamily {
  return entry.kind === "family"
}

function toLeaf(doc: ComponentDoc): DocsNavLeaf {
  return {
    kind: "leaf",
    slug: doc.slug,
    label: doc.name,
    href: `/docs/${doc.slug}`,
  }
}

function navOrder(doc: ComponentDoc): number {
  return doc.nav?.order ?? Number.MAX_SAFE_INTEGER
}

function compareDocs(a: ComponentDoc, b: ComponentDoc): number {
  const order = navOrder(a) - navOrder(b)
  if (order !== 0) return order
  return a.name.localeCompare(b.name)
}

/**
 * Builds category nav entries for a surface: leaves for standalone components,
 * families when a root has `nav.parent` children in the same category + surface.
 */
export function buildCategoryNav(
  category: string,
  surface: CatalogSurface,
): DocsNavEntry[] {
  const docs = byCategory(category)
    .filter((doc) => getSurface(doc) === surface && !isNavHidden(doc))
    .sort(compareDocs)

  const slugSet = new Set(docs.map((doc) => doc.slug))
  const childrenByParent = new Map<string, ComponentDoc[]>()

  for (const doc of docs) {
    const parent = doc.nav?.parent
    if (parent && slugSet.has(parent)) {
      const siblings = childrenByParent.get(parent) ?? []
      siblings.push(doc)
      childrenByParent.set(parent, siblings)
    }
  }

  const entries: DocsNavEntry[] = []

  for (const doc of docs) {
    if (doc.nav?.parent && slugSet.has(doc.nav.parent)) continue

    const children = (childrenByParent.get(doc.slug) ?? []).sort(compareDocs)
    if (children.length === 0) {
      entries.push(toLeaf(doc))
      continue
    }

    const members = [doc, ...children].sort(compareDocs)
    entries.push({
      kind: "family",
      slug: doc.slug,
      label: doc.name,
      href: `/docs/${doc.slug}`,
      children: members.map(toLeaf),
    })
  }

  return entries.sort((a, b) => a.label.localeCompare(b.label))
}

export function flattenCategoryNav(entries: DocsNavEntry[]): DocsNavLeaf[] {
  const leaves: DocsNavLeaf[] = []
  for (const entry of entries) {
    if (entry.kind === "leaf") {
      leaves.push(entry)
      continue
    }
    leaves.push(...entry.children)
  }
  return leaves
}

export type DocsNavSearchLink = DocsNavLeaf & {
  group: string
  surface: CatalogSurface
}

export function collectDocsNavLinks(): DocsNavSearchLink[] {
  const links: DocsNavSearchLink[] = []

  for (const surface of catalogSurfaces) {
    for (const category of categoriesForSurface(surface.id)) {
      const entries = buildCategoryNav(category, surface.id)
      for (const entry of entries) {
        const familyLabel = entry.kind === "family" ? entry.label : undefined
        const group = familyLabel
          ? `${surface.shortLabel} · ${category} · ${familyLabel}`
          : `${surface.shortLabel} · ${category}`

        const leaves =
          entry.kind === "family" ? entry.children : [entry as DocsNavLeaf]

        for (const leaf of leaves) {
          links.push({
            ...leaf,
            group,
            surface: surface.id,
          })
        }
      }
    }
  }

  return links
}

export function getFamilyRoot(slug: string): ComponentDoc | undefined {
  const doc = bySlug(slug)
  const parentSlug = doc?.nav?.parent
  if (!parentSlug) return undefined
  return bySlug(parentSlug)
}

/**
 * Structural validation for `nav.parent` metadata and tree coverage.
 * Returns human-readable error strings; empty means OK.
 */
export function validateDocsNav(): string[] {
  const errors: string[] = []
  const visible = components.filter((doc) => !isNavHidden(doc))
  const visibleSlugs = new Set(visible.map((doc) => doc.slug))

  for (const doc of visible) {
    const parentSlug = doc.nav?.parent
    if (!parentSlug) continue

    if (parentSlug === doc.slug) {
      errors.push(`${doc.slug}: nav.parent must not equal its own slug`)
      continue
    }

    const parent = bySlug(parentSlug)
    if (!parent) {
      errors.push(`${doc.slug}: nav.parent "${parentSlug}" does not exist`)
      continue
    }

    if (parent.nav?.parent) {
      errors.push(
        `${doc.slug}: nav.parent "${parentSlug}" is already nested — families are one level deep`,
      )
    }

    let cursor: ComponentDoc | undefined = parent
    const chain = new Set<string>([doc.slug])
    while (cursor?.nav?.parent) {
      if (chain.has(cursor.nav.parent)) {
        errors.push(`${doc.slug}: nav.parent cycle detected`)
        break
      }
      chain.add(cursor.nav.parent)
      cursor = bySlug(cursor.nav.parent)
    }
  }

  const indexed = new Set<string>()
  for (const surface of catalogSurfaces) {
    for (const category of categoriesForSurface(surface.id)) {
      for (const leaf of flattenCategoryNav(
        buildCategoryNav(category, surface.id),
      )) {
        if (indexed.has(leaf.slug)) {
          errors.push(`${leaf.slug}: appears more than once in docs nav tree`)
        }
        indexed.add(leaf.slug)
      }
    }
  }

  for (const doc of visible) {
    if (doc.category === "Foundation") continue
    if (!indexed.has(doc.slug)) {
      errors.push(`${doc.slug}: missing from docs nav tree`)
    }
  }

  for (const slug of indexed) {
    if (!visibleSlugs.has(slug)) {
      errors.push(`${slug}: indexed in docs nav but is hidden or missing`)
    }
  }

  return errors
}
