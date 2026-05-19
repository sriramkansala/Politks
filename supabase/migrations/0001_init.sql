-- Enable pgvector
create extension if not exists vector;

-- ─── Enums ────────────────────────────────────────────────────────────────────

create type promise_status as enum (
  'not_yet_rated',
  'in_the_works',
  'stalled',
  'compromise',
  'promise_kept',
  'promise_broken'
);

create type evidence_kind as enum (
  'gov_data',
  'news_article',
  'official_statement',
  'rti_response',
  'citizen_report',
  'academic'
);

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table parties (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  name_translations   jsonb not null default '{}',
  short_name          text,
  level               text check (level in ('national', 'state')) not null,
  state_code          text,
  founded_year        int,
  color_hex           text default '#5e6ad2',
  logo_url            text,
  ec_registration     text,
  website_url         text,
  created_at          timestamptz default now()
);

create table manifestos (
  id                  uuid primary key default gen_random_uuid(),
  party_id            uuid references parties on delete cascade,
  election_type       text check (election_type in ('lok_sabha', 'vidhan_sabha', 'local')) not null,
  election_year       int not null,
  state_code          text,
  title               text not null,
  title_translations  jsonb not null default '{}',
  source_url          text,
  pdf_storage_key     text,
  language            text not null default 'en',
  pages               int,
  ingested_at         timestamptz,
  ingested_by         uuid references auth.users,
  status              text default 'draft' check (status in ('draft', 'review', 'published')),
  raw_text            text,
  created_at          timestamptz default now()
);

create table promises (
  id                  uuid primary key default gen_random_uuid(),
  manifesto_id        uuid references manifestos on delete cascade,
  party_id            uuid references parties on delete cascade,
  parent_id           uuid references promises on delete cascade,
  ordinal             int,
  title               text not null,
  title_translations  jsonb not null default '{}',
  text                text not null,
  text_translations   jsonb not null default '{}',
  page_ref            int,
  category            text not null,
  tags                text[] default '{}',
  success_criteria    text,
  target_metric       jsonb,
  target_deadline     date,
  geography           text default 'national',
  status              promise_status default 'not_yet_rated',
  status_rationale    text,
  status_updated_at   timestamptz,
  status_updated_by   uuid references auth.users,
  embedding           vector(1536),
  fts                 tsvector generated always as (
                        to_tsvector('simple',
                          coalesce(title, '') || ' ' || coalesce(text, '')
                        )
                      ) stored,
  is_headline         boolean default false,
  created_at          timestamptz default now()
);

create table sources (
  id                  uuid primary key default gen_random_uuid(),
  promise_id          uuid references promises on delete cascade,
  kind                evidence_kind not null,
  url                 text not null,
  title               text,
  publisher           text,
  published_at        date,
  excerpt             text,
  supports_status     promise_status,
  archived_url        text,
  added_by            uuid references auth.users,
  created_at          timestamptz default now()
);

create table status_updates (
  id                  uuid primary key default gen_random_uuid(),
  promise_id          uuid references promises on delete cascade,
  from_status         promise_status,
  to_status           promise_status not null,
  rationale           text not null,
  updated_by          uuid references auth.users,
  created_at          timestamptz default now()
);

create table promise_comparisons (
  id                  uuid primary key default gen_random_uuid(),
  topic               text not null,
  promise_ids         uuid[] not null,
  created_at          timestamptz default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index on promises using hnsw (embedding vector_cosine_ops);
create index on promises using gin (fts);
create index on promises (party_id, category);
create index on promises (manifesto_id, ordinal);
create index on promises (party_id, status);
create index on manifestos (party_id, election_year);
create index on sources (promise_id);
create index on status_updates (promise_id, created_at desc);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

alter table parties           enable row level security;
alter table manifestos        enable row level security;
alter table promises          enable row level security;
alter table sources           enable row level security;
alter table status_updates    enable row level security;
alter table promise_comparisons enable row level security;

-- Public reads
create policy "public_read_parties"
  on parties for select to anon, authenticated
  using (true);

create policy "public_read_published_manifestos"
  on manifestos for select to anon, authenticated
  using (status = 'published');

create policy "public_read_promises"
  on promises for select to anon, authenticated
  using (true);

create policy "public_read_sources"
  on sources for select to anon, authenticated
  using (true);

create policy "public_read_status_updates"
  on status_updates for select to anon, authenticated
  using (true);

create policy "public_read_comparisons"
  on promise_comparisons for select to anon, authenticated
  using (true);

-- Editor writes (role stored in auth.users.app_metadata->>'role')
create policy "editors_write_parties"
  on parties for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor');

create policy "editors_write_manifestos"
  on manifestos for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor');

create policy "editors_write_promises"
  on promises for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor');

create policy "editors_write_sources"
  on sources for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor');

create policy "editors_write_status_updates"
  on status_updates for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor');

create policy "editors_write_comparisons"
  on promise_comparisons for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'editor');

-- ─── Hybrid search RPC ────────────────────────────────────────────────────────

create or replace function hybrid_search(
  query_text    text,
  query_embedding vector(1536),
  match_count   int default 20,
  party_filter  uuid default null,
  category_filter text default null
)
returns table (
  id            uuid,
  title         text,
  text          text,
  category      text,
  status        promise_status,
  party_id      uuid,
  score         float
)
language sql stable
as $$
  select
    p.id,
    p.title,
    p.text,
    p.category,
    p.status,
    p.party_id,
    (
      ts_rank(p.fts, plainto_tsquery('simple', query_text)) * 0.4
      + (1 - (p.embedding <=> query_embedding)) * 0.6
    ) as score
  from promises p
  where
    (party_filter is null or p.party_id = party_filter)
    and (category_filter is null or p.category = category_filter)
    and p.embedding is not null
  order by score desc
  limit match_count;
$$;
