"use client";

// Fluid-Functionalism: Elevated.
//
// Wraps children in an automatically-tiered surface. Each nested <Elevated>
// reads the current `useSurface()` substrate level, adds its `offset`, and
// re-provides the new level to descendants (capped at 8). This produces the
// "elevation ladder" used by dropdowns, popovers and dialogs so that a popover
// inside a popover always reads as one level above its parent.
//
// shadowLevel (optional) overrides the rendered shadow weight if the visual
// elevation needs to differ from the logical one (e.g. a popover at surface
// 3 that should still cast a level-2 shadow when adjacent to its trigger).

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { SurfaceProvider, useSurface } from "@/lib/surface-context";
import { surfaceClasses } from "@/lib/surface-classes";

export interface ElevatedProps extends HTMLAttributes<HTMLDivElement> {
  /** How many levels above the current substrate to lift to. Common values:
   *  2 for dropdowns/popovers, 4 for dialogs/modals. */
  offset: number;
  /** Override the rendered shadow weight. Defaults to the new surface level. */
  shadowLevel?: number;
  /** Force-disable shadow class application (e.g. for inline elevation). */
  noShadow?: boolean;
  children: ReactNode;
}

export const Elevated = forwardRef<HTMLDivElement, ElevatedProps>(
  ({ offset, shadowLevel, noShadow, className, children, ...props }, ref) => {
    const substrate = useSurface();
    const level = Math.min(Math.max(1, substrate + offset), 8);
    const cls = noShadow
      ? surfaceClasses(level, level).split(" ").filter((c) => !c.startsWith("shadow-")).join(" ")
      : surfaceClasses(level, shadowLevel ?? level);

    return (
      <SurfaceProvider value={level}>
        <div ref={ref} className={cn(cls, className)} {...props}>
          {children}
        </div>
      </SurfaceProvider>
    );
  }
);

Elevated.displayName = "Elevated";
