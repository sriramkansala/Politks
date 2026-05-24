"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, MapPin } from "lucide-react"
import { StatusPill } from "./StatusPill"
import type { PromiseRow } from "@/lib/db/types"
import { cn } from "@/lib/utils"
import { fontWeights } from "@/lib/font-weight"

interface PromiseCardProps {
  promise: PromiseRow
  partySlug?: string
  className?: string
}

export function PromiseCard({ promise, className }: PromiseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Link
        href={`/promises/${promise.id}`}
        className={cn(
          "group flex items-start gap-3 px-4 py-3 transition-colors duration-100",
          "hover:bg-[var(--bg-elevated-2)]",
          className
        )}
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Category dot */}
        <div
          className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: "var(--accent)" }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <span
              className="text-[13px] leading-snug truncate"
              style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.normal }}
            >
              {promise.title}
            </span>
            <StatusPill status={promise.status} />
          </div>

          <div className="flex items-center gap-3 mt-1">
            <span
              className="text-caption flex items-center gap-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              <span
                className="px-1.5 py-0.5 rounded-[2px] text-[10px] uppercase tracking-wide"
                style={{
                  background: "var(--bg-elevated-2)",
                  color: "var(--text-secondary)",
                  fontVariationSettings: fontWeights.medium,
                }}
              >
                {promise.category.replace(/_/g, " ")}
              </span>
            </span>

            {promise.geography !== "national" && (
              <span
                className="text-caption flex items-center gap-0.5"
                style={{ color: "var(--text-tertiary)" }}
              >
                <MapPin size={10} strokeWidth={1.5} />
                {promise.geography}
              </span>
            )}

            {promise.page_ref && (
              <span
                className="text-caption flex items-center gap-0.5"
                style={{ color: "var(--text-tertiary)" }}
              >
                <FileText size={10} strokeWidth={1.5} />
                p.{promise.page_ref}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
