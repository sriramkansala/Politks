"use client"

import { motion, useInView } from "framer-motion"
import { useRef, type ReactNode } from "react"
import { springs } from "@/lib/springs"

interface MotionSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

/** Server-safe section wrapper: fades+slides on viewport entry.
 *  Renders a real <section> so layouts and semantics are preserved. */
export function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ ...springs.responsive, delay }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/** Heading wrapper — keeps semantic <h1>/<h2> children, but adds entrance motion. */
export function MotionHeading({ children, className, delay = 0 }: MotionSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 6 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ ...springs.responsive, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
