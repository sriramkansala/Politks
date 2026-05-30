// Data model for the filtering workflow. A FilterProperty (Status, Priority,
// Assignee, …) declares its allowed operators and selectable values; an
// AppliedFilter is one active pill (property + operator + chosen value ids).

import type { ReactNode } from "react"

export type FilterOperator = "is" | "is_not" | "includes" | "excludes"

export interface FilterValue {
  id: string
  label: string
  /** Leading glyph (status/priority icon). Takes precedence over `color`. */
  icon?: ReactNode
  /** Leading colour dot when there's no icon (assignee / label). */
  color?: string
}

export interface FilterProperty {
  key: string
  label: string
  icon: ReactNode
  /** First entry is the default operator. Defaults to ["is","is_not"]. */
  operators?: FilterOperator[]
  values: FilterValue[]
  /** Allow selecting multiple values. */
  multi?: boolean
}

export interface AppliedFilter {
  propertyKey: string
  operator: FilterOperator
  valueIds: string[]
}
