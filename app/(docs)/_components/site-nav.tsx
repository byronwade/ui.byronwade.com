"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories, byCategory } from "@/content/components";
import { guides } from "@/content/guides";

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
          // sit the 2px state border on top of the group's 1px rail
          "-ml-px border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          active
            ? "border-brand text-foreground"
            : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-7">
      <Group label="Get Started">{guides.map((g) => item(g.href, g.label))}</Group>

      {/* "Foundation" lives in Get Started (it's a base, not a browseable
          component), so skip its lone catalog category here. */}
      {categories
        .filter((cat) => cat !== "Foundation")
        .map((cat) => (
          <Group key={cat} label={cat}>
            {byCategory(cat).map((c) => item(`/docs/${c.slug}`, c.name))}
          </Group>
        ))}
    </nav>
  );
}
