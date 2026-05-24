// /tracker → redirects to the Overview page where the Promise Tracker now lives.
import { redirect } from "next/navigation"

export default function TrackerRedirect() {
  redirect("/")
}
