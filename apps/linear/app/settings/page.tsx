import { redirect } from "next/navigation"

/** Settings index → workspace hub (Import & export lives at /settings/import-export). */
export default function SettingsIndexPage() {
  redirect("/settings/workspace")
}
