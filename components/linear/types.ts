// Shared data shapes for the Linear-style issue components. Pure types.

import type { IssueStatus, IssuePriority } from "./status"

export interface IssueLabel {
  label: string
  color: string
}

export interface IssuePerson {
  id: string
  name: string
  /** Avatar background; falls back to brand indigo. */
  color?: string
}

export interface Issue {
  /** Human id, e.g. "ENG-128". */
  id: string
  title: string
  description?: string
  status: IssueStatus
  priority: IssuePriority
  labels: IssueLabel[]
  assignee?: IssuePerson | null
  project?: string | null
  milestone?: string | null
  cycle?: string | null
  /** Pre-formatted display string, e.g. "May 30". */
  dueDate?: string | null
  createdBy?: IssuePerson | null
}
