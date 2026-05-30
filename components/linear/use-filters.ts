// Derives which issues match the current AppliedFilter[] set. Filters combine
// with AND across properties; within one property the operator decides match
// semantics. A filter with no chosen values is treated as inactive (matches
// everything), mirroring Linear, where an empty pill doesn't constrain results.

import { useMemo } from "react"
import type { Issue } from "./types"
import type { AppliedFilter } from "./filter-types"

// Map a property key → the value id(s) for a given issue.
function issueValueIds(issue: Issue, propertyKey: string): string[] {
  switch (propertyKey) {
    case "status":
      return [issue.status]
    case "priority":
      return [issue.priority]
    case "assignee":
      return issue.assignee ? [issue.assignee.id] : ["unassigned"]
    case "labels":
      return issue.labels.map((l) => l.label)
    case "project":
      return issue.project ? [issue.project] : []
    default:
      return []
  }
}

function matches(issue: Issue, f: AppliedFilter): boolean {
  if (f.valueIds.length === 0) return true // inactive pill
  const ids = issueValueIds(issue, f.propertyKey)
  const intersects = f.valueIds.some((v) => ids.includes(v))
  switch (f.operator) {
    case "is":
    case "includes":
      return intersects
    case "is_not":
    case "excludes":
      return !intersects
    default:
      return true
  }
}

export function useFilteredIssues(issues: Issue[], filters: AppliedFilter[]): Issue[] {
  return useMemo(
    () => issues.filter((issue) => filters.every((f) => matches(issue, f))),
    [issues, filters]
  )
}
