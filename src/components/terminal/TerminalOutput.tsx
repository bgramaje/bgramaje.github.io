import { memo, type ReactNode } from "react";
import { motion } from "motion/react";
import { TerminalPrompt } from "./TerminalPrompt";

interface TerminalOutputProps {
  command: string;
  output: ReactNode;
}

const enterEase = [0.16, 1, 0.3, 1] as const;

export const TerminalOutput = memo(function TerminalOutput({
  command,
  output,
}: TerminalOutputProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.25, ease: enterEase }}
      className="mb-3 text-sm"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: enterEase }}
        className="mb-0.5 flex flex-wrap items-center gap-2 text-xs"
      >
        <TerminalPrompt compact />
        <span className="text-foreground">{command}</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.25, ease: enterEase }}
        className="mt-2"
      >
        {output}
      </motion.div>
    </motion.div>
  );
});
