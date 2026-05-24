// /legislators → redirects to the Legislators tab inside /mp.
// Kept so that bookmarks and inbound links don't break.

import { redirect } from "next/navigation"

export default function LegislatorsRedirect() {
  redirect("/mp?tab=legislators")
}
