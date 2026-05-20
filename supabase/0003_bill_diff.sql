-- ──────────────────────────────────────────────────────────────────────────────
-- BMW-032: Bill Diff View — bill_versions + bill_clauses
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bill_versions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id           uuid NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  version_label     text NOT NULL,          -- e.g. "CAB-108/2008 (As introduced)"
  version_date      date NOT NULL,
  source_url        text,
  raw_pdf_url       text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bill_clauses (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_version_id     uuid NOT NULL REFERENCES bill_versions(id) ON DELETE CASCADE,
  clause_number       text NOT NULL,          -- e.g. "1", "2", "3", "334A"
  clause_title        text,                   -- e.g. "Short title"
  clause_text         text NOT NULL,
  parent_clause_id    uuid REFERENCES bill_clauses(id) ON DELETE SET NULL,
  topic_tags          text[] NOT NULL DEFAULT '{}',
  references_act      text,
  is_poison_pill      boolean NOT NULL DEFAULT false,
  attribution_note    text,                   -- who introduced this clause and why
  ordinal             int NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bill_versions_bill   ON bill_versions(bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_clauses_version ON bill_clauses(bill_version_id);
CREATE INDEX IF NOT EXISTS idx_bill_clauses_number  ON bill_clauses(bill_version_id, clause_number);

ALTER TABLE bill_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_clauses  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read bill_versions" ON bill_versions FOR SELECT USING (true);
CREATE POLICY "public read bill_clauses"  ON bill_clauses  FOR SELECT USING (true);
