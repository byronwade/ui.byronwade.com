export const surfaces = [
  {
    id: "application",
    label: "Application",
    platform: "Web",
    summary: "Operate — indexes, forms, detail, object-bound AI on cool paper.",
    density: "compact · 32px controls · 40px rows",
  },
  {
    id: "marketing",
    label: "Marketing",
    platform: "Web",
    summary: "Present — brand, product frames, docs. Theater when earned.",
    density: "comfortable · 36–40px CTAs",
  },
  {
    id: "mobile",
    label: "Mobile Native",
    platform: "Native",
    summary: "Thumb-first — 44px targets, bottom bar, safe areas.",
    density: "touch · 44px controls · 52px rows",
  },
  {
    id: "desktop",
    label: "Desktop Native",
    platform: "Native",
    summary: "Keyboard + pointer — compact toolbars, menus, status.",
    density: "compact chrome · 28px toolbars",
  },
] as const;

export type SurfaceId = (typeof surfaces)[number]["id"];
