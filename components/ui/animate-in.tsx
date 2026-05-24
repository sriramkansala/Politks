"use client"

// Page-entry animations tuned per Fluid Functionalism:
//   - Real physics-based spring (NOT the legacy duration-based "moderate").
//   - Lower stiffness + higher damping for a smooth glide.
//   - Slightly longer Y offset so the motion is felt without being theatrical.
//   - Slower stagger so the cards "cascade" instead of "pop".

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
  show: {
    transition: {
      staggerChildren: 0.07, // FF: 70ms between siblings — perceived as a glide
      delayChildren: 0,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: springs.gentle, // physics-based: stiffness 200, damping 26
  },
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
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ ...springs.gentle, delay }}
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

/** Shared tab-panel entrance: tiny y-slide + fade, tuned to springs.gentle.
 *  Use this in any tab strip's panels so all tabs feel identical. */
export function PanelMotion({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
      className={className}
    >
      {children}
    </motion.div>
  )
}
