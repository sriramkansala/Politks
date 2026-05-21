// Mock Supabase client that serves STATIC_TABLES.
// Implements just the chainable subset used by the dashboard:
//   .from(t).select(cols?, opts?).order?(col, opts?).eq?().limit?().single?()
// Each builder is a thenable resolving to { data, count, error }.

import { STATIC_TABLES } from "./staticTables"

interface QueryState {
  table: string
  rows: unknown[]
  head: boolean
  countMode: boolean
  selectCols: string | null
  filters: Array<(row: Record<string, unknown>) => boolean>
  orderBys: Array<{ col: string; ascending: boolean }>
  limitN: number | null
  single: boolean
}

// Parse a single "col.op.value" clause from PostgREST-style .or() input
function parseOrClause(
  clause: string
): ((r: Record<string, unknown>) => boolean) | null {
  const parts = clause.split(".")
  if (parts.length < 3) return null
  const col = parts[0]
  const op = parts[1]
  const val = parts.slice(2).join(".")
  if (op === "eq") return (r) => String(r[col]) === val
  if (op === "neq") return (r) => String(r[col]) !== val
  return null
}

function makeBuilder(table: string): MockBuilder {
  const state: QueryState = {
    table,
    rows: [...((STATIC_TABLES[table] as unknown[]) ?? [])],
    head: false,
    countMode: false,
    selectCols: null,
    filters: [],
    orderBys: [],
    limitN: null,
    single: false,
  }

  const execute = () => {
    let rows = state.rows as Array<Record<string, unknown>>
    for (const f of state.filters) rows = rows.filter(f)
    if (state.orderBys.length) {
      rows = [...rows].sort((a, b) => {
        for (const { col, ascending } of state.orderBys) {
          const va = a[col] as number | string | null
          const vb = b[col] as number | string | null
          if (va == null && vb == null) continue
          if (va == null) return ascending ? -1 : 1
          if (vb == null) return ascending ? 1 : -1
          if (va < vb) return ascending ? -1 : 1
          if (va > vb) return ascending ? 1 : -1
        }
        return 0
      })
    }
    if (state.limitN != null) rows = rows.slice(0, state.limitN)

    // Column projection (handle "col1, col2")
    let data: unknown = rows
    if (state.selectCols && state.selectCols !== "*") {
      const cols = state.selectCols.split(",").map((c) => c.trim())
      data = rows.map((r) => {
        const proj: Record<string, unknown> = {}
        for (const c of cols) proj[c] = r[c]
        return proj
      })
    }

    if (state.single) {
      const first = (data as unknown[])[0] ?? null
      return { data: first, error: null, count: null }
    }
    if (state.head) return { data: null, error: null, count: rows.length }
    return {
      data,
      error: null,
      count: state.countMode ? rows.length : null,
    }
  }

  const builder: MockBuilder = {
    select(cols?: string, opts?: { count?: string; head?: boolean }) {
      state.selectCols = cols ?? "*"
      if (opts?.count === "exact") state.countMode = true
      if (opts?.head) state.head = true
      return builder
    },
    order(col: string, opts?: { ascending?: boolean }) {
      state.orderBys.push({ col, ascending: opts?.ascending !== false })
      return builder
    },
    eq(col: string, val: unknown) {
      state.filters.push((r) => r[col] === val)
      return builder
    },
    in(col: string, vals: unknown[]) {
      state.filters.push((r) => vals.includes(r[col]))
      return builder
    },
    or(expr: string) {
      const subs = expr
        .split(",")
        .map(parseOrClause)
        .filter((f): f is (r: Record<string, unknown>) => boolean => f != null)
      if (subs.length) state.filters.push((r) => subs.some((f) => f(r)))
      return builder
    },
    limit(n: number) {
      state.limitN = n
      return builder
    },
    single() {
      state.single = true
      state.limitN = 1
      return builder
    },
    maybeSingle() {
      state.single = true
      state.limitN = 1
      return builder
    },
    then<TResult1 = { data: unknown; error: null; count: number | null }, TResult2 = never>(
      onFulfilled?:
        | ((v: { data: unknown; error: null; count: number | null }) => TResult1 | PromiseLike<TResult1>)
        | null,
      onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ): Promise<TResult1 | TResult2> {
      return Promise.resolve(execute()).then(
        onFulfilled ?? undefined,
        onRejected ?? undefined
      )
    },
  }

  return builder
}

interface MockBuilder extends PromiseLike<{ data: unknown; error: null; count: number | null }> {
  select(cols?: string, opts?: { count?: string; head?: boolean }): MockBuilder
  order(col: string, opts?: { ascending?: boolean }): MockBuilder
  eq(col: string, val: unknown): MockBuilder
  in(col: string, vals: unknown[]): MockBuilder
  or(expr: string): MockBuilder
  limit(n: number): MockBuilder
  single(): MockBuilder
  maybeSingle(): MockBuilder
}

export function createMockClient() {
  return {
    from(table: string) {
      return makeBuilder(table)
    },
    rpc(_fn: string, _args?: unknown) {
      return Promise.resolve({ data: [], error: null })
    },
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
  }
}

export function isPlaceholderEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return true
  if (url.includes("your-project") || key.startsWith("your-")) return true
  return false
}
