import { memo, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TerminalPrompt } from "@/components/terminal/TerminalPrompt";

interface TerminalOutputProps {
  command: string;
  output: ReactNode;
}

const springEnter = { type: "spring" as const, bounce: 0, duration: 0.28 };

export const TerminalOutput = memo(function TerminalOutput({
  command,
  output,
}: TerminalOutputProps) {
  const reduceMotion = useReducedMotion();
  const enterHidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 };
  const enterVisible = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const exit = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 2 };
  const transition = reduceMotion ? { duration: 0.15 } : springEnter;

  return (
    <motion.div
      layout
      initial={enterHidden}
      animate={enterVisible}
      exit={exit}
      transition={transition}
      className="mb-3 text-sm"
    >
      <div className="mb-0.5 flex flex-wrap items-center gap-2 text-xs">
        <TerminalPrompt compact />
        <span className="text-foreground">{command}</span>
      </div>
      <div className="mt-2">{output}</div>
    </motion.div>
  );
});
