"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Library", href: "/library" },
  { label: "Collections", href: "/library/collections" },
  { label: "Architecture", href: "/library/collections/architecture" },
  { label: "Modern Structures", href: null }, // current page
];

/**
 * Responsive breadcrumb: shows all items on large screens, collapses middle
 * crumbs on smaller screens using BreadcrumbEllipsis.
 */
export default function Example() {
  const [expanded, setExpanded] = React.useState(false);

  const first = crumbs[0];
  const last = crumbs[crumbs.length - 1];
  const middle = crumbs.slice(1, -1);

  return (
    <div className="p-8">
      {/* Full breadcrumb – visible on md+ */}
      <div className="hidden md:block">
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href ?? crumb.label}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Collapsed breadcrumb – visible below md */}
      <div className="block md:hidden">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={first.href!}>{first.label}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {expanded ? (
              <>
                {middle.map((crumb) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={crumb.href!}>
                        {crumb.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    aria-label="Show full path"
                  >
                    <BreadcrumbEllipsis />
                  </button>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}

            <BreadcrumbItem>
              <BreadcrumbPage>{last.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
