"use client"

import { motion, useInView } from "framer-motion"
import { useRef, type ReactNode } from "react"
import { springs } from "@/lib/springs"

interface AnimateInProps {
  children: ReactNode
  delay?: number
  className?: string
  /** Stagger children using variants */
  stagger?: boolean
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: springs.moderate },
}

/** Wraps children in a fade+slide entrance triggered by viewport entry. */
export function AnimateIn({ children, delay = 0, className, stagger = false }: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ ...springs.moderate, delay }}
      className={className}
    >
      {children}
    </motion.div>
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
