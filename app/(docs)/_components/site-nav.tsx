"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { guides } from "@/content/guides";
import { variantJumps } from "@/app/(docs)/_components/docs-nav-data";

/** A section header + its items, grouped under a vertical rail. */
function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="px-2 text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label}
      </div>
      <div className="flex flex-col border-l border-border">{children}</div>
    </div>
  );
}

export function SiteNav() {
  const pathname = usePathname();

  const item = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "-ml-px border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          active
            ? "border-brand text-foreground"
            : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
        )}
      >
        {label}
      </Link>
    );
  };

  const onPage = variantJumps(pathname);

  return (
    <nav className="flex flex-col gap-7">
      <Group label="Get Started">{guides.map((g) => item(g.href, g.label))}</Group>

      <Group label="Components">{item("/docs#catalog", "Browse all components")}</Group>

      {onPage && (
        <Group label="On this page">
          {onPage.jumps.map((j) => item(`/docs/${onPage.slug}#${j.id}`, j.name))}
        </Group>
      )}
    </nav>
  );
}
