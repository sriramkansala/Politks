import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// All-party sample data for search (pre-DB)
const ALL_PROMISES = [
  { id: "bjp-1", title: "3 crore new houses under PM Awas Yojana by 2029", text: "The BJP government commits to constructing 3 crore new houses under PM Awas Yojana.", category: "infrastructure", status: "in_the_works", party: "BJP", partySlug: "bjp" },
  { id: "bjp-2", title: "1 crore rooftop solar installations", text: "Install 1 crore rooftop solar panels across India to boost renewable energy.", category: "energy", status: "in_the_works", party: "BJP", partySlug: "bjp" },
  { id: "bjp-4", title: "Make India the 3rd largest economy by 2027", text: "India will become the world's third-largest economy by 2027 under BJP governance.", category: "economy", status: "in_the_works", party: "BJP", partySlug: "bjp" },
  { id: "inc-1", title: "₹1 lakh per year cash transfer to every poor family (Nyay)", text: "NYAY: Minimum income guarantee of ₹72,000 per year to the poorest 20% families.", category: "social_welfare", status: "not_yet_rated", party: "INC", partySlug: "inc" },
  { id: "inc-3", title: "Legal guarantee for MSP on agricultural produce", text: "INC will legislate a legal minimum support price for all agricultural produce.", category: "agriculture", status: "not_yet_rated", party: "INC", partySlug: "inc" },
  { id: "aap-1", title: "Free 300 units of electricity per month to all households", text: "Every Delhi household will receive 300 units of electricity free every month.", category: "energy", status: "promise_kept", party: "AAP", partySlug: "aap" },
  { id: "aap-2", title: "Free quality education in government schools", text: "World-class education in all Delhi government schools at zero cost.", category: "education", status: "promise_kept", party: "AAP", partySlug: "aap" },
  { id: "aap-3", title: "Free water up to 20,000 litres per month", text: "20,000 litres of clean water free per month to every Delhi household.", category: "water", status: "promise_kept", party: "AAP", partySlug: "aap" },
  { id: "dmk-1", title: "₹1,000/month to women heads of household", text: "DMK will provide ₹1,000 per month to all women heads of family in Tamil Nadu.", category: "women", status: "promise_kept", party: "DMK", partySlug: "dmk" },
  { id: "dmk-2", title: "Free breakfast scheme for all government school students", text: "Nutritious free breakfast for every student in Tamil Nadu government schools.", category: "education", status: "promise_kept", party: "DMK", partySlug: "dmk" },
]

function simpleSearch(query: string) {
  const q = query.toLowerCase()
  return ALL_PROMISES.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.text.toLowerCase().includes(q) ||
      p.category.includes(q) ||
      p.party.toLowerCase().includes(q)
  )
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? ""
  const party = req.nextUrl.searchParams.get("party") ?? ""

  if (!q.trim()) return NextResponse.json({ results: [] })

  let results = simpleSearch(q)
  if (party) results = results.filter((r) => r.partySlug === party)

  return NextResponse.json({ results: results.slice(0, 20) }, {
    headers: { "Cache-Control": "no-store" },
  })
}
