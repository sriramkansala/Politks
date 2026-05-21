"use client"

// Linear/FF Input — single 1px border, single focus indicator.
// Wraps the input in a label only when an icon is needed (otherwise plain).
// All styling lives in `.linear-input` in app/globals.css — keeps Tailwind
// variant gotchas (focus-within with arbitrary CSS vars) out of the picture.

import * as React from "react"
import { cn } from "@/lib/utils"
import type { IconComponent } from "@/lib/icon-context"

interface InputProps extends React.ComponentProps<"input"> {
  leadingIcon?: IconComponent
  trailingIcon?: IconComponent
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, leadingIcon: LeadingIcon, trailingIcon: TrailingIcon, ...props },
    ref
  ) => {
    // Always wrap in <label> so .linear-input's flex layout is correctly
    // applied to a *container*, not the bare <input> itself — otherwise
    // the placeholder loses vertical centering and looks clipped.
    return (
      <label className={cn("linear-input", className)}>
        {LeadingIcon && (
          <span className="lead-icon inline-flex items-center">
            <LeadingIcon size={14} strokeWidth={1.5} />
          </span>
        )}
        <input ref={ref} type={type} {...props} />
        {TrailingIcon && (
          <span className="trail-icon inline-flex items-center">
            <TrailingIcon size={14} strokeWidth={1.5} />
          </span>
        )}
      </label>
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }
