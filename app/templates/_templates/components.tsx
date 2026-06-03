// Slug -> Component map for starter templates. Imported by /preview (which
// renders the full template inside an iframe) and, transitively, nowhere else —
// the metadata in ./index.ts is the import-safe surface for nav/search/gallery.
import type { TemplateSlug } from "./index";
import { PricingTemplate } from "./pricing";
import { DashboardTemplate } from "./dashboard";
import { SettingsTemplate } from "./settings";

export const templateComponents: Record<TemplateSlug, React.ComponentType> = {
  pricing: PricingTemplate,
  dashboard: DashboardTemplate,
  settings: SettingsTemplate,
};
