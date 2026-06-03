"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories, byCategory } from "@/content/components";
import { guides } from "@/content/guides";

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
          "rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:text-foreground",
          active ? "font-semibold text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-6 text-sm">
      <div className="flex flex-col gap-1">
        <div className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Get Started
        </div>
        {guides.map((g) => item(g.href, g.label))}
      </div>

      {categories.map((cat) => (
        <div key={cat} className="flex flex-col gap-1">
          <div className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {cat}
          </div>
          {byCategory(cat).map((c) => item(`/docs/${c.slug}`, c.name))}
        </div>
      ))}
    </nav>
  );
}
