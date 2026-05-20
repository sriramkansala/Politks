"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion, LayoutGroup } from "framer-motion"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/springs"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => (
  <LayoutGroup id={React.useId()}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "relative inline-flex items-center gap-1 rounded-[6px] p-1",
        className
      )}
      style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)" }}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  </LayoutGroup>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const internalRef = React.useRef<HTMLButtonElement>(null)
  const [isActive, setIsActive] = React.useState(false)

  React.useEffect(() => {
    const el = internalRef.current
    if (!el) return
    const update = () => setIsActive(el.dataset.state === "active")
    const observer = new MutationObserver(update)
    observer.observe(el, { attributes: true, attributeFilter: ["data-state"] })
    update()
    return () => observer.disconnect()
  }, [])

  return (
    <TabsPrimitive.Trigger
      ref={(node) => {
        (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }}
      className={cn(
        "relative px-3 h-7 rounded-[4px] text-[12px] font-[450] transition-colors duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B97FF]",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      style={{ color: isActive ? "var(--text-primary)" : "var(--text-tertiary)" }}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="tabs-active"
          className="absolute inset-0 rounded-[4px]"
          style={{ background: "var(--bg-elevated)" }}
          transition={springs.moderate}
        />
      )}
      <span
        className="relative z-10"
        style={{
          fontVariationSettings: isActive ? "'wght' 510" : "'wght' 400",
          transition: "font-variation-settings 120ms",
        }}
      >
        {children}
      </span>
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("focus-visible:outline-none", className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
