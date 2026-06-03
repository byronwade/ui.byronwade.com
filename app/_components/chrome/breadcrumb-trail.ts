import { bySlug } from "@/content/components";
import { guidePages } from "@/content/guides";

export type Crumb = { label: string; href: string };

function titleCase(seg: string) {
  return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function guideLabel(slug: string) {
  return guidePages.find((g) => g.slug === slug)?.label ?? titleCase(slug);
}

/**
 * The breadcrumb trail, derived purely from the pathname so it's stable from SSR
 * (no hydration pop). Mirrors SignalRoute's `resolveTrail`: a root crumb plus the
 * active section, with dynamic `[slug]` labels filled from the component catalog.
 * De-duplicated by href so the section crumb and a leaf that share a href collapse.
 */
export function resolveTrail(pathname: string): Crumb[] {
  const root: Crumb = { label: "byronwade/ui", href: "/" };
  if (pathname === "/") return [root];

  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "docs") {
    const trail: Crumb[] = [root, { label: "Docs", href: "/docs" }];
    if (parts[1]) {
      const doc = bySlug(parts[1]);
      trail.push({
        label: doc?.name ?? guideLabel(parts[1]),
        href: `/docs/${parts[1]}`,
      });
    }
    return dedupe(trail);
  }

  // Generic fallback — build a crumb per path segment.
  const trail: Crumb[] = [root];
  let acc = "";
  for (const seg of parts) {
    acc += `/${seg}`;
    trail.push({ label: titleCase(seg), href: acc });
  }
  return dedupe(trail);
}

function dedupe(crumbs: Crumb[]): Crumb[] {
  const seen = new Set<string>();
  return crumbs.filter((c) => {
    if (seen.has(c.href)) return false;
    seen.add(c.href);
    return true;
  });
}
