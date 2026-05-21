import { STATIC_PARTIES, STATIC_MANIFESTOS, STATIC_PROMISES } from "./staticData"
import {
  STATIC_BILLS,
  STATIC_MPS,
  STATIC_STAGE_EVENTS,
  STATIC_GRAPH_EDGES,
  STATIC_PROMISE_ANCESTRY,
  STATIC_BILL_VERSIONS,
  STATIC_BILL_CLAUSES,
} from "./staticBills"
import { STATIC_MPS_BMW } from "./staticMps"
import { STATIC_MPS_GEN } from "./staticMps.generated"
import type { Mp } from "./types"

// Merge legacy STATIC_MPS (WRB forensic figures) with the richer BMW marquee
// set + the full 544-MP scrape from PRS. Dedupe by id (later sources override).
// Order matters: legacy → generated (real PRS data) → marquee (hand-curated
// with extra fields like criminal_cases, MPLADS — these override on conflict).
const _mpsById = new Map<string, Mp>()
for (const mp of STATIC_MPS as Mp[]) _mpsById.set(mp.id, mp)
for (const mp of STATIC_MPS_GEN as Mp[]) _mpsById.set(mp.id, mp)
for (const mp of STATIC_MPS_BMW) _mpsById.set(mp.id, mp)
const MERGED_MPS: Mp[] = Array.from(_mpsById.values())

export const STATIC_TABLES: Record<string, unknown[]> = {
  parties: STATIC_PARTIES,
  manifestos: STATIC_MANIFESTOS,
  promises: STATIC_PROMISES,
  sources: [],
  status_updates: [],
  promise_comparisons: [],
  mps: MERGED_MPS,
  bills: STATIC_BILLS,
  stage_events: STATIC_STAGE_EVENTS,
  issue_graph_edges: STATIC_GRAPH_EDGES,
  promise_ancestry: STATIC_PROMISE_ANCESTRY,
  bill_versions: STATIC_BILL_VERSIONS,
  bill_clauses: STATIC_BILL_CLAUSES,
}
