"use client";

import { usePathname } from "next/navigation";

import { AppLauncher } from "./app-launcher";
import { AppBreadcrumb } from "./app-breadcrumb";
import { DockToolbar } from "./dock-toolbar";
import { NavDock } from "./nav-dock";

/**
 * The global floating shell, ported from SignalRoute's app shell. The top-left
 * **header group** pins to the window corner and holds two matched-sibling
 * overlays — the identity launcher and the breadcrumb pill. The contextual
 * toolbar pins top-right; the primary nav dock floats centered (top on sm+,
 * bottom on phones). `pointer-events-none` on the group keeps the gap from
 * blocking content; each pill re-enables its own events.
 */
export function AppChrome() {
  const pathname = usePathname();
  // Embedded archetype previews (`/preview/<slug>`) render inside iframes and
  // are meant to be pure, chrome-free surfaces — never overlay the shell there.
  if (pathname?.startsWith("/preview")) return null;

  return (
    <>
      <div className="pointer-events-none fixed top-3 left-3 z-50 flex items-start gap-2 print:hidden">
        <AppLauncher />
        <AppBreadcrumb />
      </div>
      <DockToolbar />
      <NavDock />
    </>
  );
}
