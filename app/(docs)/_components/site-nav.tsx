"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories, byCategory } from "@/content/components";

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-6 text-sm">
      {categories.map((cat) => (
        <div key={cat} className="flex flex-col gap-1">
          <div className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{cat}</div>
          {byCategory(cat).map((c) => {
            const href = `/components/${c.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
                className={cn(
                  "rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:text-foreground",
                  active ? "font-semibold text-foreground" : "text-muted-foreground"
                )}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
