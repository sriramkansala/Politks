-- ──────────────────────────────────────────────────────────────────────────────
-- BMW v2: Forensic Platform Schema Migration
-- ──────────────────────────────────────────────────────────────────────────────

-- MPs / legislators
CREATE TABLE IF NOT EXISTS mps (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  name_translations jsonb NOT NULL DEFAULT '{}',
  party_id        uuid REFERENCES parties(id) ON DELETE SET NULL,
  party_name      text,                         -- for parties not in our DB
  house           text CHECK (house IN ('lok_sabha','rajya_sabha','state_assembly')),
  constituency    text,
  state_code      text,
  term_start      date,
  term_end        date,                         -- NULL = currently serving
  photo_url       text,
  myneta_id       text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Legislative bills
CREATE TABLE IF NOT EXISTS bills (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text UNIQUE NOT NULL,
  title               text NOT NULL,
  short_title         text,
  bill_number         text,                     -- e.g. "CAB-128/2023"
  bill_type           text CHECK (bill_type IN ('constitutional','ordinary','money','private_member')),
  house_introduced    text CHECK (house_introduced IN ('lok_sabha','rajya_sabha')),
  introduced_date     date,
  mover_mp_id         uuid REFERENCES mps(id) ON DELETE SET NULL,
  mover_party_id      uuid REFERENCES parties(id) ON DELETE SET NULL,
  ministry            text,
  current_stage       int CHECK (current_stage BETWEEN 1 AND 16),
  predecessor_bill_id uuid REFERENCES bills(id) ON DELETE SET NULL,
  promise_ids         uuid[] NOT NULL DEFAULT '{}',
  is_money_bill_claimed bool NOT NULL DEFAULT false,
  outcome             text CHECK (outcome IN ('passed','lapsed','withdrawn','repealed','pending')),
  lok_sabha_ayes      int,
  lok_sabha_noes      int,
  rajya_sabha_ayes    int,
  rajya_sabha_noes    int,
  assent_date         date,
  claude_summary      text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- 16-stage lifecycle events
CREATE TABLE IF NOT EXISTS stage_events (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id               uuid REFERENCES bills(id) ON DELETE CASCADE,
  promise_id            uuid REFERENCES promises(id) ON DELETE CASCADE,
  stage                 int NOT NULL CHECK (stage BETWEEN 1 AND 16),
  stage_label           text NOT NULL,
  event_date            date,
  house                 text,
  description           text NOT NULL,
  source_url            text,
  source_label          text,
  verbatim_quote        text,
  verbatim_speaker_id   uuid REFERENCES mps(id) ON DELETE SET NULL,
  verbatim_speaker_name text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stage_events_has_context CHECK (bill_id IS NOT NULL OR promise_id IS NOT NULL)
);

-- Issue graph edges (causal relationships)
CREATE TABLE IF NOT EXISTS issue_graph_edges (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type         text NOT NULL,
  source_id           uuid NOT NULL,
  source_label        text NOT NULL,
  target_type         text NOT NULL,
  target_id           uuid NOT NULL,
  target_label        text NOT NULL,
  edge_type           text NOT NULL CHECK (edge_type IN (
    'blocked_by','amended_by','linked_to','opposed_by',
    'lapsed_with','superseded_by','descended_from',
    'weakened_by','endorsed_by','caused_by'
  )),
  description         text,
  evidence_source_url text,
  confidence          float NOT NULL DEFAULT 0.8,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Promise ancestry / genealogy
CREATE TABLE IF NOT EXISTS promise_ancestry (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promise_id        uuid REFERENCES promises(id) ON DELETE CASCADE,
  ancestor_name     text NOT NULL,
  ancestor_year     int,
  ancestor_govt     text,
  relationship_note text,
  sort_order        int NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_stage_events_bill      ON stage_events(bill_id);
CREATE INDEX IF NOT EXISTS idx_stage_events_promise   ON stage_events(promise_id);
CREATE INDEX IF NOT EXISTS idx_stage_events_stage     ON stage_events(stage);
CREATE INDEX IF NOT EXISTS idx_graph_source           ON issue_graph_edges(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_graph_target           ON issue_graph_edges(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_bills_slug             ON bills(slug);
CREATE INDEX IF NOT EXISTS idx_promise_ancestry       ON promise_ancestry(promise_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE mps            ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills          ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE promise_ancestry  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read mps"            ON mps            FOR SELECT USING (true);
CREATE POLICY "public read bills"          ON bills          FOR SELECT USING (true);
CREATE POLICY "public read stage_events"   ON stage_events   FOR SELECT USING (true);
CREATE POLICY "public read graph_edges"    ON issue_graph_edges FOR SELECT USING (true);
CREATE POLICY "public read ancestry"       ON promise_ancestry  FOR SELECT USING (true);
