"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useShape } from "@/lib/shape-context"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const shape = useShape()
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full border px-3 py-1.5 text-[13px] outline-none",
          "transition-[border-color,box-shadow] duration-80",
          "border-[var(--border)] bg-[var(--bg-elevated-2)]",
          "placeholder:text-[var(--text-disabled)] text-[var(--text-primary)]",
          "focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          shape.input,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
