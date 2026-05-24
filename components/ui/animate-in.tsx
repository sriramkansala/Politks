"use client"

import { motion, AnimatePresence, useInView } from "framer-motion"
import { useRef, type ReactNode } from "react"
import { springs } from "@/lib/springs"

interface AnimateInProps {
  children: ReactNode
  delay?: number
  className?: string
  /** Stagger children using variants */
  stagger?: boolean
  /** Optional element tag override (default: div) */
  as?: "div" | "section" | "header" | "article"
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: springs.responsive },
}

/** Wraps children in a fade+slide entrance triggered by viewport entry. */
export function AnimateIn({ children, delay = 0, className, stagger = false, as = "div" }: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const MotionTag = motion[as] as typeof motion.div

  if (stagger) {
    return (
      <MotionTag
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className={className}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ ...springs.responsive, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}

/** Panel-style mount: fade + slight scale for popovers/dialogs/sheets. */
export function PanelMotion({ children, className, open = true }: { children: ReactNode; className?: string; open?: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.99 }}
          transition={springs.snap}
          className={className}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

/** Use inside an AnimateIn with stagger=true to stagger individual items. */
export function AnimateItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
