import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const spring = { type: "spring" as const, bounce: 0, duration: 0.28 };

/** Staggered enter for terminal list rows. Cap keeps long lists snappy. */
export function StaggerItem({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const delay = reduceMotion ? 0 : Math.min(index * 0.05, 0.4);

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0.15, delay } : { ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}
