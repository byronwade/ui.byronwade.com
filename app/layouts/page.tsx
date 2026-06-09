import { redirect } from "next/navigation"

// The layouts gallery is merged into the unified Browse page. This index now
// deep-links into the catalog with the Layouts type pre-selected; the
// /layouts/<slug> inspector routes still render their own full-viewport shell.
export default function LayoutsGalleryPage() {
  redirect("/catalog?type=layouts")
}
