import { cn } from "@/lib/utils"

/**
 * SiteAtmosphere — layered, token-driven cinematic backdrop for marketing and
 * narrative site surfaces. Pure CSS depth: an engineered grid, a brand light
 * source, a soft brand orb, and a radial vignette that fades to the canvas
 * (subtle in light, filmic in dark). Fixed and non-interactive; drop it once
 * at the top of a page. Color is 100% tokens (`--brand`, `--background`).
 */
export function SiteAtmosphere({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* faint engineered grid — the system's texture */}
      <div className="bg-grid absolute inset-0 opacity-[0.12]" />
      {/* brand light source, top-center */}
      <div className="glow-brand absolute inset-x-0 top-0 h-[65vh] opacity-45" />
      {/* soft brand orb for volumetric depth */}
      <div className="absolute left-1/2 top-[-12%] h-[46vh] w-[70vw] -translate-x-1/2 rounded-full bg-brand/8 blur-[120px]" />
      {/* cinematic vignette — focus toward center, dissolve to the canvas */}
      <div className="absolute inset-0 [background:radial-gradient(135%_95%_at_50%_0%,transparent_55%,var(--background)_100%)]" />
    </div>
  )
}
