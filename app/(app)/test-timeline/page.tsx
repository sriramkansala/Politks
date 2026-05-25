// Temporary test page — delete after screenshot review
import { StageTimeline } from "@/components/forensic/StageTimeline"
import type { StageEvent } from "@/lib/db/types"

const EVENTS: StageEvent[] = [
  {
    id: "1", bill_id: "wrb-2023", promise_id: null,
    stage: 5, stage_label: "Referred to Committee",
    event_date: "2023-09-18", house: "lok_sabha",
    description: "Union Cabinet approves the Women's Reservation Bill one day before its introduction in the new Parliament building. No pre-legislative consultation process observed.",
    source_url: "https://pib.gov.in", source_label: "PIB press release",
    verbatim_quote: null, verbatim_speaker_id: null, verbatim_speaker_name: null, created_at: "2024-01-01",
  },
  {
    id: "2", bill_id: "wrb-2023", promise_id: null,
    stage: 6, stage_label: "Committee Report",
    event_date: "2023-09-19", house: "lok_sabha",
    description: "Law Minister Arjun Ram Meghwal introduces CAB-128/2023 in the new Parliament building. Bill proposes inserting Articles 330A, 332A and 334A into the Constitution.",
    source_url: "https://loksabha.nic.in", source_label: "Lok Sabha records",
    verbatim_quote: null, verbatim_speaker_id: null, verbatim_speaker_name: null, created_at: "2024-01-01",
  },
  {
    id: "3", bill_id: "wrb-2023", promise_id: null,
    stage: 10, stage_label: "2nd House: 1st Reading",
    event_date: "2023-09-20", house: "lok_sabha",
    description: "Lok Sabha votes 454-2 in favour. The only dissenting votes come from AIMIM's Asaduddin Owaisi (Hyderabad) and Syed Imtiaz Jaleel (Aurangabad).",
    source_url: "https://loksabha.nic.in/division", source_label: "Lok Sabha division list",
    verbatim_quote: "Muslim women account for 7% of the national population but their representation in legislative bodies is just 0.7%. This bill fails them.",
    verbatim_speaker_id: null, verbatim_speaker_name: "Asaduddin Owaisi (AIMIM)", created_at: "2024-01-01",
  },
  {
    id: "4", bill_id: "wrb-2023", promise_id: null,
    stage: 11, stage_label: "2nd House: Committee",
    event_date: "2023-09-21", house: "rajya_sabha",
    description: "Rajya Sabha passes the bill 214-0. Unanimous passage with no member voting against.",
    source_url: "https://rajyasabha.nic.in/division", source_label: "Rajya Sabha division list",
    verbatim_quote: null, verbatim_speaker_id: null, verbatim_speaker_name: null, created_at: "2024-01-01",
  },
  {
    id: "5", bill_id: "wrb-2023", promise_id: null,
    stage: 12, stage_label: "2nd House: Passed",
    event_date: "2023-09-28", house: null,
    description: "President Droupadi Murmu grants assent to the Constitution (106th Amendment) Act, 2023 on 28 September 2023.",
    source_url: "https://egazette.gov.in", source_label: "Gazette of India",
    verbatim_quote: null, verbatim_speaker_id: null, verbatim_speaker_name: null, created_at: "2024-01-01",
  },
  {
    id: "6", bill_id: "wrb-2023", promise_id: null,
    stage: 13, stage_label: "Joint Session",
    event_date: "2023-09-28", house: null,
    description: "Act notified in the Gazette of India as the Constitution (One Hundred and Sixth Amendment) Act, 2023. Article 334A links effective implementation to the first post-commencement census.",
    source_url: "https://egazette.gov.in/notification", source_label: "Gazette notification",
    verbatim_quote: "the provisions of this Part relating to reservation of seats for women shall cease to have effect on the expiration of a period of 15 years from the date of commencement of this Act.",
    verbatim_speaker_id: null, verbatim_speaker_name: "Article 334A, Constitution (106th Amendment) Act 2023", created_at: "2024-01-01",
  },
  {
    id: "7", bill_id: "wrb-2023", promise_id: null,
    stage: 14, stage_label: "Presidential Assent",
    event_date: "2026-04-16", house: null,
    description: "Union Ministry of Law and Justice issues gazette notification bringing the Act 'into force' on 16 April 2026 — but the 33% reservation remains inoperative pending the post-2026 census and a fresh delimitation.",
    source_url: "https://egazette.gov.in/april2026", source_label: "Gazette notification April 2026",
    verbatim_quote: null, verbatim_speaker_id: null, verbatim_speaker_name: null, created_at: "2024-01-01",
  },
]

export default function TestTimelinePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <StageTimeline
        stageEvents={EVENTS}
        currentStage={14}
        coveredCount={7}
      />
    </div>
  )
}
