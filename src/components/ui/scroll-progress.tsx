import { createContext, useContext, type RefObject } from "react"
import { motion, MotionProps, useScroll } from "motion/react"

import { cn } from "@/lib/utils"

/** Ref al contenedor que hace scroll (ej. main con overflow-auto). Si no hay, se usa el viewport. */
export const ScrollContainerContext = createContext<RefObject<HTMLElement | null> | null>(null)

export function useScrollContainer() {
  return useContext(ScrollContainerContext)
}

interface ScrollProgressProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  ref?: React.Ref<HTMLDivElement>
}

export function ScrollProgress({
  className,
  ref,
  ...props
}: ScrollProgressProps) {
  const containerRef = useScrollContainer()
  const { scrollYProgress } = useScroll(
    containerRef
      ? { container: containerRef, trackContentSize: true }
      : {}
  )

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  )
}
